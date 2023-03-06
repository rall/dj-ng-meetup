import { OnInit, Component, QueryList, ViewChildren, ViewContainerRef, ViewChild, ComponentRef, OnDestroy } from '@angular/core';
import { combineLatest, filter, from, fromEvent, map, merge, mergeMap, Observable, of, ReplaySubject, scan, shareReplay, Subject, switchMap, takeUntil, tap, withLatestFrom, zip } from 'rxjs';
import { Control, MappingService, Risk, Stripe } from '../mapping.service';
import { Coordinates } from './coordinate.service';
import { LineComponent } from './line/line.component';
import { MappableItemComponent } from './mappable-item/mappable-item.component';

type StripeMap = Map<Stripe, ComponentRef<LineComponent>>
type StripeTuple = [ string, string ]

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.css']
})
export class MapperComponent implements OnInit, OnDestroy {
  @ViewChild("linesContainer", { static: true, read: ViewContainerRef }) svgTarget: ViewContainerRef
  @ViewChildren(MappableItemComponent) set mappableItems(mappableItems: QueryList<MappableItemComponent>) {
    this.mappableComponent$.next(mappableItems)
  }

  currentLine = new Subject<ComponentRef<LineComponent>>()
  stopDrawing = new Subject<void>()

  constructor(private mappingService: MappingService, private viewContainerRef: ViewContainerRef) {}

  private destroyed = new Subject<void>()

  risk$ = this.mappingService.risks
  control$ = this.mappingService.controls

  private mappableComponent$ = new ReplaySubject<QueryList<MappableItemComponent>>(1)
  
  private addStripe = new ReplaySubject<StripeTuple>()
  private removeStripe = new Subject<StripeTuple>()
  private editStripe = new Subject<Stripe>()

  private stripeMapSubject = new Subject<StripeMap>()


  private allComponent$ = combineLatest([this.risk$, this.control$]).pipe(
    map(([risks, controls]) => risks.length + controls.length),
    switchMap(count => this.mappableComponent$.pipe(
      filter(queryList => queryList.length === count),
      switchMap(queryList => from(queryList.toArray())),
    ))
  )

  private componentMap$ = combineLatest([this.risk$, this.control$]).pipe(
    map(([risks, controls]) => risks.length + controls.length),
    switchMap(count => this.mappableComponent$.pipe(
      filter(queryList => queryList.length === count),
      map(queryList => queryList.toArray().reduce((acc, next) => acc.set(next.entity.id, next), new Map<string, MappableItemComponent>()))
    )),
    shareReplay(1),
  )

  private line$ = this.addStripe.pipe(
    map(_ => this.viewContainerRef.createComponent(LineComponent)),
    shareReplay(),
  )

  private stripesAndMap$ = combineLatest([this.addStripe, this.componentMap$]).pipe(
    shareReplay(),
  )

  private origin$ = this.stripesAndMap$.pipe(
    map(([stripe, map]) => map.get(stripe[0])),
    shareReplay(),
  )

  private destination$ = this.stripesAndMap$.pipe(
    map(([stripe, map]) => map.get(stripe[1])),
    shareReplay(),
  )

  private assignOrigin = zip([this.line$, this.origin$]).pipe(
    mergeMap(([line, origin]) => origin.coordinate$.pipe(
      tap(coordinates => line.instance.origin = coordinates)
    ))
  )

  private assignDestination = zip([this.line$, this.destination$]).pipe(
    mergeMap(([line, destination]) => destination.coordinate$.pipe(
      tap(coordinates => line.instance.destination = coordinates)
    ))
  )

  delete$ = this.removeStripe.pipe(
    withLatestFrom(this.stripeMapSubject),
    // tap(([stripe, stripeMap]) => stripeMap.get(stripe).destroy()),
    map(([stripe]) => [stripe, null]),
  )

  private handle$ = this.allComponent$.pipe(
    mergeMap(component => of(component).pipe(
      mergeMap(comp => comp.nativeElement$.pipe(
        map<HTMLDivElement, [MappableItemComponent, HTMLDivElement]>(elem => [comp, elem])
      ),
    ))
  ))

  private mousedown$ = this.handle$.pipe(
    mergeMap(([component, elem]) => fromEvent(elem, 'mousedown').pipe(
      map(_ => component.entity.id)
    )),
    takeUntil(this.destroyed),
  )

  private mouseover$ = this.handle$.pipe(
    mergeMap(([component, elem]) => fromEvent(elem, 'mouseover').pipe(
      map(_ => ({ over: true, id: component.entity.id }))
    )),
    takeUntil(this.destroyed),
  )

  private mouseout$ = this.handle$.pipe(
    mergeMap(([component, elem]) => fromEvent(elem, 'mouseout').pipe(
      map(_ => ({ over: false, id: component.entity.id }))
    )),
    takeUntil(this.destroyed),
  )

  private mouseup$ = fromEvent(window, 'mouseup').pipe(
    takeUntil(this.destroyed),
  )

  private mousemove$ = fromEvent(window, 'mousemove').pipe(
    takeUntil(this.destroyed),
  )

  private rollover$ = merge(this.mouseover$, this.mouseout$).pipe(
    scan((acc, evt) => {
      if (evt.over) {
        return evt.id
      } else if (acc === evt.id) {
        return null
      } else {
        return acc // TODO handle edge cases (nested handles?)
      }
    }, ""),
  )

  private newLine$ = this.mousedown$.pipe(
    map(_ => this.viewContainerRef.createComponent(LineComponent)),
    shareReplay<ComponentRef<LineComponent>>(1),
  )

  private newOrigin$ = this.mousedown$.pipe(
    withLatestFrom(this.componentMap$, (id, map) => map.get(id)),
  )

  private draw$ = zip([this.newLine$, this.newOrigin$]).pipe(
    mergeMap(([line, origin]) => origin.coordinate$.pipe(
      tap(coordinates => line.instance.origin = coordinates)
    ))
  )

  private drawDestination$ = this.newLine$.pipe(
    switchMap(line => this.mousemove$.pipe(
      map<MouseEvent, Coordinates>(event => [event.clientX, event.clientY]),
      tap(coordinates => line.instance.destination = coordinates),
      takeUntil(line.instance.destroyed),
    ))
  )


  private rolloverJoin$ = this.newOrigin$.pipe(
    switchMap(origin => this.rollover$.pipe(
      withLatestFrom(this.componentMap$, (id, map) => map.get(id)),
      filter(Boolean),
      filter((dest) => origin.entity.type !== dest.entity.type),
      map<MappableItemComponent, [MappableItemComponent, MappableItemComponent]>(dest => [origin, dest])
    )),
  )

  private rolloverDetache$ = this.newOrigin$.pipe(
    switchMap(_ => this.rollover$.pipe(
      filter(r => !r),
      map(r => undefined)
    )),
  )

  private createLine$ = merge(this.rolloverJoin$, this.rolloverDetache$).pipe(
    switchMap(pair => this.mouseup$.pipe(
      filter(Boolean),
      map(_ => pair),
      filter(Boolean),
      map(([orig, dest]) => [orig.entity.id, dest.entity.id])
    ))
  )


  ngOnInit() {
    merge(this.assignDestination, this.assignOrigin).subscribe()
    this.componentMap$.pipe(
      switchMap(_ => this.mappingService.stripes),
      map(stripe => [ stripe.riskId, stripe.controlId ])
    ).subscribe(this.addStripe)
      
    merge(this.draw$, this.drawDestination$).subscribe()
    this.createLine$.subscribe(this.addStripe)
    this.newLine$.pipe(
      switchMap(line => this.mouseup$.pipe(
        tap(_ => line.destroy())
      )),
    ).subscribe()

    this.line$.pipe(
      mergeMap(line => line.instance.deleteMe.pipe(
        tap(line => console.log(line)),
      ))
    ).subscribe()

  }




  ngOnDestroy() {
    this.destroyed.next()
  }

}

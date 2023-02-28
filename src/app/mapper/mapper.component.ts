import { AfterViewInit, OnInit, Component, QueryList, ViewChildren, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';
import { from, identity, map, mergeMap, share, shareReplay, Subject, switchMap, tap, withLatestFrom, zip } from 'rxjs';
import { MappingService, Stripe } from '../mapping.service';
import { LineComponent } from './line/line.component';
import { ControlComponent } from './mappable-item/control/control.component';
import { RiskComponent } from './mappable-item/risk/risk.component';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.css']
})
export class MapperComponent implements OnInit {
  @ViewChild("linesContainer", { static: true, read: ViewContainerRef }) svgTarget: ViewContainerRef
  @ViewChildren(RiskComponent) set risks(risks: QueryList<RiskComponent>) {
    this.riskComponent$.next(risks)
    // risks.toArray().forEach(risk => {
    //   const line = this.viewContainerRef.createComponent(LineComponent)
    //   risk.top$.subscribe(top => line.instance.y1 = String(top))
    //   risk.left$.subscribe(left => line.instance.x1 = String(left))
    //   line.changeDetectorRef.detectChanges()
    // })
  }
  @ViewChildren(ControlComponent) set controls(controls: QueryList<ControlComponent>) {
    this.controlComponent$.next(controls)
  }

  constructor(private mappingService: MappingService, private viewContainerRef: ViewContainerRef) {}


  risk$ = this.mappingService.risks
  control$ = this.mappingService.controls

  private riskComponent$ = new Subject<QueryList<RiskComponent>>
  private controlComponent$ = new Subject<QueryList<ControlComponent>>

  private stripe$ = zip([this.riskComponent$, this.controlComponent$]).pipe(
    switchMap(([risks, controls]) => this.mappingService.stripes.pipe(
      switchMap(stripes => from(stripes).pipe(
        map<Stripe, [RiskComponent, ControlComponent]>(stripe => [
          risks.find(riskComponent => riskComponent.risk.id === stripe.riskId),
          controls.find(controlComponent => controlComponent.control.id === stripe.controlId)
        ])
      ))
    )),
    share(),
  )

  private riskEndCoordinate$ = this.stripe$.pipe(
    map(([risk]) => risk.coordinate$),
    share(),
  )

  private controlEndCoordinate$ = this.stripe$.pipe(
    map(([_, control]) => control.coordinate$),
    share(),
  )

  private line$ = this.stripe$.pipe(
    map(_ => this.viewContainerRef.createComponent(LineComponent)),
    shareReplay(),
  )

  private assignOrigin$ = zip([this.line$, this.riskEndCoordinate$]).pipe(
    map(([line, origin$]) => line.instance.origin$ = origin$),
  )

  private assignDestination$ = zip([this.line$, this.riskEndCoordinate$]).pipe(
    map(([line, destination$]) => line.instance.destination$ = destination$),
  )

  ngOnInit() {
    this.assignOrigin$.subscribe()
    this.assignDestination$.subscribe()
  }
}

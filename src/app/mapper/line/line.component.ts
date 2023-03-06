import { Component, ElementRef, HostBinding, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { combineLatest, fromEvent, map, ReplaySubject, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { Coordinates } from '../coordinate.service';

@Component({
  templateUrl: './line.component.svg',
  selector: 'svg',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnDestroy {
  originSubject = new ReplaySubject<Coordinates>(1)
  destinationSubject = new ReplaySubject<Coordinates>(1)

  destroyed = new Subject<void>()
  private nativeElement$ = new Subject<SVGLineElement>()

  @ViewChild('line', { read: ElementRef }) set line(line: ElementRef<SVGLineElement>) {
    this.nativeElement$.next(line.nativeElement)
  }

  @Input() set origin(origin: Coordinates) {
    this.originSubject.next(origin)
  }
  @Input() set destination(destination: Coordinates) {
    this.destinationSubject.next(destination)
  }
  @Input() strokeWidth = 4

  x1$ = this.originSubject.pipe(
    map(([x]) => x - (this.strokeWidth / 2)),
  )

  y1$ = this.originSubject.pipe(
    map(([_, y]) => y - (this.strokeWidth / 2)),
  )

  x2$ = this.destinationSubject.pipe(
    map(([x]) => x - (this.strokeWidth / 2)),
  )

  y2$ = this.destinationSubject.pipe(
    map(([_, y]) => y - (this.strokeWidth / 2)),
  )

  visibilitie$ = combineLatest([this.x1$, this.x2$, this.y1$, this.y2$]).pipe(
    map(_ => "visible"),
    startWith("collapse"),
  )

  @HostBinding("attr.stroke") stroke = "orange"
  @HostBinding("attr.stroke-width") widthAsString = `${this.strokeWidth}px`

  @Output() deleteMe = this.nativeElement$.pipe(
    switchMap(element => fromEvent(element, 'click').pipe(
      takeUntil(this.destroyed),
      map(_ => this),
    ))
  )

  ngOnDestroy() {
    this.destroyed.next()
  }
}

import { Component, Directive, HostBinding, Input, OnInit } from '@angular/core';
import { map, Observable, ReplaySubject, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  templateUrl: './line.component.svg',
  selector: 'svg',
  styleUrls: ['./line.component.css']
})
export class LineComponent {
  private id = 0
  containerId = `svg-line-${this.id++}` 
  
  private originSubject = new ReplaySubject<Observable<[number, number]>>(1)
  @Input() set origin$(origin$: Observable<[number, number]>) {
    console.log('set origin', origin$)
    this.originSubject.next(origin$)
  }

  private destinationSubject = new ReplaySubject<Observable<[number, number]>>(1)
  @Input() set destination$(dest$: Observable<[number, number]>) {
    this.destinationSubject.next(dest$)
  }

  x1$ = this.originSubject.pipe(
    switchMap((origin$) => origin$.pipe(
      map(([x]) => x)
    )),
    tap(console.log),
    shareReplay(1),
  )
  y1$ = this.originSubject.pipe(
    switchMap((origin$) => origin$.pipe(
      map(([_, y]) => y)
    )),
    tap(console.log),
  )
  x2$ = this.destinationSubject.pipe(
    switchMap((destination$) => destination$.pipe(
      map(([x]) => x)
    )),
    tap(console.log),
  )
  y2$ = this.destinationSubject.pipe(
    switchMap((destination$) => destination$.pipe(
      map(([_, y]) => y)
    )),
    tap(console.log),
  )

  @HostBinding("attr.stroke") stroke = "orange"
  @HostBinding("attr.stroke-width") strokeWidth = "4px"

}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, merge, ReplaySubject, share, shareReplay, Subject, switchMap } from 'rxjs';

@Component({
  template: ''
})
export class MappableItemComponent {
  @ViewChild("handle") set handle(handle: ElementRef<HTMLDivElement>) {
    fromEvent(handle.nativeElement, "mouseover").pipe(
      map(_ => `over ${Date.now()}`),
    ).subscribe(this.mouseOver$)
    fromEvent(handle.nativeElement, "mouseout").pipe(
      map(_ => `out ${Date.now()}`),
    ).subscribe(this.mouseOut$)
    this.nativeElement$.next(handle.nativeElement)
  }

  mouseOver$ = new Subject<string>
  mouseOut$ = new Subject<string>

  private nativeElement$ = new ReplaySubject<HTMLDivElement>(1);

  private resize$ = fromEvent(window, 'resize').pipe(
    debounceTime(10)
  )

  private scroll$ = fromEvent(window, 'scroll').pipe(
    debounceTime(10)
  )

  private nativeElementAfterRedraw$ = merge(this.resize$, this.scroll$).pipe(
    switchMap(_ => this.nativeElement$),
  )

  private element$ = merge(this.nativeElement$, this.nativeElementAfterRedraw$).pipe(
    shareReplay(1)
  )

  coordinate$ = this.element$.pipe(
    map<HTMLDivElement, [number, number]>(element => [
      element.offsetTop + (element.offsetHeight / 2) - 2,
      element.offsetLeft + (element.offsetWidth / 2) - 2
    ])
  )
}

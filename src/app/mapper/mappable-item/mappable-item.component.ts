import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, map, ReplaySubject, Subject } from 'rxjs';

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
    this.top$.next(handle.nativeElement.offsetTop)
    this.left$.next(handle.nativeElement.offsetLeft)
  }

  constructor(private elem: ElementRef) {
  }

  get position() {
    return [this.elem.nativeElement.offsetLeft, this.elem.nativeElement.offsetTop]
  }

  top$ = new ReplaySubject<number>(1)
  left$ = new ReplaySubject<number>(1)

  mouseOver$ = new Subject<string>
  mouseOut$ = new Subject<string>
}

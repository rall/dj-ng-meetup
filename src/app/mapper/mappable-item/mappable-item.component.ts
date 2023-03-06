import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map, merge, mergeWith, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import { Risk, Control } from 'src/app/mapping.service';
import { Coordinates } from '../coordinate.service';

@Component({
  selector: 'app-mappable',
  templateUrl: './mappable-item.component.html',
  styleUrls: ['./mappable-item.component.css'],
})
export class MappableItemComponent {
  @ViewChild("handle") set handle(handle: ElementRef<HTMLDivElement>) {
    this.nativeElement$.next(handle.nativeElement)
  }

  @Input() entity: Risk | Control;

  private destroyed = new Subject<void>()

  nativeElement$ = new ReplaySubject<HTMLDivElement>(1);

  private resize$ = fromEvent(window, 'resize').pipe(
    debounceTime(10),
    takeUntil(this.destroyed),
  )

  private scroll$ = fromEvent(window, 'scroll').pipe(
    debounceTime(10),
    takeUntil(this.destroyed),
  )

  coordinate$ = merge(this.resize$, this.scroll$).pipe(
    switchMap(_ => this.nativeElement$),
    mergeWith(this.nativeElement$),
    map<HTMLDivElement, Coordinates>(element => [
      element.offsetLeft + (element.offsetWidth / 2),
      element.offsetTop + (element.offsetHeight / 2)
    ])
  )
}

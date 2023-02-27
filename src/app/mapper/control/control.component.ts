import { Component, ElementRef } from '@angular/core';
import { MappableItemComponent } from '../mappable-item/mappable-item.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent extends MappableItemComponent {
  constructor(elem: ElementRef) {
    super(elem)
  }
}

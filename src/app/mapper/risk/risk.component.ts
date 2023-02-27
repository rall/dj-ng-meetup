import { Component, ElementRef } from '@angular/core';
import { MappableItemComponent } from '../mappable-item/mappable-item.component';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.css']
})
export class RiskComponent extends MappableItemComponent {
  constructor(elem: ElementRef) {
    super(elem)
  }
}

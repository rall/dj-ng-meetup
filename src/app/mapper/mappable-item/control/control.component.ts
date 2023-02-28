import { Component, Input } from '@angular/core';
import { Control } from 'src/app/mapping.service';
import { MappableItemComponent } from '../mappable-item.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['../mappable-item.component.css', './control.component.css']
})
export class ControlComponent extends MappableItemComponent {
  @Input() control: Control

}

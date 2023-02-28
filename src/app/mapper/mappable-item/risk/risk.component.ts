import { Component, Input } from '@angular/core';
import { Risk } from 'src/app/mapping.service';
import { MappableItemComponent } from '../mappable-item.component';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['../mappable-item.component.css', './risk.component.css']
})
export class RiskComponent extends MappableItemComponent {
  @Input() risk: Risk
}

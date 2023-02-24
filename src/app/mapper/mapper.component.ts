import { Component, QueryList, ViewChildren } from '@angular/core';
import { RiskComponent } from './risk/risk.component';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.css']
})
export class MapperComponent {

  @ViewChildren(RiskComponent) risks!: QueryList<RiskComponent>

}

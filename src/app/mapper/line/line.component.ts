import { Component } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent {
  private id = 0
  containerId = `svg-line-${this.id++}` 


}

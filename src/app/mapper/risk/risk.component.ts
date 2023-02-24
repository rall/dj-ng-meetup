import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.css']
})
export class RiskComponent {
  constructor(private elem: ElementRef) { }

  get position() {
    return [this.elem.nativeElement.offsetTop, this.elem.nativeElement.offsetLeft]
  }
}

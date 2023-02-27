import { Component, Directive, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './line.component.svg',
  selector: 'svg',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {
  private id = 0
  containerId = `svg-line-${this.id++}` 

  @Input() set origin(origin: string[]) {
    console.log("set origin", origin)
    this.x1 = origin[0]
    this.y1 = origin[1]
  }
  @Input() dest: any[] = ["150", "150"]
  
  x1: string
  y1: string
  x2: string
  y2: string

  // @HostBinding("attr.x1") x1: string;

  // @HostBinding("attr.y1") y1: string;

  // @HostBinding("attr.x2") get x2() {
  //   return this.dest[0]
  // }

  // @HostBinding("attr.y2") get y2() {
  //   return this.dest[1]
  // }

  @HostBinding("attr.stroke") stroke = "orange"
  @HostBinding("attr.stroke-width") strokeWidth = "4px"

  ngOnInit() {
    console.log('oninit', this)
  }

  ngAfterViewInit() {
    console.log('afterviewinit', this)
  }
}

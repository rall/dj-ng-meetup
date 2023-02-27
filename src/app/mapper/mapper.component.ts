import { AfterViewInit, OnInit, Component, QueryList, ViewChildren, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';
import { LineComponent } from './line/line.component';
import { RiskComponent } from './risk/risk.component';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.css']
})
export class MapperComponent {
  @ViewChild("linesContainer", { static: true, read: ViewContainerRef }) svgContainer: ViewContainerRef
  @ViewChild("svgline", { static: true, read: TemplateRef }) lineSVG: TemplateRef<any>
  @ViewChild("lines", { static: true, read: ViewContainerRef }) lines: ViewContainerRef
  @ViewChildren(RiskComponent) set risks(risks: QueryList<RiskComponent>) {
    console.log(risks)

    risks.toArray().forEach(risk => {
      // const line = this.lines.createEmbeddedView(this.lineSVG, { $implicit: risk.position })

      // console.log(line.context)

      // line.detectChanges()

      // line.setAttribute('origin', risk.position)
      // this.lineSVG.insert(line)
      // this.renderer.addClass(line, 'someline')
      console.log(risk.position)
      // this.renderer.appendChild(this.lineSVG, line)
      // line.instance.origin = risk.position

      const line = this.svgContainer.createComponent(LineComponent)
      risk.top$.subscribe(top => line.instance.y1 = String(top))
      risk.left$.subscribe(left => line.instance.x1 = String(left))
      line.changeDetectorRef.detectChanges()
    })


  }

  constructor(private viewContainerRef: ViewContainerRef) {}


  // ngAfterViewInit() {
  //   this.risks.changes.subscribe(
  //     console.log
  //   )

  //   this.risks.toArray().forEach(risk => {
  //     const line = this.lines.createEmbeddedView(this.lineSVG, { origin: risk.position })

  //     console.log(line.context)

  //     // line.setAttribute('origin', risk.position)
  //     // this.lineSVG.insert(line)
  //     // this.renderer.addClass(line, 'someline')
  //     console.log(risk.position)
  //     // this.renderer.appendChild(this.lineSVG, line)
  //     // line.instance.origin = risk.position
  //   })
  // }
}

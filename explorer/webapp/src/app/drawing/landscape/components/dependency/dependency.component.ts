import {Component, Input, OnInit} from '@angular/core';
import {DependencyLo} from '../../model/dependency.lo';

@Component({
  selector: '[appDependency]',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.css']
})
export class DependencyComponent implements OnInit {

  @Input()
  appDependency: DependencyLo;
  stroke: string;
  arrow: any;
  interface?: Position;

  constructor() {
  }

  ngOnInit(): void {
    const fromBox = this.appDependency.from.box;
    const toBox = this.appDependency.to.box;
    const fromCenter = fromBox.centerExit(toBox.center());
    const toCenter = toBox.centerExit(fromBox.center());
    if (this.appDependency.interface) {
      console.log('interface!');
      this.interface = fromCenter.halfWayTo(toCenter);
    }
    this.stroke = `M ${fromCenter.x} ${fromCenter.y} L ${toCenter.x} ${toCenter.y}`;
    const rotation = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x) * 180 / Math.PI;
    this.arrow = {
      shape:  `-10,-7 -10,7 0,0`,
      transform: `translate(${toCenter.x}, ${toCenter.y}) rotate(${rotation})`
    };
  }

}

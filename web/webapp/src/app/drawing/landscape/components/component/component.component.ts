import {Component, Input, OnInit} from '@angular/core';
import {ComponentLo} from '../../model/component.lo';
import {Box} from '../../../../domain/common/box';
import {SvgHelper} from '../../../svg-helper';
import {ComponentLabelLo} from '../../model/component-label.lo';

@Component({
  selector: '[appComponent]',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {

  @Input()
  appComponent: ComponentLo;
  box: Box;
  capabilityLines = [];
  commonsLines = [];
  labelLines = [];

  ngOnInit(): void {
    this.box = this.appComponent.box;
    this.capabilityLines = this.mapLabels(this.appComponent.capabilities, x => -10 + (30 - x))
    this.commonsLines = this.mapLabels(this.appComponent.commons, x => 30 + x);

    const words = this.appComponent.label.split(' ');
    const yStart = - (words.length / 2) + 0.5;
    this.labelLines = words.map((label, index) => {
      const offset = (yStart + index) * 15;
      return {
        text: label,
        y: this.box.height / 2 + offset,
        x: this.box.width / 2
      };
    });
  }

  mapLabels(labels: ComponentLabelLo[], xTransformer: (x: number) => number) {
    return labels.map((label, index) => {
      const size = SvgHelper.getBoundingBox(label.label, '5pt');
      return {
        text: label.label,
        x: xTransformer(size.width),
        y: (index + 1) * (size.height + 8),
        width: size.width + 6,
        height: size.height + 6
      };
    });
  }


}

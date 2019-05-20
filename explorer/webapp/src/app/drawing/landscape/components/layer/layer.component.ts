import {Component, Input, OnInit} from '@angular/core';
import {Box} from '../../../../domain/common/box';
import {LayerLo} from "../../model/layer.lo";
import {ColorPalette} from "../../model/color-palette";
import {Position} from "../../../../domain/common/position";

@Component({
  selector: '[appLayer]',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

  @Input()
  appLayer: LayerLo;

  box: Box;
  label: string;
  color: string;
  labelPosition: Position;

  ngOnInit() {
    this.box = this.appLayer.box.withMarginOf({left: 60, right: 20});
    this.label = this.appLayer.label;
    this.labelPosition = new Position(15, this.box.height / 2 + 3);
    this.color = ColorPalette.forLayer(this.appLayer.name).code;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ComponentLo} from '../../model/component.lo';
import {Box} from '../../../../domain/common/box';
import {SvgHelper} from '../../../svg-helper';
import {ComponentLabelLo} from '../../model/component-label.lo';
import {Store} from "@ngrx/store";
import {LandscapeState} from "../../../../landscape.reducer";
import {
  ActiveComponentsAction,
  DeactivateComponentsAction, PinComponentsAction,
  UnpinComponentsAction
} from "../../../../landscape.actions";

@Component({
  selector: '[appComponent]',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent implements OnInit {

  constructor(private store: Store<LandscapeState>) {
  }

  @Input()
  appComponent: ComponentLo;
  box: Box;
  capabilityLines = [];
  commonsLines = [];
  labelLines = [];
  borderColor: string;

  ngOnInit(): void {
    this.box = this.appComponent.box;
    this.capabilityLines = this.mapLabels(this.appComponent.capabilities, x => -10 + (30 - x))
    this.commonsLines = this.mapLabels(this.appComponent.commons, x => 30 + x);
    this.borderColor = this.getBorderColor();
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


  activateComponents() {
    this.store.dispatch(new ActiveComponentsAction([this.appComponent.id]))
  }

  deactivateComponents() {
    this.store.dispatch(new DeactivateComponentsAction([this.appComponent.id]))
  }

  togglePinComponents() {
    console.log(this.appComponent);
    if (this.appComponent.pinned) {
      this.store.dispatch(new UnpinComponentsAction([this.appComponent.id]));
    } else {
      this.store.dispatch(new PinComponentsAction([this.appComponent.id]));
    }
  }

  private getBorderColor() {
    if (this.appComponent.pinned) {
      return 'red';
    }
    return 'black';
  }
}

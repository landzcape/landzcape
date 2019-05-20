import {Box, BoxParameters} from '../../../domain/common/box';
import {ComponentId} from '../../../domain/model/component-id';
import {ComponentLabelLo} from './component-label.lo';
import {ComponentLayerLo} from "./component-layer.lo";

export class ComponentLo {

  constructor(parameters: ComponentLoParameters) {
    this.box = new Box(parameters.box);
    this.id = parameters.id;
    this.name = parameters.name;
    this.label = parameters.label;
    this.version = parameters.version;
    this.layer = parameters.layer;
    this.type = parameters.type;
    this.capabilities = parameters.capabilities;
    this.commons = parameters.commons;
  }

  box: Box;
  id: ComponentId;
  name: string;
  version: string;
  label: string;
  layer: ComponentLayerLo;
  type: string;
  capabilities: ComponentLabelLo[];
  commons: ComponentLabelLo[];

}

export interface ComponentLoParameters {
  id: ComponentId;
  name: string;
  version: string;
  label: string;
  layer: ComponentLayerLo;
  type: string;
  box: BoxParameters;
  capabilities: ComponentLabelLo[];
  commons: ComponentLabelLo[];
}


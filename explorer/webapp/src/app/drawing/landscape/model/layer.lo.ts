import {Box} from "../../../domain/common/box";

export class LayerLo {

  constructor(parameters: LayerLoParameters) {
    this.name = parameters.name;
    this.label = parameters.label;
    this.box = parameters.box;
  }

  name: string;
  label: string;
  box: Box;
}

export interface LayerLoParameters {
  name: string;
  label: string;
  box: Box;
}

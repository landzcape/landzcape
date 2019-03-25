import {Box, BoxParameters} from '../../../domain/common/box';
import {ContextId} from '../../../domain/model/context-id';

export class ContextLo {

  constructor(parameters: ContextLoParameters) {
    this.box = new Box(parameters.box);
    this.id = parameters.id;
    this.name = parameters.name;
    this.label = parameters.label;
  }

  box: Box;
  id: ContextId;
  name: string;
  label: string;
}

export interface ContextLoParameters {
  box: BoxParameters;
  id: ContextId;
  name: string;
  label: string;
}

import {ComponentLo} from './component.lo';

export class DependencyLo {

  constructor(parameters: DependencyLoParameters) {
    this.from = parameters.from;
    this.to = parameters.to;
    this.interface = parameters.interface;
  }

  from: ComponentLo;
  to: ComponentLo;
  interface: boolean;
}

export interface DependencyLoParameters {
  from: ComponentLo;
  to: ComponentLo;
  interface: boolean;
}


import {ComponentLo} from './component.lo';

export class DependencyLo {

  constructor(parameters: DependencyLoParameters) {
    this.from = parameters.from;
    this.to = parameters.to;
    this.interface = parameters.interface;
    this.active = parameters.active;
    this.pinned = parameters.pinned;
  }

  from: ComponentLo;
  to: ComponentLo;
  interface: boolean;
  active: boolean;
  pinned: boolean;
}

export interface DependencyLoParameters {
  from: ComponentLo;
  to: ComponentLo;
  interface: boolean;
  active: boolean;
  pinned: boolean;
}


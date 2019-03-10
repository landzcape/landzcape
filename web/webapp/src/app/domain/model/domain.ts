import {Component} from './component';
import {DomainId} from './domain-id';
import {ComponentType} from './component-type';

export class Domain {

  shadow = false;

  readonly id: DomainId;
  readonly name: string;
  readonly label: string;
  readonly components: Component[];

  constructor(domain: DomainParameters) {
    this.id = domain.id;
    this.name = domain.name;
    this.label = domain.label;
    this.components = domain.components;
  }

  show(): void {
    this.components
      .filter(m => m.isBusiness())
      .forEach(m => m.show());
  }
}

export class DomainParameters {
  id: DomainId;
  name: string;
  label: string;
  components: Component[];
}

import {Domain} from './domain';
import {ContextId} from './context-id';

export class Context {

  shadow = false;

  readonly id: ContextId;
  readonly name: string;
  readonly label: string;
  readonly domains: Domain[];

  constructor(context: ContextParameters) {
    this.id = context.id;
    this.name = context.name;
    this.label = context.label;
    this.domains = context.domains;
  }

  show() {
    this.domains.forEach(d => d.show());
  }

}

export class ContextParameters {
  id: ContextId;
  name: string;
  label: string;
  domains: Domain[];
}

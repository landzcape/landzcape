import {Context} from './context';
import {Layer} from './layer';
import {Component} from './component';
import {ComponentId} from './component-id';
import {DomainId} from './domain-id';
import {ContextId} from './context-id';
import {ComponentType} from './component-type';

export class Landscape {

  constructor(
    public readonly contexts: Context[],
    public readonly layers: Layer[]
  ) {
    this.layers.sort((a,b) => a.order - b.order);
  }

  getComponent(componentId: ComponentId): Component {
    return this.contexts.find(c => c.id === componentId.domainId.contextId)
      .domains.find(d => d.id === componentId.domainId)
      .components.find(m => m.id === componentId);
  }

  getDomain(domainId: DomainId) {
    const domain = this.contexts.find(c => c.id === domainId.contextId)
      .domains.find(d => d.id === domainId);
    return domain;
  }

  getContext(contextId: ContextId) {
    return this.contexts.find(c => c.id === contextId);
  }


  getCapabilities(): Component[] {
    return this.getComponents()
      .filter(m => m.type === ComponentType.CAPABILITY);
  }

  getCommons(): Component[] {
    return this.getComponents()
      .filter(m => m.type === ComponentType.COMMON);
  }

  getApplications(): Component[] {
    return this.getComponents()
      .filter(m => m.type === ComponentType.APPLICATION);
  }

  getBusinessComponents(): Component[] {
    return this.getComponents()
      .filter(m => m.isBusiness());
  }

  getComponents(): Component[] {
    return this.contexts
      .map(c => c.domains)
      .reduce((a, b) => a.concat(b))
      .map(d => d.components)
      .reduce((a, b) => a.concat(b));
  }
}

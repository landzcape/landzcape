import {ContextDto} from './model/context.dto';
import {DependencyDto} from './model/dependency.dto';
import {ComponentDto} from './model/component.dto';
import {DomainDto} from './model/domain.dto';

export class ShadowCache {

  private shadowContexts: ContextDto[] = [];
  private shadowDomains: DomainDto[] = [];
  private componentReplacements: Replacement<ComponentDto>[] = [];
  private domainReplacements: Replacement<DomainDto>[] = [];


  mapDomain(domain: DomainDto): DomainDto {
    if (domain.context) { return domain; }
    const shadowContext = this.addShadowContext();
    const newDomain: DomainDto = {
      ...domain,
      context: shadowContext.name
    };
    this.domainReplacements.push({
      original: domain,
      replacement: newDomain
    });
    return newDomain;
  }

  private addShadowContext() {
    const shadowContextName = `shadow-context-${this.shadowContexts.length}`;
    const context = {
      name: shadowContextName,
      label: shadowContextName,
    };
    this.shadowContexts.push(context);
    return context;
  }

  mapComponent(component: ComponentDto): ComponentDto {
    if (component.context && component.domain) { return component; }
    const contextName = component.context ? component.context : this.addShadowContext().name;
    const shadowDomain = this.addShadowDomain(contextName);
    const newComponent: ComponentDto = {
      ...component,
      context: contextName,
      domain: shadowDomain.name
    };
    this.componentReplacements.push({
      original: component,
      replacement: newComponent
    });
    return newComponent;
  }

  private addShadowDomain(contextName: string) {
    const shadowDomainName = `shadow-domain-${this.shadowDomains.length}`;
    const domain = {
      context: contextName,
      name: shadowDomainName,
      label: shadowDomainName
    };
    this.shadowDomains.push(domain);
    return domain;
  }

  getReplacementComponent(dependency: DependencyDto): DependencyDto {
    const replacement = this.componentReplacements.find(r => {
      const original = r.original;
      return dependency.component === original.name &&
        dependency.domain === original.domain &&
        dependency.context === original.context;
    });
    if (replacement) {
      const newComponent = replacement.replacement;
      return {
        domain: newComponent.domain,
        component: newComponent.name,
        context: newComponent.context
      };
    }
    return dependency;
  }

  get contexts() {
    return this.shadowContexts;
  }

  get domains() {
    return this.shadowDomains;
  }
}

interface Replacement<T> {
  original: T;
  replacement: T;
}


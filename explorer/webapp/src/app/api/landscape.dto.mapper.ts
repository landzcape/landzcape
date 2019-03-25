import {LandscapeDto} from './model/landscape.dto';
import {Landscape} from '../domain/model/landscape';
import {LayerDto} from './model/layer.dto';
import {ContextDto} from './model/context.dto';
import {Context} from '../domain/model/context';
import {Layer} from '../domain/model/layer';
import {ComponentDto} from './model/component.dto';
import {Component} from '../domain/model/component';
import {ComponentType} from '../domain/model/component-type';
import {DomainDto} from './model/domain.dto';
import {Domain} from '../domain/model/domain';
import {ComponentId} from '../domain/model/component-id';
import {ContextId} from '../domain/model/context-id';
import {DomainId} from '../domain/model/domain-id';
import {LandscapeSanitizer} from './landscape-sanitizer';

export class LandscapeDtoMapper {

  static fromLandscapeDto(landscapeDto: LandscapeDto): Landscape {
    const sanatizingResult = LandscapeSanitizer.sanitize(landscapeDto);
    console.log(sanatizingResult);
    const saneLandscape = sanatizingResult.landscape;
    const shakedComponents = this.shuffle(saneLandscape.components);
    const shakedDomains = this.shuffle(saneLandscape.domains);
    const shakedContexts = this.shuffle(saneLandscape.contexts);
    const layers = saneLandscape.layers.map(this.fromLayerDto);
    const contexts = shakedContexts
      .map(contextDto => {
        const components = shakedComponents.filter(componentDto => componentDto.context === contextDto.name);
        const domains = shakedDomains.filter(domainDto => domainDto.context === contextDto.name);
        return this.fromContextDto(contextDto, components, domains, layers);
      });
    LandscapeDtoMapper.addDependencies(contexts, shakedComponents);
    LandscapeDtoMapper.addInterfaces(contexts, shakedComponents);
    LandscapeDtoMapper.markShadows(contexts, sanatizingResult.shadowContexts, sanatizingResult.shadowDomains);
    return new Landscape(contexts, layers);
  }

  private static fromLayerDto(layerDto: LayerDto): Layer {
    return new Layer({...layerDto});
  }

  private static fromContextDto(contextDto: ContextDto,
                                componentsDto: ComponentDto[],
                                domainsDto: DomainDto[],
                                layers: Layer[]): Context {
    const domains = domainsDto.map(domainDto => {
      const domainComponentsDto = componentsDto.filter(componentDto => componentDto.domain === domainDto.name);
      return this.fromDomainDto(domainDto, domainComponentsDto, layers);
    });
    return new Context({
      id: ContextId.fromName(contextDto.name),
      ...contextDto,
      domains: domains
    });
  }

  private static fromDomainDto(domainDto: DomainDto, componentsDto: ComponentDto[], layers: Layer[]) {
    return new Domain({
      id: DomainId.fromNames(domainDto.context, domainDto.name),
      name: domainDto.name,
      label: domainDto.label,
      components: componentsDto.map(componentDto => this.fromComponentDto(componentDto, layers))
    });
  }

  private static fromComponentDto(componentDto: ComponentDto, layers: Layer[]): Component {
    const componentType = ComponentType[componentDto.type];
    const component = new Component({
      id: ComponentId.fromNames(componentDto.context, componentDto.domain, componentDto.name),
      name: componentDto.name,
      group: componentDto.group,
      version: componentDto.version,
      label: componentDto.label,
      layer: layers.find(layer => layer.name === componentDto.layer),
      type: componentType,
    });
    component.visible = component.isBusiness();
    return component;
  }

  private static addDependencies(contexts: Context[], componentsDto: ComponentDto[]) {
    componentsDto.forEach(componentDto => {
      if (componentDto.dependencies) {
        componentDto.dependencies.forEach(dependency => {
          const component = this.findComponent(contexts, componentDto.context, componentDto.domain, componentDto.name);
          const dependantComponent = this.findComponent(contexts, dependency.context, dependency.domain, dependency.component);
          if (dependantComponent === undefined) {
            console.log(`Could not find ${dependency.component} in ${dependency.domain} and context ${dependency.context}`);
          } else {
            component.dependencies.push(dependantComponent);
          }
        });
      }
    });
  }


  private static addInterfaces(contexts: Context[], componentsDto: ComponentDto[]) {
    componentsDto.forEach(componentDto => {
      if (componentDto.interfaces) {
        componentDto.interfaces.forEach(dependency => {
          const component = this.findComponent(contexts, componentDto.context, componentDto.domain, componentDto.name);
          const interfaceComponent = this.findComponent(contexts, dependency.context, dependency.domain, dependency.component);
          if (interfaceComponent === undefined) {
            console.log(`Could not find ${dependency.component} in ${dependency.domain} and context ${dependency.context}`);
          } else {
            component.interfaces.push(interfaceComponent);
            interfaceComponent.implementations.push(component);
          }
        });
      }
    });
  }

  private static findComponent(contexts: Context[], contextName: string, domainName: string, componentName: string): Component {
    const foundContext = contexts.find(context => context.name === contextName);
    if (!foundContext) {
      console.log(`No context with name ${contextName} found during mapping.`);
      return undefined;
    }
    const foundDomain = foundContext.domains.find(domain => domain.name === domainName);
    if (!foundDomain) {
      console.log(`No domain with name ${domainName} found during mapping.`);
      return undefined;
    }
    const foundComponent = foundDomain.components.find(component => component.name === componentName);
    if (!foundComponent) {
      console.log(`No component with name ${componentName} found during mapping.`);
      return undefined;
    }
    return foundComponent;
  }

  private static shuffle(array) {
    const shuffled = [...array];
    let j, x, i;
    for (i = shuffled.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = x;
    }
    return shuffled;
  }

  private static markShadows(contexts: Context[], shadowContexts: ContextId[], shadowDomains: DomainId[]) {
    contexts.forEach(context => {
      context.shadow = shadowContexts.includes(context.id);
      context.domains.forEach(domain => {
        domain.shadow = shadowDomains.includes(domain.id);
      });
    });
  }
}

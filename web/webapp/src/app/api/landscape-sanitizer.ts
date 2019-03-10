import {LandscapeDto} from './model/landscape.dto';
import {SanatizedLandscapeDto} from './sanatized-landscape.dto';
import {DomainId} from '../domain/model/domain-id';
import {ContextId} from '../domain/model/context-id';
import {ShadowCache} from './shadow-cache';

export class LandscapeSanitizer {

  static sanitize(landscapeDto: LandscapeDto): SanatizedLandscapeDto {

    const shadowCache = new ShadowCache();

    const domains = landscapeDto.domains.map(domain => {
      return shadowCache.mapDomain(domain);
    });
    const componentsWithOriginalDependencies = landscapeDto.components.map(component => {
        return shadowCache.mapComponent(component);
    });

    const components = componentsWithOriginalDependencies.map(component => {
      const dependencies = component.dependencies.map(dependency => {
        return shadowCache.getReplacementComponent(dependency);
      });
      return {
        ...component,
        dependencies: dependencies
      };
    });

    const contexts = landscapeDto.contexts.map(c => ({...c}));
    const layers = landscapeDto.layers.map(s => ({...s}));

    const sanatizedLandscapeDto: LandscapeDto = {
        contexts: contexts.concat(shadowCache.contexts),
        domains: domains.concat(shadowCache.domains),
        components: components,
        layers: layers
    };

    return {
      landscape: sanatizedLandscapeDto,
      shadowContexts: shadowCache.contexts.map(c => ContextId.fromName(c.name)),
      shadowDomains: shadowCache.domains.map(d => DomainId.fromNames(d.context, d.name))
    };
  }


}


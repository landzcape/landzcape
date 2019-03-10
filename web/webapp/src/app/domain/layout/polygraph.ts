import {Landscape} from '../model/landscape';
import {Context} from '../model/context';
import {Domain} from '../model/domain';
import {Component} from '../model/component';
import {ElasticInsertPositionFinder} from './elastic-insert/elastic-insert-position-finder';
import {LandscapeLo} from '../../drawing/landscape/model/landscape.lo';
import {ComponentLo} from '../../drawing/landscape/model/component.lo';
import {DependencyLo} from '../../drawing/landscape/model/dependency.lo';
import {DomainLo} from '../../drawing/landscape/model/domain.lo';
import {ContextLo} from '../../drawing/landscape/model/context.lo';
import {Box, BoxParameters} from '../common/box';
import {Position} from '../common/position';

export class Polygraph {

  private finder: ElasticInsertPositionFinder;

  constructor(private landscape: Landscape) {
    this.finder = new ElasticInsertPositionFinder(landscape);
    this.finder.relax();
  }

  public relax(): void {
    this.finder.relax();
  }

  public layout() {
    const positions = this.finder.getPositions();
    const capabilities = this.getCapabilities();
    const commons = this.getCommons();
    const componentMap = this.layoutComponents(positions, capabilities, commons);
    const componentLos: ComponentLo[] = Array.from(componentMap.values());
    const domainLos: DomainLo[] = this.landscape
      .contexts.map(c => c.domains)
      .reduce((a, b) => a.concat(b), [])
      .filter(d => componentLos.some(m => m.id.domainId === d.id))
      .map(d => this.layoutDomain(d, componentLos.filter(m => m.id.domainId === d.id)));

    const contextLos: ContextLo[] = this.landscape.contexts
      .filter(c => domainLos.some(d => d.id.contextId === c.id))
      .map(c => this.layoutContext(c, domainLos.filter(d => d.id.contextId === c.id)));
    const dependencyLos: DependencyLo[] = [];

    componentMap.forEach((componentLo, component) => {
      const componentDependencies = component.getDependenciesIncludingInterfaces()
        .filter(dependency => componentMap.has(dependency))
        .map(dependency => {
          const isInterface = component.getInterfaceDependencies().includes(dependency);
          return new DependencyLo({
          from: componentLo,
          to: componentMap.get(dependency),
          interface: isInterface
        });
      });
      dependencyLos.push(...componentDependencies);
    });
    const landscapeLo = new LandscapeLo({
      contexts: contextLos,
      domains: domainLos,
      components: componentLos,
      dependencies: dependencyLos
    });
    return landscapeLo;
  }

  private layoutComponents(positions: Map<Component, Position>,
                        capabilities: Map<Component, Component[]>,
                        commons: Map<Component, Component[]>): Map<Component, ComponentLo> {
    const componentMap = new Map<Component, ComponentLo>();
    positions.forEach((position, component) => {
      const componentLo = new ComponentLo({
        id: component.id,
        name: component.name,
        version: component.version,
        label: component.label,
        layer: component.layer ? component.layer.label : '',
        type: component.type.toString(),
        box: {
          x: position.x * 115,
          y: position.y * 115,
          width: 80,
          height: 80,
        },
        capabilities: capabilities.get(component).map(d => {
          return {
            id: d.id,
            label: d.label
          };
        }),
        commons: commons.get(component).map(d => {
          return {
            id: d.id,
            label: d.label
          };
        })
      });
      componentMap.set(component, componentLo);
    });
    return componentMap;
  }

  private layoutDomain(domain: Domain, componentsLo: ComponentLo[]): DomainLo {
    const border = this.getBorder(componentsLo.map(m => m.box));
    return new DomainLo({
      box: border,
      id: domain.id,
      name: domain.name,
      label: domain.label,
    });
  }

  private layoutContext(context: Context, domains: DomainLo[]): ContextLo {
    const border = this.getBorder(domains.map(d => d.box));
    return new ContextLo({
      box: border,
      id: context.id,
      name: context.name,
      label: context.label
    });
  }

  private getBorder(drawables: Box[], margin: number = 7): BoxParameters {
    const x = Math.min(...drawables.map(m => m.x));
    const width = Math.max(...drawables.map(m => m.x + m.width)) - x;
    const y = Math.min(...drawables.map(m => m.y));
    const height = Math.max(...drawables.map(m => m.y + m.height)) - y;
    return {
      x: x - margin,
      y: y - margin,
      width: width + 2 * margin,
      height: height + 2 * margin
    };
  }

  private getCapabilities(): Map<Component, Component[]> {
    const map = new Map<Component, Component[]>();
    this.landscape.getBusinessComponents().forEach(component => {
      const capabilities = component.getCapabilities()
        .filter(c => c.visible);
      map.set(component, capabilities);
    });
    return map;
  }

  private getCommons(): Map<Component, Component[]> {
    const map = new Map<Component, Component[]>();
    this.landscape.getBusinessComponents().forEach(component => {
      const capabilities = component.getCommons()
        .filter(c => c.visible);
      map.set(component, capabilities);
    });
    return map;
  }
}

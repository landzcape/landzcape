import {Component} from "../model/component";
import {Position} from "../common/position";
import {Landscape} from "../model/landscape";
import {ElasticInsertPositionFinder} from "./elastic-insert/elastic-insert-position-finder";
import {ComponentLo} from "../../drawing/landscape/model/component.lo";
import {DomainLo} from "../../drawing/landscape/model/domain.lo";
import {ContextLo} from "../../drawing/landscape/model/context.lo";
import {DependencyLo} from "../../drawing/landscape/model/dependency.lo";
import {LayerLo} from "../../drawing/landscape/model/layer.lo";
import {LandscapeLo} from "../../drawing/landscape/model/landscape.lo";
import {Domain} from "../model/domain";
import {Context} from "../model/context";
import {Box} from "../common/box";
import {Layer} from "../model/layer";
import {Maps} from "../util/maps";

export class Layouter {

  private positions?: Map<Component, Position>;

  constructor(readonly landscape: Landscape) {
  }

  recomputePositions() {
    const finder = new ElasticInsertPositionFinder(this.landscape);
    finder.relax();
    this.positions = finder.getPositions();
  }

  public layout(): LandscapeLo {
    if (!this.positions) {
      this.recomputePositions();
    }
    const capabilities = this.getCapabilities();
    const commons = this.getCommons();
    const componentMap = this.layoutComponents(this.positions, capabilities, commons);
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
    const layoutLos: LayerLo[] = this.layoutLayers(this.landscape.layers, componentLos);
    componentMap.forEach((componentLo, component) => {
      const componentDependencies = component.getDependenciesIncludingInterfaces()
        .filter(dependency => component.active || component.pinned || dependency.active || dependency.pinned)
        .filter(dependency => componentMap.has(dependency))
        .map(dependency => {
          const isInterface = component.getInterfaceDependencies().includes(dependency);
          const toComponentLo = componentMap.get(dependency);
          return new DependencyLo({
            from: componentLo,
            to: toComponentLo,
            pinned: componentLo.pinned || toComponentLo.pinned,
            active: componentLo.active || toComponentLo.active,
            interface: isInterface
          });
        });
      dependencyLos.push(...componentDependencies);
    });
    const landscapeLo = new LandscapeLo({
      contexts: contextLos,
      domains: domainLos,
      components: componentLos,
      dependencies: dependencyLos,
      layers: layoutLos
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
        layer: component.layer ? {name: component.layer.name, label: component.layer.label} : undefined,
        type: component.type.toString(),
        active: component.active,
        pinned: component.pinned,
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

  private getBorder(drawables: Box[], margin: number = 7): Box {
    return Box.borderOf(drawables).withMargin(margin);
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

  private layoutLayers(layers: Layer[], componentLos: ComponentLo[]): LayerLo[] {
    const fullWidthBorder = Box.borderOf(componentLos.map(c => c.box));
    const componentsByLayer = Maps.groupBy(componentLos, c => c.layer ? c.layer.name : undefined);
    return layers
      .filter(layer => componentsByLayer.has(layer.name))
      .map(layer => {
        const layerBorder = Box.borderOf(componentsByLayer.get(layer.name).map(c => c.box));
        const box = new Box({
          x: fullWidthBorder.x,
          y: layerBorder.y,
          width: fullWidthBorder.width,
          height: layerBorder.height
        });
        return new LayerLo({
          name: layer.name,
          label: layer.label,
          box: box.withMargin(10)
        })
      });
  }

}

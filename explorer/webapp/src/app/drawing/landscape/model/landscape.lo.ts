import {ContextLo} from './context.lo';
import {DependencyLo} from './dependency.lo';
import {DomainLo} from './domain.lo';
import {ComponentLo} from './component.lo';
import {Size} from '../../../domain/common/size';
import {LayerLo} from "./layer.lo";

export class LandscapeLo {

  constructor(landscape: LandscapeLoParameters) {
    this.layers = landscape.layers;
    this.contexts = landscape.contexts;
    this.domains = landscape.domains;
    this.components = landscape.components;
    this.dependencies = landscape.dependencies;
  }

  layers: LayerLo[];
  contexts: ContextLo[];
  dependencies: DependencyLo[];
  domains: DomainLo[];
  components: ComponentLo[];

  getDrawingBoxSize(): Size {
    if (!this.contexts || !this.contexts.length) {
      return {width: 0, height: 0};
    }
    const right = Math.max(...this.contexts.map(c => c.box.x + c.box.width));
    const left = Math.min(...this.contexts.map(c => c.box.x));
    const bottom = Math.max(...this.contexts.map(c => c.box.y + c.box.height));
    const top = Math.min(...this.contexts.map(c => c.box.y));
    return {
      width: right + left,
      height: bottom + top
    };
  }
}

class LandscapeLoParameters {
  contexts: ContextLo[];
  dependencies: DependencyLo[];
  domains: DomainLo[];
  components: ComponentLo[];
  layers: LayerLo[];
}

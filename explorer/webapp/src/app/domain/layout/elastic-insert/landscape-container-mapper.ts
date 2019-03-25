import {Landscape} from '../../model/landscape';
import {Layer} from '../../model/layer';
import {Container} from './container';
import {Node} from './node';
import {NodeLayer} from './node-layer';

export class LandscapeContainerMapper {

  static fromLandscape(landscape: Landscape, layers: NodeLayer[]): Container {
    const contextContainers = landscape.contexts
      .map(context => {
      const domainContainers = context.domains
        .map(domain => {
          const moduleNodes = domain.components
            .filter(m => m.visible)
            .filter(m => m.isBusiness())
            .filter(m => !m.isInterface())
            .map(module => {
              const node = new Node(module, LandscapeContainerMapper.fromLayer(layers, module.layer));
              return node;
            });
          return new Container(domain, moduleNodes);
        });
      return new Container(context, domainContainers);
    });
    const root = new Container(landscape, contextContainers);
    root.propagateParent();
    return root;
  }

  static fromLayers(layers: Layer[]): NodeLayer[] {
    if (layers) {
      return [...layers.map(layer => new NodeLayer(layer.name)), NodeLayer.NONE];
    }
    return [NodeLayer.NONE];
  }

  private static fromLayer(layers: NodeLayer[], layer: Layer): NodeLayer {
    if (layer) {
      const nodeLayer = layers.find(l => l.name === layer.name);
      if (nodeLayer) {
        return nodeLayer;
      }
    }
    return NodeLayer.NONE;
  }
}

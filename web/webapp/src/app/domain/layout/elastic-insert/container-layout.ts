import {Container} from './container';
import {NodeLayerCounter} from './layer-counter';
import {Node} from './node';
import {Position} from '../../common/position';
import {PositionFactory} from '../../common/position-factory';
import {NodeLayer} from './node-layer';

export class ContainerLayout {

  private layers = new Map<NodeLayer, number>();

  constructor(private container: Container, private layerOrder: NodeLayer[]) {
    layerOrder.forEach((layer, index) => {
      this.layers.set(layer, index);
    });
  }

  getPositions(depth: number) {
    const layerCounter = new NodeLayerCounter(this.layerOrder);
    const positions = new Map<Container, Position>();
    this.findPositionsRecursive(this.container, depth + 1, layerCounter, positions);
    return positions;
  }

  private findPositionsRecursive(container: Container, depth: number,
                                 layerCounter: NodeLayerCounter,
                                 positions: Map<Container, Position>) {
    if (depth === 0) {
        const nodes = container.nodes;
        container.nodes.forEach(node => {
          const x = layerCounter.get(node.layer);
          const y = this.layers.get(node.layer);
          // console.log('use', node.value, node.layer);
          positions.set(node, PositionFactory.fromCoordinates(x, y));
          layerCounter.use(node.layer);
        });
    } else {
      if (container.children.length === 0) {
        // console.log('syncNode', container.value);
        layerCounter.syncNode((container as Node).layer);
        this.findPositionsRecursive(container, depth - 1, layerCounter, positions);
      } else {
        // console.log('startBox', container.value);
        const layers = container.nodes.map(n => n.layer);
        layerCounter.startBox(layers);
        container.children.forEach(child => {
          this.findPositionsRecursive(child, depth - 1 , layerCounter, positions);
        });
        layerCounter.endBox();
      }
    }
  }
}

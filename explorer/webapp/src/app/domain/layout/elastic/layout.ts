import {Component} from '../../model/component';
import {PositionFactory} from '../../common/position-factory';
import {ElasticNode} from './elastic-node';
import {Direction} from '../../common/direction';
import {Layer} from '../../model/layer';
import {Landscape} from '../../model/landscape';
import {ElasticBox} from './elastic-box';
import {Box} from '../../common/box';
import {Position} from '../../common/position';

export class Layout {

  private relaxations = 0;

  private grid: Map<Position, ElasticNode> = new Map();
  private nodes: Map<Component, ElasticNode> = new Map();
  private layers: Map<Layer, Box>;
  private components: Component[];
  private landscape: ElasticBox;

  constructor(landscape: Landscape, layers: Layer[]) {
    const components = this.getAllComponents(landscape);
    this.layers = this.createLayers(layers, components);
    components.forEach((component, index) => {
      const layer = this.layers.get(component.layer);
      const node = new ElasticNode(new Position(index, layer.y), component, layer);
      this.add(node);
      this.nodes.set(component, node);
    });
    this.nodes.forEach((node) => {
        for (const dependency of node.getComponent().dependencies) {
          const otherNode = this.nodes.get(dependency);
          node.addConnection(otherNode);
          otherNode.addConnection(node);
        }
    });
    this.components = components;

    const contextBoxes = landscape.contexts.map(context => {
        const domainBoxes = context.domains.map( domain => {
          const domainComponents = domain.components.map(component => {
            return this.nodes.get(component);
          });
          return new ElasticBox(domainComponents);
        });
        return new ElasticBox(domainBoxes);
      });
    this.landscape = new ElasticBox(contextBoxes);
  }

  private createLayers(layers: Layer[], components: Component[]): Map<Layer, Box> {
    const layerMap: Map<Layer, Box> = new Map();
    layers.forEach((layer, index) => {
      const box = new Box({
        x: 0, y: index, height: 0, width: components.length
      });
      layerMap.set(layer, box);
    });
    console.log(layers);
    return layerMap;
  }

  public relax(): void {
    let zeroTries = 0;
    while (zeroTries < Math.pow(this.components.length, 2)) {
      const reduction = this.relaxStep();
      if (reduction === 0) {
        zeroTries++;
      } else {
        zeroTries = 0;
      }
    }

    let force = 0;
    this.nodes.forEach(node => {
      force += node.getForce().getStrength();
    })
    console.log(`Total force remaining: ${force}`);
  }

  public relaxStep(): number {
    this.relaxations++;
    const offset = Math.floor(this.relaxations / this.components.length);
    const index = (this.relaxations + offset) % this.components.length;
    const component = this.components[index];
    const node = this.nodes.get(component);
    const reducedForce = this.relaxNode(node);
    // console.log(`Reduced force by ${reducedForce} at index ${index}`);
    return reducedForce;
  }

  public swap(from: Position, to: Position) {
    const fromComponent = this.remove(from);
    const toComponent = this.remove(to);
    if (fromComponent) {
      fromComponent.setPosition(to);
      this.add(fromComponent);
    }
    if (toComponent) {
      toComponent.setPosition(from);
      this.add(toComponent);
    }
  }

  private get(position: Position): ElasticNode {
    const key = PositionFactory.fromPosition(position);
    return this.grid.get(key);
  }

  private remove(position: Position): ElasticNode {
    const key = PositionFactory.fromPosition(position);
    const node = this.grid.get(key);
    this.grid.delete(key);
    return node;
  }

  private add(node: ElasticNode) {
    const key = PositionFactory.fromPosition(node.getPosition());
    this.grid.set(key, node);
  }

  public getPositions(): Map<Component, Position> {
    const positions = new Map<Component, Position>();
    this.grid.forEach((node, position) => {
        positions.set(node.getComponent(), position);
      });
    return positions;
  }

  private getSwapNodeDeltaForceStrength(node: ElasticNode, swapNode: ElasticNode, opposite: Direction) {
    if (swapNode) {
      const currentForce = swapNode.getForce();
      const projectedForce = swapNode.getProjectedForce(opposite, node);
      return currentForce.getStrength() - projectedForce.getStrength();
    }
    return 0;
  }

  private relaxNode(node: ElasticNode) {
    const currentForce = node.getForce();
    const position = node.getPosition();
    const directions = currentForce.getDirection()
      .withNeighbours()
      .filter(direction => node.canBeMovedIn(direction));
    if (directions.length) {
      const forces = directions
        .map(direction => {
        const swapNode = this.get(position.inDirection(direction));
        const projectedForce = node.getProjectedForce(direction, swapNode);
        const swapNodeDeltaForceStrength = this.getSwapNodeDeltaForceStrength(node, swapNode, direction.opposite());
        const deltaForce = currentForce.getStrength() - projectedForce.getStrength();
        return {
          deltaForce: (deltaForce + swapNodeDeltaForceStrength),
          direction: direction
        };
      });
      const ordered = forces.sort((f1, f2) => f2.deltaForce - f1.deltaForce);
      const best = ordered[0];
      // console.log(`${node.getComponent().name}: ${best.deltaForce}`, ordered);
      if (best.deltaForce >= 0) {
        this.swap(position, position.inDirection(ordered[0].direction));
        return best.deltaForce;
      }
    }
    return 0;
  }

  private getAllComponents(landscape: Landscape): Component[] {
    return landscape.contexts
      .map(c => c.domains)
      .reduce((a, b) => a.concat(b), [])
      .map(d => d.components)
      .reduce((a , b) => a.concat(b), []);
  }
}

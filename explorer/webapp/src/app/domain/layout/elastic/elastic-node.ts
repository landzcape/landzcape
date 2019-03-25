import {Component} from '../../model/component';
import {DirectedForce} from '../shared/directed-force';
import {Direction} from '../../common/direction';
import {ElasticBox} from './elastic-box';
import {Box} from '../../common/box';
import {Position} from '../../common/position';

export class ElasticNode extends ElasticBox {

  private connections: ElasticNode[] = [];

  constructor(private position: Position, private component: Component, private layer: Box) {
    super();
  }

  getComponent(): Component {
    return this.component;
  }

  setPosition(position: Position) {
    this.position = position;
  }

  addConnection(node: ElasticNode) {
    this.connections.push(node);
  }

  getProjectedForce(direction: Direction, swapNode: ElasticNode): DirectedForce {
    return this.getCalculatedForce(this.position.inDirection(direction), swapNode);
  }

  getForce(): DirectedForce {
    return this.getCalculatedForce(this.position);
  }

  canBeMovedIn(direction: Direction): boolean {
    const position = this.position.inDirection(direction);
    return this.layer.containsPosition(position);
  }

  private getCalculatedForce(center: Position, swapNode?: ElasticNode): DirectedForce {
     let total = DirectedForce.ZERO;
     for (const connection of this.connections) {
       const nodePosition = swapNode === connection ? this.position : connection.position;
       const force = DirectedForce.fromCenter(nodePosition, center);
       total = total.plus(force);
     }
     return total;
  }

  getPosition(): Position {
    return this.position;
  }
}

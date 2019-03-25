import {Container} from './container';
import {NodeLayer} from './node-layer';

export class Node extends Container {

  constructor(value: any, readonly layer: NodeLayer) {
    super(value, []);
  }

  get nodes(): Node[] {
    return [this];
  }

}

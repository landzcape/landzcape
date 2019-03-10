import {NodeLayer} from './node-layer';

export class NodeLayerCounter {

  private counters = new Map<NodeLayer, number>();
  private used: NodeLayer[][] = [[]];
  private NodeLayerOrderIndex = new Map<NodeLayer, number>();

  constructor(private order: NodeLayer[]) {
    order.forEach((o, i) => {
      this.NodeLayerOrderIndex.set(o, i);
    });
  }

  get(NodeLayer: NodeLayer): number {
    if (this.counters.has(NodeLayer)) {
      return this.counters.get(NodeLayer);
    }
    return 0;
  }

  private getUsedAtCurrentDepth(): NodeLayer[] {
    return this.used[this.used.length - 1];
  }

  use(NodeLayer: NodeLayer) {
    this.used.forEach(u => {
      u.push(NodeLayer);
    });
  }

  syncNode(NodeLayer: NodeLayer) {
      const currentCounter = this.counters.get(NodeLayer);
      const increment = this.getUsedAtCurrentDepth().includes(NodeLayer) ? 1 : 0;
      this.counters.set(NodeLayer, currentCounter + increment);
  }

  startBox(NodeLayers: NodeLayer[]): void {
    const newBoxAffected = this.getAffected(NodeLayers);
    const max = this.getMax(newBoxAffected);
    const oldBoxAffected = this.getAffected(this.getUsedAtCurrentDepth());
    const increment = oldBoxAffected.some(NodeLayer => newBoxAffected.includes(NodeLayer)) ? 1 : 0;
    // console.log(newBoxAffected.map(a => a.name), max, oldBoxAffected.map(a => a.name), increment);
    newBoxAffected.forEach(key => {
      this.counters.set(key, max + increment);
    });
    this.used.push([]);
  }

  endBox() {
    const current = this.used.pop();
    const affected = this.getAffected(current);
    const max = this.getMax(affected);
    affected.forEach(key => {
      this.counters.set(key, max);
    });
  }

  private getAffected(NodeLayers: NodeLayer[]) {
    const NodeLayerIndexes = NodeLayers.map(l => this.NodeLayerOrderIndex.get(l));
    const first = Math.min(...NodeLayerIndexes);
    const last = Math.max(...NodeLayerIndexes);
    return this.order.slice(first, last + 1);
  }

  private getMax(NodeLayers: NodeLayer[]) {
    return Math.max(...NodeLayers.map(l => this.get(l)));
  }

}

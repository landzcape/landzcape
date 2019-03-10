import {Node} from './node';

export class Container {

  private _parent?: Container;

  constructor(
    public readonly value: any,
    public readonly children: Container[]) {
  }

  propagateParent() {
    this.children.forEach(child => {
      child.parent = this;
      child.propagateParent();
    });
  }

  set parent(value: Container) {
    this._parent = value;
  }

  moveRight() {
    const index = this.getIndex();
    const targetIndex = this.getIndex(1);
    this.swapPositions(index, targetIndex);
  }

  moveLeft() {
    const index = this.getIndex();
    const targetIndex = this.getIndex(-1);
    this.swapPositions(index, targetIndex);
  }

  private swapPositions(index, targetIndex) {
    const parent = this.parent;
    const target = parent.children[targetIndex];
    parent.children[targetIndex] = parent.children[index];
    parent.children[index] = target;
  }


  private getIndex(offset: number = 0) {
    const parent = this.parent;
    const index = parent.children.indexOf(this);
    if (index < 0 || index > parent.children.length - 1) {
      throw new Error(`Invalid parent/child setup: ${index}`);
    }
    const targetIndex = (parent.children.length + index + offset) % parent.children.length;
    return targetIndex;
  }

  getChildren(depth: number): Container[] {
    if (depth <= 0) {
      return this.children;
    }
    return this.children
      .map(child => child.getChildren(depth - 1))
      .reduce((a, b) => a.concat(b), []);
  }

  get parent(): Container {
    return this._parent;
  }

  get nodes(): Node[] {
    return this.children
      .map(child => child.nodes)
      .reduce((a, b) => a.concat(b), []);
  }

}

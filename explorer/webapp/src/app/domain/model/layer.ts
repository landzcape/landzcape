export class Layer {

  readonly name: string;
  readonly label: string;
  readonly order: number;

  constructor(layer: Layer) {
    this.name = layer.name;
    this.label = layer.label;
    this.order = layer.order;
  }

}

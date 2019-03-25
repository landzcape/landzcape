export class Layer {

  readonly name: string;
  readonly label: string;

  constructor(layer: Layer) {
    this.name = layer.name;
    this.label = layer.label;
  }

}

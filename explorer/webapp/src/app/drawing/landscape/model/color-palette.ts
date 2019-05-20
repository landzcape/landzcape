import {Color} from "./color";

export class ColorPalette {

  static readonly COLORS = [
    new Color("#6B7064"),
    new Color("#A4B45B"),
    new Color("#BEC588"),
    new Color("#F8F4E1"),
    new Color("#899699")
  ];

  private static layerColors = new Map<string,  number>();

  static forLayer(name: string): Color {
    if (!this.layerColors.has(name)) {
      this.layerColors.set(name, this.layerColors.size);
    }
    const index = this.layerColors.get(name);
    return this.getColor(index);
  }

  private static getColor(index: number): Color {
    const colors = ColorPalette.COLORS.length;
    return ColorPalette.COLORS[index % colors];
  }

}

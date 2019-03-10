import {Position} from './position';

export class PositionFactory {

  static readonly positions: Map<string, Position> = new Map();

  public static fromPosition(position: Position): Position {
    return this.fromCoordinates(position.x, position.y);
  }

  public static fromCoordinates(x: number, y: number) {
    const key = `${x}-${y}`;
    let position = this.positions.get(key);
    if (position === undefined) {
      position = new Position(x, y);
      this.positions.set(key, position);
    }
    return position;
  }
}

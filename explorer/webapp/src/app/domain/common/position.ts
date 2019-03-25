import {Direction} from './direction';
import {PositionFactory} from './position-factory';

export class Position {

  public static ZERO = new Position();

  readonly x: number;
  readonly y: number;

  constructor(x: number = 0, y: number = 0) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Can only construct positions for valid numbers. ${x}, ${y} are invalid arguments.`);
    }
    this.x = x;
    this.y = y;
  }

  inDirection(direction: Direction) {
    return new Position(this.x + direction.x, this.y + direction.y);
  }

  halfWayTo(position: Position): any {
    const x = (this.x + position.x) / 2;
    const y = (this.y + position.y) / 2;
    return new Position(x, y);
  }

}

import {Position} from '../../common/position';
import {Direction} from '../../common/direction';

export class DirectedForce {

  public static ZERO = new DirectedForce(0, 0);

  private readonly x: number;
  private readonly y: number;

  constructor(x: number, y: number) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Can only construct forces for valid numbers. ${x}, ${y} are invalid arguments.`);
    }
    this.x = x;
    this.y = y;
  }

  public static fromCenter(center: Position, point: Position) {
    const x = center.x - point.x;
    const y = center.y - point.y;
    return new DirectedForce(x, y);
  }

  public plus(force: DirectedForce): DirectedForce {
    return new DirectedForce(this.x + force.x, this.y + force.y);
  }

  public getStrength(): number {
    return Math.hypot(this.x, this.y);
  }

  public getDirection(): Direction {
    return Direction.fromVector(this.x, this.y);
  }


}

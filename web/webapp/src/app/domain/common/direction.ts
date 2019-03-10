import {Position} from './position';

export class Direction extends Position {

  static readonly UP = new Direction(0, 1);
  static readonly UP_LEFT = new Direction(-1, 1);
  static readonly LEFT = new Direction(-1, 0);
  static readonly DOWN_LEFT = new Direction(-1, -1);
  static readonly DOWN = new Direction(0, -1);
  static readonly DOWN_RIGHT = new Direction(1, -1);
  static readonly RIGHT = new Direction(1, 0);
  static readonly UP_RIGHT = new Direction(1, 1);
  static readonly STAY = new Direction(0, 0);

  private static readonly OPPOSITE = new Map<Direction, Direction>();
  private static readonly NEIGHBOURS = new Map<Direction, Direction[]>();

  static initializeNeighbours() {
    this.NEIGHBOURS.set(this.UP, [this.UP_LEFT, this.UP, this.UP_RIGHT]);
    this.NEIGHBOURS.set(this.UP_RIGHT, [this.UP, this.UP_RIGHT, this.RIGHT]);
    this.NEIGHBOURS.set(this.RIGHT, [this.UP_RIGHT, this.RIGHT, this.DOWN_RIGHT]);
    this.NEIGHBOURS.set(this.DOWN_RIGHT, [this.RIGHT, this.DOWN_RIGHT, this.DOWN]);
    this.NEIGHBOURS.set(this.DOWN, [this.DOWN_RIGHT, this.DOWN, this.DOWN_LEFT]);
    this.NEIGHBOURS.set(this.DOWN_LEFT, [this.DOWN, this.DOWN_LEFT, this.LEFT]);
    this.NEIGHBOURS.set(this.LEFT, [this.DOWN_LEFT, this.LEFT, this.UP_LEFT]);
    this.NEIGHBOURS.set(this.UP_LEFT, [this.LEFT, this.UP_LEFT, this.UP]);
    this.NEIGHBOURS.set(this.STAY, []);
  }
  static initializeOpposite() {
    this.OPPOSITE.set(this.UP, this.DOWN);
    this.OPPOSITE.set(this.UP_RIGHT, this.DOWN_LEFT);
    this.OPPOSITE.set(this.RIGHT, this.LEFT);
    this.OPPOSITE.set(this.DOWN_RIGHT, this.UP_LEFT);
    this.OPPOSITE.set(this.DOWN, this.UP);
    this.OPPOSITE.set(this.DOWN_LEFT, this.UP_RIGHT);
    this.OPPOSITE.set(this.LEFT, this.RIGHT);
    this.OPPOSITE.set(this.UP_LEFT, this.DOWN_RIGHT);
    this.OPPOSITE.set(this.STAY, this.STAY);
  }

  private constructor(x: number, y: number) {
    super(x, y);
  }


  static fromVector(x: number, y: number) {
    if (x > 0) {
      if (y > 0) {
        return this.UP_RIGHT;
      } else if (y < 0) {
        return this.DOWN_RIGHT;
      } else {
        return this.RIGHT;
      }
    } else if (x < 0) {
      if (y > 0) {
        return this.UP_LEFT;
      } else if (y < 0) {
        return this.DOWN_LEFT;
      } else {
        return this.LEFT;
      }
    } else {
      if (y > 0) {
        return this.UP;
      } else if (y < 0) {
        return this.DOWN;
      } else {
        return this.STAY;
      }
    }
  }

  withNeighbours(): Direction[] {
    return Direction.NEIGHBOURS.get(this);
  }

  opposite() {
    return Direction.OPPOSITE.get(this);
  }
}

Direction.initializeNeighbours();
Direction.initializeOpposite();

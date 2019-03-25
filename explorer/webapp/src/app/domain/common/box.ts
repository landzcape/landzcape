import {Position} from './position';
import {PositionFactory} from './position-factory';
import * as math from 'mathjs';
export class Box {

  x: number;
  y: number;
  width: number;
  height: number;

  constructor(parameters?: BoxParameters) {
    if (parameters) {
      this.x = parameters.x;
      this.y = parameters.y;
      this.width = parameters.width;
      this.height = parameters.height;
    }
  }

  center(): Position {
    return new Position(
      this.x + (this.width / 2),
      this.y + (this.height / 2)
    );
  }


  containsPosition(position: Position): boolean {
    if (position.x >= this.x) {
      if (position.x <= this.x + this.width) {
        if (position.y >= this.y) {
          if (position.y <= this.y + this.height) {
            return true;
          }
        }
      }
    }
    return false;
  }

  containsBox(box: Box): boolean {
    if (box.x >= this.x) {
      if (box.x + box.width <= this.x + this.width) {
        if (box.y >= this.y) {
          if (box.y + box.height <= this.y + this.height) {
            return true;
          }
        }
      }
    }
    return false;
  }

  overlaps(box: Box): boolean {
    if (box.x < (this.x + this.width)) {
      if ((box.x + box.width) > this.x) {
        if (box.y > (this.y + this.height)) {
          if (box.y + box.width < this.y) {
            return false;
          }
        }
      }
    }
    return true;
  }

  centerExit(position: Position) {
    const center = this.center();
    const angle = Math.atan2(position.y - center.y, position.x - center.x);
    const angleDeg = (angle * 180 / Math.PI + 360) % 360;
    const line = [[center.x, center.y], [position.x, position.y]];
    if (angleDeg > 315 || angleDeg <= 45) {
      return this.getIntersection(line, [
        [this.x + this.width, this.y],
        [this.x + this.width, this.y + this.height]
      ]);
    } else if (angleDeg > 45 && angleDeg <= 135) {
      return this.getIntersection(line, [
        [this.x + this.width, this.y + this.height],
        [this.x, this.y + this.height]
      ]);
    } else if (angleDeg > 135 && angleDeg <= 225) {
      return this.getIntersection(line, [
        [this.x, this.y + this.height],
        [this.x, this.y]
        ]);
    } else if (angleDeg > 225 && angleDeg <= 315) {
      return this.getIntersection(line, [
        [this.x, this.y],
        [this.x + this.width, this.y]
      ]);
    }
  }

  private getIntersection(line: number[][], boxLine: number[][]): Position {
    const point = math.intersect(line[0], line[1], boxLine[0], boxLine[1]) as number[];
    if (point === null) {
      throw new Error(`No intersection found for ${line[0]}/${line[1]} and ${boxLine[0]}/${boxLine[1]}`);
    }
    return PositionFactory.fromCoordinates(point[0], point[1]);
  }
}

export interface BoxParameters {
  x: number;
  y: number;
  width: number;
  height: number;
}

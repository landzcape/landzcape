import {Box} from '../../common/box';

export class ElasticBox {

  constructor(private children: ElasticBox[] = []) {

  }

  getBox(): Box {
    const childrenBoxes = this.children.map(b => b.getBox());
    const x = Math.min(
      ...childrenBoxes.map(b => b.x)
    );
    const y = Math.min(
      ...childrenBoxes.map(b => b.y)
    );
    const xMax = Math.max(
      ...childrenBoxes.map(b => b.x + b.width)
    );
    const yMax = Math.max(
      ...childrenBoxes.map(b => b.y + b.height)
    );
    return new Box({
      x: x,
      y: y,
      width: (xMax - x),
      height: (yMax - y)
    });
  }

}

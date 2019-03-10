import {DirectedForce} from './directed-force';
import {PositionFactory} from '../../common/position-factory';
import {Direction} from '../../common/direction';

describe('DirectedForce', () => {

  it('should create', () => {
    const center = PositionFactory.fromCoordinates(0, 0);
    const point = PositionFactory.fromCoordinates(1, 1);
    const directedForce = DirectedForce.fromCenter(center, point);
    expect(directedForce.getDirection()).toBe(Direction.DOWN_LEFT);
  });
});

import {Landscape} from '../../model/landscape';
import {Component} from '../../model/component';
import {RelaxingLayout} from './relaxing-layout';
import {Position} from '../../common/position';

export class ElasticInsertPositionFinder {

  private layout: RelaxingLayout;

  constructor(private landscape: Landscape) {
    this.layout = new RelaxingLayout(this.landscape);
  }

  public relax() {
    const relaxed = this.layout.relax();
  }

  public getPositions(): Map<Component, Position>  {
    return this.layout.getPositions();
  }

}

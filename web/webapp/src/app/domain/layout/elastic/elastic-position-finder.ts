import {Landscape} from '../../model/landscape';
import {Component} from '../../model/component';
import {Layout} from './layout';
import {Position} from '../../common/position';

export class ElasticPositionFinder {

  private layout: Layout;

  constructor(private landscape: Landscape) {
    this.layout = new Layout(landscape, landscape.layers);
  }

  public relax(): void {
    this.layout.relax();
  }

  public getPositions(): Map<Component, Position>  {
    return this.layout.getPositions();
  }



}

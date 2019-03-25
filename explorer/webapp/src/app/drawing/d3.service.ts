import {ElementRef, Injectable} from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class D3Service {

  constructor() { }

  applyZoomableBehaviour(svgElement, containerElement: ElementRef) {

    const svg = d3.select(svgElement);
    const container = d3.select(containerElement.nativeElement);

    const zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
    }

    const zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  moveTo(element: ElementRef, x: number, y: number) {
    const d3element = d3.select(element.nativeElement);
    d3element.attr('transform', `translate(${x},${y})`);
  }
}

import {Size} from '../domain/common/size';
import * as d3 from 'd3';

export class SvgHelper {

  static getBoundingBox(text: string, fontSize: string = '', fontFamily = ''): Size {
    const span_element = document.createElement('span');
    document.body.appendChild(span_element);

    const svg = d3.select(span_element).append('svg').attr('width', 1000).attr('height', 1000);
    const textElement = svg.append('text')
      .text(text)
      .style('font-family', fontFamily)
      .style('font-size', fontSize) as any;

    const bbox = textElement.node().getBBox();
    document.body.removeChild(span_element);
    return {
      width: bbox.width,
      height: bbox.height
    };
  }
}

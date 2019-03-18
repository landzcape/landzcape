import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {D3Service} from '../d3.service';

@Directive({
  selector: '[appZoomableOf]'
})
export class ZoomableDirective implements OnInit {

  @Input('appZoomableOf') zoomableOf: ElementRef;

  constructor(private d3Service: D3Service, private _element: ElementRef) {}

  ngOnInit() {
    console.log('zoom', this.zoomableOf, this._element);
    this.d3Service.applyZoomableBehaviour(this.zoomableOf, this._element);
  }

}

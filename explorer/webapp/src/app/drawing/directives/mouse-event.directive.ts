import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {D3Service} from '../d3.service';
import {Position} from '../../domain/common/position';

@Directive({
  selector: '[appMouseEvent]'
})
export class MouseEventDirective implements OnInit {

  @Output()
  mouseOver = new EventEmitter();

  @Output()
  mouseOut = new EventEmitter();

  @Output()
  mouseEnter = new EventEmitter();

  @Output()
  mouseLeave = new EventEmitter();

  constructor(private d3Service: D3Service, private _element: ElementRef) {}

  ngOnInit(): void {
    this.d3Service.onMouseOver(this._element, event => this.mouseOver.emit(event));
    this.d3Service.onMouseOut(this._element, event => this.mouseOut.emit(event));
    this.d3Service.onMouseEnter(this._element, event => this.mouseEnter.emit(event));
    this.d3Service.onMouseLeave(this._element, event => this.mouseLeave.emit(event));
  }

}

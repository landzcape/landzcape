import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {D3Service} from '../d3.service';
import {Position} from '../../domain/common/position';

@Directive({
  selector: '[appPosition]'
})
export class PositionDirective implements OnInit {

  _position: Position;

  @Input('appPosition')
  set position(position: Position) {
    this._position = position;
    this.updateTranslation();
  }

  constructor(private d3Service: D3Service, private _element: ElementRef) {}

  ngOnInit() {
    this.updateTranslation();
  }

  updateTranslation() {
    if (this._element !== undefined && this._position !== undefined) {
      this.d3Service.moveTo(this._element, this._position.x, this._position.y);
    }
  }

}

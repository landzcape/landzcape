import {Component, Input, OnInit} from '@angular/core';
import {ContextLo} from '../../model/context.lo';
import {Box} from '../../../../domain/common/box';

@Component({
  selector: '[appContext]',
  templateUrl: './context.component.html',
  styleUrls: ['./context.component.css']
})
export class ContextComponent implements OnInit {

  @Input()
  appContext: ContextLo;

  box: Box;

  ngOnInit() {
    this.box = this.appContext.box;
  }

}

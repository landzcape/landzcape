import {Component, Input, OnInit} from '@angular/core';
import {DomainLo} from '../../model/domain.lo';
import {Box} from '../../../../domain/common/box';
import {Store} from '@ngrx/store';
import {LandscapeState} from '../../../../landscape.reducer';
import {ShowContextAction, ShowDomainAction} from '../../../../landscape.actions';

@Component({
  selector: '[appDomain]',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {

  @Input()
  appDomain: DomainLo;

  box: Box;

  ngOnInit() {
    this.box = this.appDomain.box;
  }

}

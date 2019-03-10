import { Component, OnInit } from '@angular/core';
import {ComponentLo} from '../../model/component.lo';
import {select, Store} from '@ngrx/store';
import {LandscapeLo} from '../../model/landscape.lo';
import {Observable} from 'rxjs/index';
import {LandscapeService} from '../../../../api/landscape.service';
import {LandscapeDtoMapper} from '../../../../api/landscape.dto.mapper';
import {InitializeLandscapeAction} from '../../../../landscape.actions';
import {LandscapeState} from '../../../../landscape.reducer';
import {getLandscapeLayoutSelector} from '../../../../index';
import {Position} from '../../../../domain/common/position';

@Component({
  selector: 'appLandscape',
  templateUrl: './landscape.component.html',
  styleUrls: ['./landscape.component.css']
})
export class LandscapeComponent implements OnInit {

  components: ComponentLo[];
  landscape: Observable<LandscapeLo>;
  center = Position.ZERO;

  constructor(private service: LandscapeService, private store: Store<LandscapeState>) { }

  ngOnInit() {
    this.service.getLandscape().subscribe( landscapeDto => {
      const landscape = LandscapeDtoMapper.fromLandscapeDto(landscapeDto);
      this.store.dispatch(new InitializeLandscapeAction(landscape));
    });

    this.landscape = this.store.pipe(select(getLandscapeLayoutSelector));
    this.landscape.subscribe(landscapeLo => {
      if (landscapeLo) {
        const landscapeSize = landscapeLo.getDrawingBoxSize();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const x = centerX - (landscapeSize.width / 2);
        const y = centerY - (landscapeSize.height / 2);
        console.log(centerX, landscapeSize);
        console.log(centerY, landscapeSize);
        this.center = new Position(x, y);
      }
    });
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LandscapeDto} from './model/landscape.dto';
import {Observable} from 'rxjs/index';

@Injectable()
export class LandscapeService {

  constructor(private http: HttpClient) { }

  getLandscape(): Observable<LandscapeDto> {
    //return this.http.get('/assets/landscape.json') as Observable<LandscapeDto>;
    return this.http.get('/api/landscape') as Observable<LandscapeDto>;
  }

}

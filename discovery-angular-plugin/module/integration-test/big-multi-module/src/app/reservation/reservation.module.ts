import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReservationComponent} from './reservation.component';
import {SharedModule} from '../shared/shared.module';
import {ApiModule} from "./api/api.module";
import {ApiModule as CustomerApiModule} from "../customer/api/api.module";


@NgModule({
  declarations: [
    ReservationComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    ApiModule,
    CustomerApiModule
  ],
  providers: []
})
export class ReservationModule { }

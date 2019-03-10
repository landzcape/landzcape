import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReservationComponent} from './reservation.component';
import {DropdownComponent} from '../shared/dropdown/dropdown.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    ReservationComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ],
  providers: []
})
export class ReservationModule { }

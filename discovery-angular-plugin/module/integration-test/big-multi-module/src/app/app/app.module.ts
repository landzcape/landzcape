import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CustomerModule} from '../customer/customer.module';
import {ReservationModule} from '../reservation/reservation.module';
import {WeatherStationModule} from '../weather-station/weather-station.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CustomerModule,
    ReservationModule,
    WeatherStationModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

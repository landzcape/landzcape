import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CustomerComponent} from './customer.component';
import {SharedModule} from '../shared/shared.module';
import {ApiModule} from "./api/api.module";


@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    ApiModule
  ],
  providers: []
})
export class CustomerModule { }

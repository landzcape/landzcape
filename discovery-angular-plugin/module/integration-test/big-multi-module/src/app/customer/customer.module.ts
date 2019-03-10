import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CustomerComponent} from './customer.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ],
  providers: []
})
export class CustomerModule { }

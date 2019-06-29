import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LandscapeService} from './api/landscape.service';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {metaReducers, reducers} from './index';
import {ComponentComponent} from './drawing/landscape/components/component/component.component';
import {DependencyComponent} from './drawing/landscape/components/dependency/dependency.component';
import {LandscapeComponent} from './drawing/landscape/components/landscape/landscape.component';
import {ZoomableDirective} from './drawing/directives/zoomable.directive';
import {ContextComponent} from './drawing/landscape/components/context/context.component';
import {DomainComponent} from './drawing/landscape/components/domain/domain.component';
import {PositionDirective} from './drawing/directives/position.directive';
import {D3Service} from './drawing/d3.service';
import { NavbarComponent } from './drawing/tools/components/navbar/navbar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListboxModule} from 'primeng/listbox';
import {TreeModule} from 'primeng/tree';
import {SelectableTreeComponent} from './drawing/tools/components/selectable-tree/selectable-tree.component';
import {LayerComponent} from "./drawing/landscape/components/layer/layer.component";
import {MouseEventDirective} from "./drawing/directives/mouse-event.directive";

@NgModule({
  declarations: [
    AppComponent,
    LayerComponent,
    ComponentComponent,
    DependencyComponent,
    LandscapeComponent,
    ZoomableDirective,
    PositionDirective,
    MouseEventDirective,
    DomainComponent,
    ContextComponent,
    NavbarComponent,
    SelectableTreeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ListboxModule,
    TreeModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Book Store DevTools'
    }),
  ],
  providers: [ LandscapeService, D3Service ],
  bootstrap: [AppComponent]
})
export class AppModule { }

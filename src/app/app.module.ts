import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { PoTabsModule } from '@po-ui/ng-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    RouterModule.forRoot([]),

    PoFieldModule,
    PoTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

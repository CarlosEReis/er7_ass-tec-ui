import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PoFieldModule, PoModule } from '@po-ui/ng-components';
import { PoTabsModule } from '@po-ui/ng-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SegurancaModule } from './seguranca/seguranca.module';
import { AutenticacaoGuard } from './guardas/autenticacao.guard';


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
    PoTabsModule,

    SegurancaModule
  ],
  providers: [ AutenticacaoGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }

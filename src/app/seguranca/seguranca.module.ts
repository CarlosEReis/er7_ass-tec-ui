import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoPageLoginModule } from '@po-ui/ng-templates';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { FormLoginComponent } from './form-login/form-login.component';
import { PoNotificationModule } from '@po-ui/ng-components';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AutenticacaoInterceptor } from './autenticacao.interceptor';


@NgModule({
  declarations: [
    FormLoginComponent
  ],
  imports: [
    CommonModule,

    PoPageLoginModule,
    PoNotificationModule,

    SegurancaRoutingModule,
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AutenticacaoInterceptor,
      multi: true   
  }]
})
export class SegurancaModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { PoModule } from '@po-ui/ng-components';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';
import { PoPageBlockedUserModule } from '@po-ui/ng-templates';


@NgModule({
  declarations: [
    CoreComponent,
    NaoAutorizadoComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,

    PoModule,
    PoPageBlockedUserModule
  ]
})
export class CoreModule { }

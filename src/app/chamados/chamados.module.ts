import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadosRoutingModule } from './chamados-routing.module';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';
import { PoModule, PoNotificationModule, PoNotificationService } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChamadosPesquisaComponent
  ],
  imports: [
    CommonModule,
    ChamadosRoutingModule,
    FormsModule,

    PoModule,
    PoNotificationModule
  ]
})
export class ChamadosModule { }

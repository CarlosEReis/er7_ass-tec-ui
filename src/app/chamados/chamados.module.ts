import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChamadosRoutingModule } from './chamados-routing.module';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule, PoModule, PoNotificationModule, PoNotificationService } from '@po-ui/ng-components';
import { ChamadoFormComponent } from './chamado-form/chamado-form.component';


@NgModule({
  declarations: [
    ChamadosPesquisaComponent,
    ChamadoFormComponent
  ],
  imports: [
    CommonModule,
    ChamadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    PoModule,
    PoFieldModule,
    
  ]
})
export class ChamadosModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { PoFieldModule, PoModule, PoNotificationModule, PoTabsModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClientesPesquisaComponent } from './clientes-pesquisa/clientes-pesquisa.component';


@NgModule({
  declarations: [
    ClienteFormComponent,
    ClientesPesquisaComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    PoModule,
    PoFieldModule,
    PoTabsModule,
    PoNotificationModule,
    PoTabsModule
  ]
})
export class ClientesModule { }

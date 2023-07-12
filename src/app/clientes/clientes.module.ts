import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { PoFieldModule, PoModule, PoNotificationModule, PoTabsModule } from '@po-ui/ng-components';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ClienteFormComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

    PoModule,
    PoFieldModule,
    PoTabsModule,
    PoNotificationModule
  ]
})
export class ClientesModule { }

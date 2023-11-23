import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuasiosPesquisaComponent } from './usuasios-pesquisa/usuasios-pesquisa.component';
import { PoModule, PoTagModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuasiosPesquisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    PoModule,
    PoTagModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }

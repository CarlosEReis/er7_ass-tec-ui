import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { PoModule, PoTagModule } from '@po-ui/ng-components';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuariosPesquisaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    PoModule,
    PoTagModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';

const routes: Routes = [
  { 
    path: '', component: UsuariosPesquisaComponent, canActivate: [ AutenticacaoGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

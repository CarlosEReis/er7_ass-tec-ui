import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuasiosPesquisaComponent } from './usuasios-pesquisa/usuasios-pesquisa.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';

const routes: Routes = [
  { 
    path: '', component: UsuasiosPesquisaComponent, canActivate: [ AutenticacaoGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

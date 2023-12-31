import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClientesPesquisaComponent } from './clientes-pesquisa/clientes-pesquisa.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';

const routes: Routes = [
  { path: '', component: ClientesPesquisaComponent, canActivate: [ AutenticacaoGuard ]  },
  { path: 'novo', component: ClienteFormComponent, data:{ novoCliente: true }, canActivate: [ AutenticacaoGuard ] },
  { path: ':id', component: ClienteFormComponent, data: { modoEdicao: false }, canActivate: [ AutenticacaoGuard ] },
  { path: ':id/edicao', component: ClienteFormComponent, data: { modoEdicao: true }, canActivate: [ AutenticacaoGuard ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }

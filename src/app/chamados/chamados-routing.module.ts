import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';
import { ChamadoFormComponent } from './chamado-form/chamado-form.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';

const routes: Routes = [
  { path: '', component: ChamadosPesquisaComponent, canActivate: [ AutenticacaoGuard ] },
  { path: 'novo', component: ChamadoFormComponent, data: { novoChamado: true }, canActivate: [ AutenticacaoGuard ]},
  { path: ':id', component: ChamadoFormComponent, data: { modoEdicao: false }, canActivate: [ AutenticacaoGuard ] },
  { path: ':id/edicao', component: ChamadoFormComponent, data: { modoEdicao: true }, canActivate: [ AutenticacaoGuard ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadosRoutingModule { }

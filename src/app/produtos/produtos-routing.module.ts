import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutosPesquisaComponent } from './produtos-pesquisa/produtos-pesquisa.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';
import { ProdutoFormComponent } from './produto-form/produto-form.component';

const routes: Routes = [
  { path: '', component: ProdutosPesquisaComponent, canActivate: [ AutenticacaoGuard ] },
  { path: 'novo', component: ProdutoFormComponent, canActivate: [ AutenticacaoGuard ] },
  { path: ':id', component: ProdutoFormComponent, data: { modoVisualizacao: true }, canActivate: [ AutenticacaoGuard] },
  { path: ':id/edicao', component: ProdutoFormComponent, data: { modoEdicao: true }, canActivate: [ AutenticacaoGuard ],  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }

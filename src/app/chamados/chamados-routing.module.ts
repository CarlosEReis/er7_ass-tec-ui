import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';
import { ChamadoFormComponent } from './chamado-form/chamado-form.component';

const routes: Routes = [
  { path: '', component: ChamadosPesquisaComponent },
  { path: 'novo', component: ChamadoFormComponent},
  { path: ':id/edicao', component: ChamadoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadosRoutingModule { }

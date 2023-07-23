import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChamadosPesquisaComponent } from './chamados-pesquisa/chamados-pesquisa.component';

const routes: Routes = [
  { path: '', component: ChamadosPesquisaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChamadosRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClientesPesquisaComponent } from './clientes-pesquisa/clientes-pesquisa.component';

const routes: Routes = [
  { path: '', component: ClientesPesquisaComponent },
  { path: 'novo', component: ClienteFormComponent  },
  { path: ':id/edicao', component: ClienteFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }

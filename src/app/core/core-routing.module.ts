import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';

export const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'clientes',
        loadChildren: () =>
          import('../clientes/clientes.module').then((m) => m.ClientesModule)
      },
      {
        path: '',
        redirectTo: 'assistencia',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

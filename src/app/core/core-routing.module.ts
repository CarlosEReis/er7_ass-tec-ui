import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { AutenticacaoGuard } from '../guardas/autenticacao.guard';

export const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'clientes',
        loadChildren: () =>
          import('../clientes/clientes.module').then((m) => m.ClientesModule),
        canActivate: [ AutenticacaoGuard ]
      },
      {
        path: 'chamados',
        loadChildren: () =>
          import('../chamados/chamados.module').then((m) => m.ChamadosModule),
        canActivate: [ AutenticacaoGuard ]
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [ AutenticacaoGuard ]
      },
      {
        path: '',
        redirectTo: 'assistencia',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'app',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

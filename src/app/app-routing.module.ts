import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacaoGuard } from './guardas/autenticacao.guard';
import { NaoAutorizadoComponent } from './core/nao-autorizado/nao-autorizado.component';

const routes: Routes = [
  { path: 'app', loadChildren: () => import("../app/core/core.module").then((m) => m.CoreModule), canActivate: [ AutenticacaoGuard ]},
  { path: 'auth/login', loadChildren: () => import("../app/seguranca/seguranca.module").then((m) => m.SegurancaModule) },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: '**', redirectTo: 'app', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 
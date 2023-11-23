import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoToolbarAction, PoToolbarProfile } from '@po-ui/ng-components';

import { environment } from 'src/environments/environment.development';
import { UsuarioService } from '../seguranca/usuario.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent {

  readonly appNomeDesc = environment.appNomeDesc;
  user$ = this.usuarioService.retornaUsuario();
  usuario = this.usuarioService.retornaUsuarioObj();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  profile: PoToolbarProfile = {
    avatar: './assets/img/foto-carlos.jpg',
    subtitle: this.usuario.sub+'',
    title: this.usuario.user+''
  };

  readonly profileActions: Array<PoToolbarAction> = [
    { icon: 'po-icon-exit', label: 'Sair', type: 'danger', separator: true, action: this.sair.bind(this)}
  ];

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', link: 'dashboard', icon: 'po-icon po-icon-chart-area', shortLabel: 'Home' },
    { label: 'Clientes', link: 'clientes', icon: 'po-icon po-icon-handshake', shortLabel: 'Clientes' },
    { label: 'Chamados', link: 'chamados', icon: 'po-icon po-icon-news', shortLabel: 'Chamados' },
    { label: 'Usuários', link: 'usuarios', icon: 'po-icon po-icon-users', shortLabel: 'Usuários' }
  ];

  private sair() {  
    this.usuarioService.logout();
    this.router.navigate(['auth', 'login']);
  }

}

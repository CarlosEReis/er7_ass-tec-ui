import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem, PoNotificationService, PoToolbarAction, PoToolbarProfile } from '@po-ui/ng-components';

import { environment } from 'src/environments/environment.development';
import { UsuarioService } from '../seguranca/usuario.service';
import { EventService } from './event.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit{
  private readonly produtosURL = environment.apiUrl.concat('/events/api-events')

  readonly appNomeDesc = environment.appNomeDesc;
  user$ = this.usuarioService.retornaUsuario();
  usuario = this.usuarioService.retornaUsuarioObj();
  menu: PoMenuItem[] = []; 

  profile: PoToolbarProfile = {
    avatar: './assets/img/foto-carlos.jpg',
    subtitle: this.usuario.sub+'',
    title: this.usuario.user+''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private eventService: EventService,
    private poNotificationService: PoNotificationService
  ) {

    this.configMenuDefault();
    this.configMenuAdmin();
  }

  ngOnInit(): void {
    this.eventService.getServerSentEvent(this.produtosURL).subscribe({});

    this.eventService.events.subscribe((event: MessageEvent) => {
      if (event) {
        this.notificar(event.type)
      }
    })
  }

  private notificar(eventType: string) {
    if (eventType) {      
      this.poNotificationService.success({
        message: `Chamado ${eventType}.`
      })
    }
  }



  readonly profileActions: Array<PoToolbarAction> = [
    { icon: 'po-icon-exit', label: 'Sair', type: 'danger', separator: true, action: this.sair.bind(this)}
  ];

  private configMenuDefault() {
    this.menu = [
      { label: 'Home', link: 'dashboard', icon: 'po-icon po-icon-chart-area', shortLabel: 'Home' },
      { label: 'Chamados', link: 'chamados', icon: 'po-icon po-icon-news', shortLabel: 'Chamados' },
      { label: 'Clientes', link: 'clientes', icon: 'po-icon po-icon-handshake', shortLabel: 'Clientes' },
      { label: 'Produtos', link: 'produtos', icon: 'po-icon po-icon-pallet-full', shortLabel: 'Produto' }
    ];
  }

  private configMenuAdmin() {
    if (this.usuarioService.possuiPermissao('ROLE_ADMIN')) {
      const menuUsuarios: PoMenuItem = { label: 'Usuários', link: 'usuarios', icon: 'po-icon po-icon-users', shortLabel: 'Usuários' };
      this.menu.push(menuUsuarios);
    }
  }

  private sair() {  
    this.usuarioService.logout();
    this.router.navigate(['auth', 'login']);
  }

}

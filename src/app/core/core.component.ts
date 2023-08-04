import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent {

  readonly appNomeDesc = environment.appNomeDesc;

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', link: '/', icon: 'po-icon po-icon-chart-area', shortLabel: 'Home' },
    { label: 'Clientes', link: '/clientes', icon: 'po-icon po-icon-handshake', shortLabel: 'Clientes' },
    { label: 'Chamados', link: '/chamados', icon: 'po-icon po-icon-news', shortLabel: 'Chamados' }
  ];

  private onClick() {
    alert('Clicked in menu item')
  }
}

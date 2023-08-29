import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AutenticacaoService } from '../autenticacao.service';
import { catchError } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent {

  readonly ambiente = environment.environment;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private notificationService: PoNotificationService,
    private router: Router
  ) {}

  public login(usuario: any) {
    this.autenticacaoService.
      logar(usuario.login, usuario.password)
        .subscribe({
          next: () => this.router.navigate(['app']) ,
          error: () => this.notificationService.error(
            { 
              message: 'Dados de autenticação inválidos.',
              duration: 3
            })
        });
  }

}

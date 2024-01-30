import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AutenticacaoService } from '../autenticacao.service';
import { PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent implements OnInit{

  readonly ambiente = environment.environment;
  private timeSetInterval!: NodeJS.Timer;

  backgroundImageAtual = '';

  constructor(
    private autenticacaoService: AutenticacaoService,
    private notificationService: PoNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.muda();
  }

  public login(usuario: any) {
    this.autenticacaoService.
      logar(usuario.login, usuario.password)
        .subscribe({
          next: () => {
            clearInterval(this.timeSetInterval)
            this.router.navigate(['app', 'dashboard'])
          } ,
          error: () => this.notificationService.error(
            { 
              message: 'Dados de autenticação inválidos.',
              duration: 3
            })
        });
  }

  muda() {
    let array = [
      './assets/img/login-img-01.jpeg',
      './assets/img/login-img-02.jpeg',
      './assets/img/login-img-03.jpeg',
      './assets/img/login-img-04.jpeg',
    ];
    let index = 0;
    this.backgroundImageAtual = array[index];

    this.timeSetInterval = setInterval(() => {
      this.backgroundImageAtual = array[index];
      index++;
  
      if (index === array.length) {
          index = 0;
      }
    }, 5000);
  }

}

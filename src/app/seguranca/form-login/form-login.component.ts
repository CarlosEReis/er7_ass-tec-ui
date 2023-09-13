import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AutenticacaoService } from '../autenticacao.service';
import { catchError, interval } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent implements OnInit{

  readonly ambiente = environment.environment;

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
          next: () => this.router.navigate(['app']) ,
          error: () => this.notificationService.error(
            { 
              message: 'Dados de autenticação inválidos.',
              duration: 3
            })
        });
  }

  muda() {
    let array = [
      'https://img.freepik.com/fotos-gratis/mecanico-de-automoveis-feliz-usando-tablet-digital-enquanto-trabalhava-na-oficina-mecanica_637285-7606.jpg?w=1800&t=st=1694571548~exp=1694572148~hmac=dbf4b20428051e3c4b61740a91caafa42b01ca1f1fae5a9de1d48c708cfa36b1', 
      'https://img.freepik.com/fotos-gratis/pessoa-de-vista-frontal-reparando-uma-placa-mae_23-2148419153.jpg?w=900&t=st=1694571249~exp=1694571849~hmac=b7186672d20ed3d030769fa52ad1e58c2f78436eeadb67e0e4acfe1779f3cdee', 
      'https://img.freepik.com/fotos-premium/servico-de-reparo-de-eletronicos-espaco-de-texto_87646-4953.jpg?w=826'
    ]; // Seu array de números
    let index = 0;
    this.backgroundImageAtual = array[index];

    setInterval(() => {
      this.backgroundImageAtual = array[index];
      console.log(array[index]);
      index++;
  
      if (index === array.length) {
          index = 0;
          //clearInterval(intervalId);
      }
  }, 5000);
  }

}

import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nao-autorizado',
  template: `
    <po-page-blocked-user 
    p-url-back='/app/dashboard'
    ></po-page-blocked-user>
  `,
  styles: [
  ]
})
export class NaoAutorizadoComponent implements AfterViewInit {
  
  constructor(
    private elRef: ElementRef
  ) {}
  
  ngAfterViewInit(): void {
    this.auteraTitulo();
    this.auteraSubTitulo();
  }

  private auteraTitulo() : void {
    const titulo = this.elRef.nativeElement.querySelector('.po-page-blocked-user-header > div');
    titulo.innerHTML = 'Acesso não autorizado.';
  }

  private auteraSubTitulo() : void {
    const subTitulo1 = this.elRef.nativeElement.querySelector('.po-page-blocked-user-text > div:first-child');
    subTitulo1.innerHTML = 'Você não possui permissão para acessar essa página.'

    const subTitulo2 = this.elRef.nativeElement.querySelector('.po-page-blocked-user-text > div:last-child');
    subTitulo2.innerHTML = '';
  }
}

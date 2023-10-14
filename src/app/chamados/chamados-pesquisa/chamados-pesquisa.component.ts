import { Component, OnInit } from '@angular/core';
import { PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ChamadosService } from '../chamados.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chamados-pesquisa',
  templateUrl: './chamados-pesquisa.component.html',
  styleUrls: ['./chamados-pesquisa.component.css']
})
export class ChamadosPesquisaComponent implements OnInit{
  
  chamados!: any[];
  pesquisaNomeCliente!: string;
  
  acoes!: PoPageAction[];
  colunas!: PoTableColumn[];
  carregandoChamados = false;

  private paginacao = {
    size: 7,
    page: 0
  }

  constructor(
    private rotuer: Router,
    private chamadosService: ChamadosService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.carregaChamados();
    this.carregarAcoes();
    this.colunas = this.carregaColunas();
  }

  public carregaChamados(): void {
    this.carregandoChamados = true;
    this.chamadosService.pesquisar(this.pesquisaNomeCliente, this.paginacao)
      .then(
        clientes => {
          this.chamados = this.adicionarAcoes(clientes['content']);
          this.carregandoChamados = false;
        })
      .catch(
        (erro) => this.poNotificationService.error({message: 'Não foi possível carregar os clientes.'}))
  }

  public carregarMaisChamados() : void {
    this.carregandoChamados = true;
    this.paginacao.page++;
    this.chamadosService.pesquisar(this.pesquisaNomeCliente,this.paginacao)
      .then(
        chamados => {
          this.chamados = this.chamados.concat(this.adicionarAcoes(chamados['content']))
          this.carregandoChamados = false;
        }
      )
      .catch( erro => this.poNotificationService.error({
          message: 'Não foi possível carregar novos chamado.'
        })
      )
  }

  private carregarAcoes() : void  {
    this.acoes = [
      { label: 'Novo', action: this.novoChamado.bind(this) }
    ]
  }

  private novoChamado() : void {
    this.rotuer.navigate(['app','chamados', 'novo']);
  }
  
  public pesquisar() {
    if (this.pesquisaNomeCliente && this.pesquisaNomeCliente.length > 3) {
      this.carregaChamados();
    } else if (!this.pesquisaNomeCliente) {
      this.carregaChamados();
    }
  }

  private carregaColunas(): PoTableColumn[] {
    return [
      { label: 'id', property: 'id' },
      { label: 'Data criação', property: 'dataCriacao', type: 'dateTime'},
      { label: 'Status', property: 'status', type: 'label', labels: [
        { value: 'FILA', label: 'Na Fila', color: 'color-08', textColor: '#FFF', },
        { value: 'PROCESSANDO', label: 'Processando', color: 'color-02', textColor: '#FFF' },
        { value: 'FINALIZADO', label: 'Finalizado', color: 'color-10', textColor: '#FFF' } ] },
      { label: 'Cliente', property: 'cliente.nome' },
      { label: 'CPF/CNPJ', property: 'cliente.documento', type: 'columnTemplate' },
      { 
        label: 'Ações',
        property: 'acoes',
        type: 'icon',
        sortable: false,
        icons: [
          {
            action: (value: any) => { this.rotuer.navigate(['app', 'chamados', value.id]) } ,
            icon: 'po-icon po-icon-eye' ,
            tooltip: 'Visualizar' ,
            value: 'visualizar'             
          },
          { 
            action: (value: any) => { this.editarChamado(value) } ,
            icon: 'po-icon-export' ,
            tooltip: 'Editar' ,
            value: 'editar' 
          },
          { 
            action: (value: any) => { this.geraFichaChamado(value) } ,
            icon: 'po-icon-document-filled' ,
            tooltip: 'Ficha' ,
            value: 'ficha' 
          }
        ]
      }
    ];
  }

  private geraFichaChamado(value: any) {
    this.chamadosService.fichaChamadoTecnico(value.id)
    .then(ficha => {
      const url = window.URL.createObjectURL(ficha);
      window.open(url);
    });
  }

  private editarChamado(value: any): void {
    this.rotuer.navigate([`/app/chamados/${value.id}`, 'edicao'])
  }

  private adicionarAcoes(clientes: any[]): any[]  {
    return clientes.map(
      clientes => ({...clientes, acoes: ['visualizar', 'editar', 'ficha']})
    );
  }
}

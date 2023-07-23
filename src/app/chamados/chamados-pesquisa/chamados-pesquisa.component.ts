import { Component, OnInit } from '@angular/core';
import { PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
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
  
  colunas!: PoTableColumn[];

  constructor(
    private rotuer: Router,
    private chamadosService: ChamadosService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.carregaChamados();
    this.colunas = this.carregaColunas();
  }

  public carregaChamados(): void {
    this.chamadosService.pesquisar(this.pesquisaNomeCliente)
      .then(
        clientes => this.chamados = this.adicionarAcoes(clientes))
      .catch(
        (erro) => this.poNotificationService.error({message: 'Não foi possível carregar os clientes.'}))
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
      { label: 'Data criação', property: 'dataCriacao'},
      { label: 'Status', property: 'status', type: 'label', labels: [
        { value: 'FILA', label: 'Na Fila', color: 'color-08', textColor: '#FFF', },
        { value: 'PROCESSANDO', label: 'Processando', color: 'color-02', textColor: '#FFF' },
        { value: 'FINALIZADO', label: 'Finalizado', color: 'color-10', textColor: '#FFF' } ] },
      { label: 'Cliente', property: 'clienteNome' },
      { label: 'CPF/CNPJ', property: 'clienteDocumento' },
      { 
        label: 'Ações',
        property: 'acoes',
        type: 'icon',
        sortable: false,
        icons: [
          { 
            action: (value: any) => { this.editarChamado(value) } ,
            icon: 'po-icon-export' ,
            tooltip: 'Editar' ,
            value: 'editar' 
          }
        ]
      }
    ];
  }

  private editarChamado(value: any): void {
    this.rotuer.navigate([`chamados/${value.id}`, 'edicao'])
  }

  private adicionarAcoes(clientes: any[]): any[]  {
    return clientes.map(
      clientes => ({...clientes, acoes: ['editar']})
    );
  }
}

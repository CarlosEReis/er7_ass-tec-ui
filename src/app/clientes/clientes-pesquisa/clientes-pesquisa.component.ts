import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ClientesService } from '../clientes.service';
import { ClienteResumo, PageClienteResumo } from '../model/ClienteResumo';

@Component({
  selector: 'app-clientes-pesquisa',
  templateUrl: './clientes-pesquisa.component.html',
  styleUrls: ['./clientes-pesquisa.component.css']
})
export class ClientesPesquisaComponent implements OnInit{
  
  clientes: ClienteResumo[] = [];
  pesquisaNome!: string;

  acoes!: PoPageAction[]
  colunas!: PoTableColumn[];
  carregandoClientes= false;

  private paginacao = {
    size: 12,
    page: 0,
    last: false
  }
  
  constructor(
    private clienteService: ClientesService,
    private poNotificationService: PoNotificationService,
    private router: Router) {}

  ngOnInit(): void {
    this.acoes = this.carregaAcoes();
    this.colunas = this.carregaColunas();
    this.carregaClientes();
  }

  public carregaClientes(): void {
    this.carregandoClientes = true;
    this.clienteService.pesquisar(this.pesquisaNome, this.paginacao).subscribe({
      next: (pageClientes: PageClienteResumo) => {
        this.clientes = this.clientes.concat(this.adicionarNovaPropriedade(pageClientes.content));
        this.paginacao.last = pageClientes.last;
        this.carregandoClientes = false;
      },
      error: (errro) => {
        this.poNotificationService.error({message: 'Não foi possível carregar os clientes.'});
      }
    });
  }
  
  public carregarMaisClientes(event: any): void {
    if (this.paginacao.last) {
      this.poNotificationService.warning({ message: 'Não há mais clientes para carregar.' })
      return;
    }
    this.paginacao.page++;
    this.carregaClientes();
  }

  public pesquisar() {    
    if(this.pesquisaNome && this.pesquisaNome.length > 3) {
      this.paginacao.page = 0;
      this.clienteService.pesquisar(this.pesquisaNome, this.paginacao).subscribe({
        next: (pageCientes: PageClienteResumo) => {
          this.clientes = this.adicionarNovaPropriedade(pageCientes.content);
          this.paginacao.last = pageCientes.last;
          this.carregandoClientes = false;
        }
      })
    } else if (!this.pesquisaNome){
      this.carregaClientes()
    }
  }

  private carregaColunas() : PoTableColumn[] {
    return [
      { label: 'Código', property: 'id' },
      { label: 'Nome', property: 'nome' },
      { label: 'Tipo', property: 'tipoPessoa', type: 'label' , width: '3%',labels: [
        { value: 'FISICA', color: 'color-03', label: 'F', tooltip: 'Fisíca', textColor: '#fff' },
        { value: 'JURIDICA', color: 'color-01', label: 'J', tooltip: 'Jurídica', textColor: '#fff' },
      ]},
      { label: 'Status', property: '' },
      { label: 'tipo', property: '' },
      { label: 'CPF / CNPJ', property: 'documento', type: 'columnTemplate' },
      { label: 'Localização', property: 'endereco.localidade' },
      { label: 'Vendedor', property: '' },
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        sortable: false,
        icons: [
          {
            action: (value: any) => { this.router.navigate(['app', 'clientes', value.id]) },
            icon: 'po-icon po-icon-eye',
            tooltip: 'Visualizar',
            value: 'visualizar'
          },
          {
            action: (value: any) => { this.editarCliente(value) },
            icon: 'po-icon-export',
            tooltip: 'Editar',
            value: 'editar'
          }
        ]
      }
    ]
  }
  
  private carregaAcoes() : PoPageAction[] {
    return [
      { label: 'Novo', action: this.novoCliente.bind(this) }
    ]
  }

  private novoCliente() : void {
    this.router.navigate(['/app/clientes', 'novo']);
  }

  private editarCliente(value: any) : void {
    this.router.navigate([`/app/clientes/${value.id}`,'edicao']);
  }

  private adicionarNovaPropriedade(clientes: any[]) : any[] {
    return clientes.map(
      cliente => ({...cliente, acoes: ['visualizar', 'editar']})
    );
  }
}

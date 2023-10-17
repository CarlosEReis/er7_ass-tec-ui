import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-clientes-pesquisa',
  templateUrl: './clientes-pesquisa.component.html',
  styleUrls: ['./clientes-pesquisa.component.css']
})
export class ClientesPesquisaComponent implements OnInit{
  
  clientes!: any[];
  pesquisaNome!: string;

  acoes!: PoPageAction[]
  colunas!: PoTableColumn[];
  carregandoClientes= false;

  private paginacao = {
    size: 12,
    page: 0
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
    this.clienteService.pesquisar(this.pesquisaNome, this.paginacao)
      .then(
        clientes => {
          console.log(clientes);
          this.clientes = this.adicionarNovaPropriedade(clientes['content'])
          this.carregandoClientes = false;
        }
      )
      .catch((erro) => this.poNotificationService.error({message: 'Não foi possível carregar os clientes.'})
    )
  }

  public carregarMaisClientes(event: any): void {
    this.carregandoClientes = true;
    this.paginacao.page++;

    this.clienteService.pesquisar(this.pesquisaNome, this.paginacao )
      .then((resp: any) => {
        this.clientes = this.adicionarNovaPropriedade(this.clientes.concat(resp['content']));
        this.carregandoClientes = false;        
      })
      .catch(
        erro => this.poNotificationService.error({ message: 'Não foi possível carregar novos cliente.' })
      )
  }

  public pesquisar() {    
    if(this.pesquisaNome && this.pesquisaNome.length > 3) {
      this.carregaClientes();
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

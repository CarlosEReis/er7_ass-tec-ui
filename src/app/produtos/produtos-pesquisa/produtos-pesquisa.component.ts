import { Component } from '@angular/core';
import { PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ProdutosService } from '../produtos.service';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos-pesquisa',
  templateUrl: './produtos-pesquisa.component.html',
  styleUrls: ['./produtos-pesquisa.component.css']
})
export class ProdutosPesquisaComponent {

  public search: string = '';
  public acoes: PoPageAction[] = [];
  public colunas: PoTableColumn[] = [];
  public produtos$: Observable<any>;
  public carregandoProdutos = false;

  private paginacao = {
    size: 12,
    page: 0,
    last: false
  }

  constructor(
    private router: Router,
    private produtosService: ProdutosService,
    private poNotificationService: PoNotificationService){

    this.colunasConfig();
    this.acoesConfig();
    this.produtos$ = this.carregarProdutos();
  }
  
  private carregarProdutos() {
    this.carregandoProdutos = true;
    return this.produtosService.pesquisar(this.search, this.paginacao)
      .pipe(
        tap(() => this.carregandoProdutos = false),
        map((x) => x.content.map((produto: any) => this.adicionaAcoes(produto)))
      );
  }

  public pesquisar() {
    if (this.search.length > 3) {
      this.produtos$ = this.carregarProdutos();
    } else if (!this.search){
      this.produtos$ = this.carregarProdutos();
    }
  }

  public carregarMaisProdutos() {
    if (this.paginacao.last) {
      this.poNotificationService.warning({ message: 'Não há mais Produtos para carregar.' });
      return;
    }
    this.paginacao.page++;
    this.carregandoProdutos = true;

    this.produtosService.pesquisar(this.search, this.paginacao)
    .subscribe((novosProdutos) => {    
      this.produtos$ = this.produtos$.pipe(
        map((produtos) => [...produtos, ...novosProdutos.content]))
      this.carregandoProdutos = false;
      this.paginacao.last = novosProdutos.last;
    });
  }

  private acoesConfig() : void {
    this.acoes = [
      { label: 'Novo', action: () => this.router.navigate(['app', 'produtos', 'novo']) }
    ]
  }

  private colunasConfig() : void {
    this.colunas = [
      { label: 'Código', property: 'id' },
      { label: 'SKU', property: 'sku' },
      { label: 'Nome', property: 'nome' },
      { label: 'Descriç.', property: 'descricao', type: 'columnTemplate' },
      { label: 'Ações', property: 'acoes', type: 'icon', icons: [
        {
          action: (value: any) => { this.router.navigate(['app', 'produtos', value.id]) },
          icon: 'po-icon po-icon-eye',
          tooltip: 'Visualizar',
          value: 'visualizar'
        },
        {
          action: (value: any) => { this.router.navigate(['app', 'produtos', value.id, 'edicao']) },
          icon: 'po-icon-export',
          tooltip: 'Editar',
          value: 'editar'
        }        
      ]}
    ]
  }
  
  private adicionaAcoes(produto: any) : any {
    return produto = ({ ...produto, acoes: ['visualizar', 'editar']});
  }
  
}

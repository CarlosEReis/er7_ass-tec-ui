import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoNotificationService, PoPageAction } from '@po-ui/ng-components';
import { ProdutosService } from '../produtos.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit{

  public titulo = '';
  public produtoForm!: FormGroup;
  public acoes: PoPageAction[] = [];
  private isEdicao = false;
  private isVisualizacao = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private produtoService: ProdutosService,
    private poNotificationService: PoNotificationService) {

    this.formProdutoConfig(); 
  }

  ngOnInit(): void {
    const produtoId = this.activatedRoute.snapshot.params['id'];
    this.isEdicao = this.activatedRoute.snapshot.data['modoEdicao'];
    this.isVisualizacao = this.activatedRoute.snapshot.data['modoVisualizacao'];

    if (produtoId) {
      this.titulo = this.isEdicao ?  'Editando Produto' : 'Visualizando Produto'
      this.produtoService.buscar(produtoId)
      .subscribe(((produto: any) => this.produtoForm.patchValue(produto)))
    } else {
      this.titulo = 'Novo Produto'
    }

    this.acoesConfig();
  }

  public salvar() : void {
    const produto =this.produtoForm.value;
    this.produtoService.criar(produto).subscribe({
      complete: () => {
        this.poNotificationService.success({ message: 'Produto salva com SelectControlValueAccessor.' });
        this.router.navigate(['app', 'produtos']);
      },
      error: () => this.poNotificationService.error({ message: 'Não foi possível salvar o produto.' })
    })
  }

  private atualizar() {
    this.produtoService.atualizar(this.produtoForm.get('id')?.value, this.produtoForm.value)
    .subscribe({
      complete: () => {
        this.poNotificationService.success({ message: 'Produto atualizado com sucesso.' });
        this.router.navigate(['app', 'produtos'])},
      error: () => this.poNotificationService.error({ message: 'Não foi possível atualizar o produto.' })
    });
  }

  private formProdutoConfig() : void {
    this.produtoForm = this.formBuilder.group({
      id: [''],
      sku: ['', Validators.required],
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    })
  }

  private acoesConfig() : void {

    if (this.isEdicao) {
      this.acoes.push(
        { label: 'Atualizar', action: () => this.atualizar(), disabled: () => this.produtoForm.invalid })
    }

    if (!this.isEdicao && !this.isVisualizacao){
      this.acoes.push(
        { label: 'Salvar', action: () => this.salvar(), disabled: () => this.produtoForm.invalid })
    }


    this.acoes.push(
      { label: 'Voltar', action: () => this.router.navigate(['app/produtos']) })
  }
  
}

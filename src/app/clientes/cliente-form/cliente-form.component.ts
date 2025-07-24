import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoNotificationService, PoPageAction, PoSelectOption } from '@po-ui/ng-components';
import { ClientesService } from '../clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  
  tituloPagina = '';
  overlayHidden = true;
  acoes: PoPageAction[] = [];
  clienteForm!: FormGroup;
  tipoPessoa!: PoSelectOption[]; 
  tipoCliente!: PoSelectOption[];
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private clienteService: ClientesService, 
    private poNotificationService: PoNotificationService) {}

  ngOnInit(): void {
    const clienteId = this.activatedRoute.snapshot.params['id'];

    if (clienteId) {
      this.buscarCliente(clienteId);
    } else {
      this.tituloPagina = 'Novo Cliente'
    }

    this.carregaAcoes();
    this.clienteForm = this.configuraForm();
    this.tipoPessoa = this.carregaTipoPessoa();
    this.tipoCliente = this.carregaTipoCliente();
  }

  public modoEdicao() : boolean {
    const clienteId = this.activatedRoute.snapshot.params['id'];
    const modoEdicao = this.activatedRoute.snapshot.data['modoEdicao'];
    if (clienteId && modoEdicao === true) {
      return true;
    }
    return false;
  }

  public modoVisualizacao() : boolean {
    return this.activatedRoute.snapshot.data['modoEdicao'] === false;
  }

  public novoCliente() : boolean {
    return this.activatedRoute.snapshot.data['novoCliente'] ? true : false;
  }

  private buscarCliente(codigo: number) : void {
    console.log(`Buscando cliente com código ${codigo}`);
    
    this.overlayHidden = false;
    this.clienteService.buscar(codigo)
      .then((cliente: any) => {
        this.carregaCliente(cliente);
        
      })
      .catch()
      .finally( () => {
        this.overlayHidden = true
      } );
  }


  private tituloPaginaEditandoOuVisualizando() {
    if (this.modoEdicao()) {
      this.tituloPagina = `Editando Cliente ${this.clienteForm.get('nome')?.value}`
    }
    
    if (this.modoEdicao() === false && this.modoVisualizacao() === true) {
      this.tituloPagina =  `Visualizando Cliente ${this.clienteForm.get('nome')?.value}`
    }
  }

  private carregaCliente(cliente: any) {
    this.clienteForm.patchValue(cliente);
  }

  public salvar() : void{
    if (this.clienteForm.valid) {
      this.overlayHidden = false;
        const {tipoCliente, contribuinte, ...clienteData } = this.clienteForm.value;
        this.clienteService.adicionar(clienteData)
        .then((cliente: any)=>{
          this.poNotificationService.success({message: `Cliente ${cliente.nome} adicionado com sucesso.`})
          console.log(cliente);
          
          this.router.navigate(['app','clientes', cliente.id, 'edicao']);
          this.overlayHidden = true;
        })
        .catch((reponse: any) => {
          this.overlayHidden = true;
          const erros = reponse?.error?.errors as [];
          erros.forEach((e:any) => {
            this.poNotificationService.error({message: e.message})
          })
        })
    
    } else {
      this.poNotificationService.warning({message: 'Formulário inválido'});
    }
    
  }

  public carregaAcoes() : void {
    const salvar: PoPageAction = { icon: 'po-icon po-icon-upload', label: 'Salvar', action: this.salvar.bind(this), disabled: this.isClientFormValid.bind(this) };
    if (this.modoEdicao() || this.novoCliente()) {
      this.acoes.push(salvar)
    }
  }

  private configuraForm() : FormGroup {
    return this.formBuilder.group({
      id: [],
      nome: [, Validators.required],
      fantasia: ['', ],
      tipoPessoa: [ , Validators.required],
      documento: [ '', Validators.required],
      tipoCliente: [ , ],
      inscricaoEstadual: [],
      contribuinte: [],
      tabelaPreco: [],
      email: [ , Validators.compose([Validators.required, Validators.email])],
      telefone: [ , Validators.required],
      endereco: this.formBuilder.group({
        cep: [ , Validators.compose([Validators.required])],
        logradouro: [ , Validators.required],
        numero: [],
        complemento: [],
        bairro: [ , Validators.required],
        cidade: [ , Validators.required],
        estado: [ , Validators.required]
      }),
    })
  }

  public carregaTipoPessoa() : PoSelectOption[] {
    return [
      { label: 'Física', value: 'FISICA' },
      { label: 'Jurídica', value: 'JURIDICA' }
    ]
  }

  public carregaTipoCliente() : PoSelectOption[] {
    return [
      { value: 'F', label: 'Cons. Final' },
      { value: 'L', label: 'Produtor Rural' },
      { value: 'R', label: 'Revendedor' },
      { value: 'S', label: 'Solidário' },
      { value: 'X', label: 'Exportação' },
    ];
  }
   
  private isClientFormValid() : boolean {
    return !this.clienteForm.valid;
  }
}
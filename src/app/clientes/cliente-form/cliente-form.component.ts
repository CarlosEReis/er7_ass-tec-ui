import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
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

    this.formContato = this.formContatoBuilder();
    this.carregarColunasContatos()
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
    this.clienteService.buscar(codigo)
      .then((cliente: any) => this.carregaCliente(cliente))
      .catch();
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
    cliente.contatos.forEach((contato: any, index: any) => {
      let form = this.formContatoBuilder();
      form.patchValue(contato);
      form.get('index')?.setValue(index);
      this.contatos.push(form);
      this.tituloPaginaEditandoOuVisualizando();
    })
  }

  public salvar() : void{
    if (this.clienteForm.valid) {
      this.overlayHidden = false;
       
        this.clienteService.adicionar(this.clienteForm.value)
        .then((cliente: any)=>{
          this.poNotificationService.success({message: `Cliente ${cliente.nome} adicionado com sucesso.`})
          this.router.navigate(['app','clientes']);
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
      contatos: this.formBuilder.array([])
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
   


  // ################ CONTATOS ################
  @ViewChild(PoModalComponent, { static: true }) modalContato!: PoModalComponent;
  tituloModalContato!: string;
  formContato!: FormGroup;
  colunasContatos!: PoTableColumn[];

  get contatos() : FormArray{
    return this.clienteForm.controls['contatos'] as FormArray;
  }

  private isEditandoContato(): boolean {
    return this.formContato.get('index')?.value != null;
  }

  public adicionarContato() : PoModalAction{
    return {
      label: 'Adicionar',
      action: () => {

        if (this.isEditandoContato()) {
          console.log('EDITAR');
          const indexContato = this.formContato.get('index')?.value;
          let f = this.formContatoBuilder();
          f.patchValue(this.formContato.value);
          this.contatos.at(indexContato).patchValue(f.value);
          
        } else {
          console.log('ADICIONAR');
          this.contatos.push(this.formBuilder.group(this.formContato.value));
        }

        console.log(this.formContato.value);
        this.modalContato.close();
      }
    }
  }

  fecharModalContato() : PoModalAction {
    return {
      label: 'Fechar',
      action: () => this.modalContato.close()
    }
  }

  public novoContato() {
    this.tituloModalContato = 'Novo Contato';
    this.formContato = this.formContatoBuilder();
    this.modalContato.open();
  }

  private formContatoBuilder() : FormGroup {
    return this.formBuilder.group({
      index: [],
      id:[],
      nome: [],
      email: [],
      telefone: [],
      departamento: [],
      acoes: ['editar']
    })
  }

  private carregarColunasContatos() : void {
    this.colunasContatos = [
      { label: 'Nome', property: 'nome' },
      { label: 'E-mail', property: 'email' },
      { label: 'Telefone', property: 'telefone' },
      { label: 'Departamento', property: 'departamento' },
      { label: 'Ações', property: 'acoes', type: 'icon', icons: 
        [
          { 
            action: (rowIndex: any) => { this.editarContato(rowIndex) },
            icon: 'po-icon-export' ,
            tooltip: 'Editar' ,
            value: 'editar' 
          }
        ]
      }
    ]
  }

  editarContato(value: any) {
    this.tituloModalContato = `Editando contato`;
    this.formContatoBuilder();
    this.formContato.patchValue(value);
    this.modalContato.open();
  }

  private isClientFormValid() : boolean {
    return !this.clienteForm.valid;
  }
}
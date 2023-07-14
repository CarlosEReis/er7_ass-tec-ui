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
  
  acoes!: PoPageAction[];
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
    }

    this.acoes = this.carregaAcoes();
    this.clienteForm = this.configuraForm();
    this.tipoPessoa = this.carregaTipoPessoa();
    this.tipoCliente = this.carregaTipoCliente();
  }

  private buscarCliente(codigo: number) : void {
    this.clienteService.buscar(codigo)
      .then((cliente: any) => this.carregaCliente(cliente))
      .catch();
  }

  private carregaCliente(cliente: any) {
    this.clienteForm.patchValue(cliente);
  }

  public salvar() : void{
    this.clienteService.adicionar(this.clienteForm.value)
    .then((cliente: any)=>{
      this.poNotificationService.success({message: `Cliente ${cliente.nome} adicionado com sucesso.`})
      this.router.navigate(['clientes']);
    })
    .catch((erro: any) => {
      this.poNotificationService.error({message: `Não foi possível cadastrar o clientes`})
    })
  }

  public carregaAcoes() : PoPageAction[] {
    return [
      { icon: 'po-icon po-icon-upload', label: 'Salvar', action: this.salvar.bind(this) }
    ]
  }

  private configuraForm() : FormGroup {
    return this.formBuilder.group({
      id: [],
      nome: [ , Validators.required],
      fantasia: [],
      tipoPessoa: [ , Validators.required],
      documento: [ , Validators.required],
      tipoCliente: [ , Validators.required],
      inscricaoEstadual: [],
      contribuinte: [],
      tabelaPreco: [],
      email: [ , Validators.required],
      telefone: [ , Validators.required],
      endereco: this.formBuilder.group({
        cep: [ , Validators.required],
        logradouro: [ , Validators.required],
        numero: [],
        complemento: [],
        bairro: [ , Validators.required],
        cidade: [ , Validators.required],
        estado: [ , Validators.required]
      })
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
    
}
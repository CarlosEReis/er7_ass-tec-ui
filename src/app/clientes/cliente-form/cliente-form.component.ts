import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoNotificationService, PoPageAction, PoSelectOption } from '@po-ui/ng-components';
import { ClientesService } from '../clientes.service';

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
    private formBuilder: FormBuilder, 
    private clientesSevice: ClientesService, 
    private poNotificationService: PoNotificationService) {}

  ngOnInit(): void {
    this.acoes = this.carregaAcoes();
    this.clienteForm = this.configuraForm();
    this.tipoPessoa = this.carregaTipoPessoa();
    this.tipoCliente = this.carregaTipoCliente();
    
  }

  public salvar() : void{

    console.log(this.clienteForm.value);
    

    this.clientesSevice.adicionar(this.clienteForm.value)
    .then((cliente: any)=>{
      this.poNotificationService.success({message: `Cliente ${cliente.nome} adicionado com sucesso.`})
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

  public configuraForm() : FormGroup {
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


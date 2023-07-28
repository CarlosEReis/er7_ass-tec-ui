import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PoComboOption, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { ChamadosService } from '../chamados.service';
import { ClientesService } from 'src/app/clientes/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chamado-form',
  templateUrl: './chamado-form.component.html',
  styleUrls: ['./chamado-form.component.css']
})
export class ChamadoFormComponent implements OnInit{
  
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('formOcorrencia', { static: true }) form!: FormGroup;

  formChamado!: FormGroup;
  formOcorrencia!: FormGroup;
  filterParams = {};
  acoesPagina!: PoPageAction[];
  comboClienteValue!: any;
  colunasOcorrencias!: PoTableColumn[];

  filterClientes: any[] = [];
  opcoesClientes: PoComboOption[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private chamadoService: ChamadosService,
    private clienteService: ClientesService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.carregaAcoes();
    this.carregaColunasOcorrencias();
    this.configuraFormChamado();  
    this.configuraFormOcorrencia();
  }

  public carregaAcoes() : void {
    this.acoesPagina = [
      { label: 'Salvar', action: this.salvarChamado.bind(this) }
    ];
  }

  public pesquisarCliente(input: string) : void {
    
    if (input.length > 3) {      
      this.clienteService.pesquisar(input)
        .then( (clientes: any) => {         
          this.filterClientes = clientes; 
          this.opcoesClientes = clientes.map(
            (cliente: any) => ({'label': cliente.nome, 'value': cliente.id}) );
        })
        .catch((erro) => { 
          this.poNotificationService.error('Não foi possível carregar os cliente. Verifica com o administrador')
          console.error(erro);
        })
    }
  }

  onChangeCliente(event: any) {
    const cliente = this.filterClientes.find( c => c.id === event);
    this.formChamado.get('cliente')?.get('documento')?.setValue(cliente.documento);
    this.formChamado.get('cliente')?.get('endereco')?.patchValue(cliente.endereco);
  }

  public salvarChamado() {
    const chamado = this.formChamado.value;
    console.log(chamado);
    this.chamadoService.criar(chamado)
    .then(chamado => {
      this.poNotificationService.success(
        {message: `Chamado de código ${chamado.id} criado com sucesso.`}
      )
      this.router.navigate(['/chamados']);
    })
    .catch(erro => {
      this.poNotificationService.error(
        { message: '❌: Não foi possível salvar o chamado técnico. Contato o Admistrador do sistema.' }
      )
    });
  }

  public carregaColunasOcorrencias() : PoTableColumn[] {
    return this.colunasOcorrencias = [
      { property: 'sku', label: 'Código', width: '8%' },
      { property: 'serial', label: 'Número de Série', width: '10%' },
      { label: 'Status', property: 'status', type: 'label', labels: [
        { value: 'OPERATIVO', label: 'Operativo', color: 'color-02', textColor: '#FFF'  },
        { value: 'INOPERANTE', label: 'Inoperante', color: 'color-10', textColor: '#FFF' },
        { value: 'AVALIANDO', label: 'Avaliando', color: 'color-08', textColor: '#FFF' },
        { value: 'PENDENTE', label: 'Pendente', color: 'color-08', textColor: '#FFF' }
      ]},
      { label: 'Ocorrência', property: 'descricao', type: 'columnTemplate' }
    ]
  }

  private configuraFormChamado() : void{
    this.formChamado = this.formBuilder.group({
      id: [],
      dataCriacao: [new Date() ,],
      status: [],
      cliente: this.formBuilder.group({
        id: [],
        nome: [],
        documento: [],
        endereco: this.formBuilder.group({
          cep: [],
          logradouro: [],
          numero: [],
          complemento: [],
          bairro: [],
          cidade: [],
          estado: []
        })
      }),
      itens: this.formBuilder.array([])
    })
  }

  get itens() {
    return this.formChamado.controls['itens'] as FormArray;
  }

  private configuraFormOcorrencia() : void {
    this.formOcorrencia = this.formBuilder.group({
      id: [],
      status: ['PENDENTE',],
      sku: ['',],
      descProd: [,],
      serial: ['',],
      descricao: [,]
    })
  }

  public fechar() : PoModalAction {
    return {
      action: () => {
        this.poModal.close();
      },
      label: 'Close',
      danger: true
    }; 
  }

  public adicionarOcorrencia() : PoModalAction {
    return {
      action: () => {
        this.itens.push(this.formBuilder.group(this.formOcorrencia.value));
        this.configuraFormOcorrencia();
        this.poModal.close();
      },
      label: 'Confirm'
    };
  }

}




  // carregaChamado(id: number) {
  //   this.chamadoService.buscarPorId(id)
  //     .then((chamado) => {
  //       console.log(chamado)
  //       this.formChamado.patchValue(chamado);        
  //     })
  //     .catch((erro) => {
  //       this.poNotificationService.error(`Não foi possível carregar o chamado de id: ${id}`)
  //     })
  // }
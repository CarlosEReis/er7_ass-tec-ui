import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PoComboOption,
  PoModalAction, 
  PoModalComponent, 
  PoNotificationService, 
  PoPageAction, 
  PoStepperComponent, 
  PoStepperItem, 
  PoStepperStatus, 
  PoTableColumn } from '@po-ui/ng-components';
import { ChamadosService } from '../chamados.service';
import { ClientesService } from 'src/app/clientes/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chamado-form',
  templateUrl: './chamado-form.component.html',
  styleUrls: ['./chamado-form.component.css']
})
export class ChamadoFormComponent implements OnInit{

  @ViewChild(PoStepperComponent) poStepperComponent!: PoStepperComponent;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('formOcorrencia', { static: true }) form!: FormGroup;
 

  tituloPagina = '';
  tituloModalOcorrencia = '';

  formChamado!: FormGroup;
  formOcorrencia!: FormGroup;
  
  acoesPagina!: PoPageAction[];
  comboClienteValue!: any;
  colunasOcorrencias!: PoTableColumn[];

  filterClientes: any[] = [];
  opcoesClientes: PoComboOption[] = [];

  status: Array<PoStepperItem> = [
    { label: 'Na Fila' },
    { label: 'Processando'},
    { label: 'Finalizado' }
  ] 

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private chamadoService: ChamadosService,
    private clienteService: ClientesService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit(): void {
    const chamadoId = this.activatedRoute.snapshot.params['id'];
    
    if (chamadoId) {
      this.buscarChamado(chamadoId);
    }

    this.tituloPagina = 'Novo chamado técncico';
    this.carregaAcoes();
    this.carregaColunasOcorrencias();
    this.configuraFormChamado();  
    this.configuraFormOcorrencia();

    setTimeout(() => {
      this.setarStatus(this.formChamado.get('status')?.value);
    }, 5);
  }

  setarStatus(status: string)  {
    let steps: PoStepperItem[] = this.poStepperComponent.steps;
    
    if (status === 'FILA') {
      steps[0].status = PoStepperStatus.Active;
      steps[1].status = PoStepperStatus.Disabled;
      steps[2].status = PoStepperStatus.Disabled
    }

    if (status === 'PROCESSANDO') {
      steps[0].status = PoStepperStatus.Done;
      steps[1].status = PoStepperStatus.Active;
      steps[2].status = PoStepperStatus.Disabled
    }

    if (status === 'FINALIZADO') {
      steps[0].status = PoStepperStatus.Done;
      steps[1].status = PoStepperStatus.Done;
      steps[2].status = PoStepperStatus.Done;
    }

  }

  private buscarChamado(codigo: number) : void {
    this.chamadoService.buscarPorId(codigo)
      .then( chamado => this.carregarChamado(chamado))
      .catch(erro => {
        this.poNotificationService.error({
          message: `Não foi possível carregar o chamado de id ${codigo}.`
        })
        console.log(erro);
      })
  }

  private carregarChamado(chamado: any) : void {
    this.tituloPagina = `Chamado ${chamado.id} - ${chamado.cliente.nome}`;
    this.formChamado.patchValue(chamado);
    chamado.itens.forEach((item: any, index: any) => {
      let form = this.formBuilder.group({
        index:[index],
        id: [],
        status: ['PENDENTE',],
        sku: ['',],
        descProd: [,],
        serial: ['',],
        descricao: [,],
        acoes: ['editar']
      })      
      form.patchValue(item);
      this.itens.push(form);
      

      
    });  
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
    if (this.isEditandoChamado()) {
      this.atualizaChamado(chamado);
    } else {
      this.criaChamado(chamado);
    }
  }
  
  private atualizaChamado(chamado: any) {
    this.chamadoService.atualiza(chamado)
    .then(chamado => {
      this.poNotificationService.success(
        {message: `Chamado de código ${chamado.id} atualizado com sucesso.`}
      )
      this.router.navigate(['/chamados']);
    })
    .catch(erro => {
      this.poNotificationService.error(
        { message: 'Não foi possível salvar o chamado técnico. Contato o Admistrador do sistema.' }
      )
    });
  }

  private criaChamado(chamado: any) {
    this.chamadoService.criar(chamado)
    .then(chamado => {
      this.poNotificationService.success(
        {message: `Chamado de código ${chamado.id} criado com sucesso.`}
      )
      this.router.navigate(['/chamados']);
    })
    .catch(erro => {
      this.poNotificationService.error(
        { message: 'Não foi possível salvar o chamado técnico. Contato o Admistrador do sistema.' }
      )
    });
  }


  public carregaColunasOcorrencias() : PoTableColumn[] {
    return this.colunasOcorrencias = [
      { property: 'sku', label: 'Código', width: '8%' },
      { property: 'serial', label: 'Número de Série', width: '10%' },
      { label: 'Status', property: 'status', type: 'label', labels: [

        { value: 'AVALIADO', label: 'Avaliado', color: 'color-10', textColor: '#FFF' },
        { value: 'AVALIANDO', label: 'Avaliando', color: 'color-01', textColor: '#FFF' },
        { value: 'PENDENTE', label: 'Pendente', color: 'color-08', textColor: '#FFF' }
      ]},
      { label: 'Ocorrência', property: 'descricao', type: 'columnTemplate' },
      { label: 'Ações', property: 'acoes', type: 'icon', icons: [
          { 
            action: (rowIndex: any) => { this.editarOcorrencia(rowIndex) } ,
            icon: 'po-icon-export' ,
            tooltip: 'Editar' ,
            value: 'editar' 
          }
        ]
      }
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
    this.formOcorrencia = this.ocorrenciaFormBuilder();
  }

  adicionarOcorrencia() {
    this.tituloModalOcorrencia = 'Nova Ocorrência.'
    this.configuraFormOcorrencia();
    this.poModal.open();
  }

  editarOcorrencia(value: any) {
    console.log('value', value);
    this.formOcorrencia.patchValue(value);

    this.tituloModalOcorrencia = `Editando ocorrência ${value.index + 1}`
    if (this.isEditandoOcorrencia()) {
      console.log('EDITANDO OCORRENCIA');
      
    }
    this.poModal.open();
    
  }

  public isEditandoChamado(): boolean {
    return this.formChamado.get('id')?.value != null;
  }

  private isEditandoOcorrencia() : boolean {
    return this.formOcorrencia.get('index')?.value != null;
  }

  public fechar() : PoModalAction {
    return {
      action: () => {
        this.poModal.close();
      },
      label: 'Fechar',
      danger: true
    }; 
  }

  public salvarOcorrencia() : PoModalAction {
    return {
      action: () => {
        if (!this.isEditandoOcorrencia()) {

          this.formOcorrencia.get('index')?.setValue(this.itens.length);
          this.itens.push(this.formBuilder.group(this.formOcorrencia.value));

        } else {
        
          const indexOcorrencia = this.formOcorrencia.get('index')?.value;
          let f = this.ocorrenciaFormBuilder();
          f.patchValue(this.formOcorrencia.value);      
          this.itens.at(indexOcorrencia).patchValue(f.value);
          
        }
        
        this.configuraFormOcorrencia();
        this.poModal.close();
      },
      label: 'Adicionar'
    };
  }

  private ocorrenciaFormBuilder() : FormGroup{
    return this.formBuilder.group({
      index:[],
      id: [],
      status: ['PENDENTE',],
      sku: ['',],
      descProd: [,],
      serial: ['',],
      descricao: [,],
      acoes: ['editar']
    })
  }

  pegarOcorrencia(id: number) {
    console.log(this.formChamado.get('itens')?.value);
  }

}
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

interface AlteraStatus {
  status: string;
  posicaoTecnica: string;
}

@Component({
  selector: 'app-chamado-form',
  templateUrl: './chamado-form.component.html',
  styleUrls: ['./chamado-form.component.css']
})
export class ChamadoFormComponent implements OnInit{

  @ViewChild(PoStepperComponent) poStepperComponent!: PoStepperComponent;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('formOcorrencia', { static: true }) form!: FormGroup;
 
  overlayHidden = true;

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

    this.carregarColunasContatos();

    setTimeout(() => {
      this.setarStatus(this.formChamado.get('status')?.value);
    }, 5);
  }

  public modoEdicao() : boolean {
    const chamadoId = this.activatedRoute.snapshot.params['id'];
    const modoEdicao = this.activatedRoute.snapshot.data['modoEdicao'];
    if (chamadoId && modoEdicao) {
      return true;
    }
    return false;
  }

  public modoVisualizacao() : boolean {
    return this.activatedRoute.snapshot.data['modoEdicao'] === false;
  }

  public novoChamado() : boolean {
    return this.activatedRoute.snapshot.data['novoChamado'] ? true : false;
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

  private geraFichaChamado() {
    this.overlayHidden = false;
    if (this.isEditandoChamado()) { 
      const chamadoId = this.formChamado.get('id')?.value;
      this.chamadoService.fichaChamadoTecnico(chamadoId)
      .then(ficha => {
        const url = window.URL.createObjectURL(ficha);
        window.open(url);
        this.overlayHidden = true;
      });
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
    this.configuraFormChamado();
    this.configuraFormOcorrencia();
    
    this.tituloPagina = `Chamado ${chamado.id} - ${chamado.cliente.nome}`;
    this.formChamado.patchValue(chamado);
    this.formChamado.get('dataCriacao')?.setValue(this.formataData(chamado.dataCriacao));
    chamado.itens.forEach((item: any, index: any) => {
      let form = this.formBuilder.group({
        index:[index],
        id: [],
        ultimoStatus: ['PENDENTE',],
        sku: ['',],
        descProd: [,],
        serial: ['',],
        descricao: [,],
        posicaoTecnica: [,],
        acoes: [ this.modoEdicao() ? 'editar' : 'visulizar' ]
      })      
      form.patchValue(item);
      this.itens.push(form);      
    });  
  }

  private formataData(data: string) {
    return new Date(data).toLocaleString('pt-BR');
  }

  public carregaAcoes() : void {
    this.acoesPagina = [];
    if (this.novoChamado()) {
      this.acoesPagina.push(
        { label: 'Salvar', action: this.salvarChamado.bind(this) }
      )
    }

    if (this.modoEdicao() ) {
      this.acoesPagina.push(
        { label: 'Salvar', action: this.salvarChamado.bind(this) }, 
        { label: 'Ficha', action: this.geraFichaChamado.bind(this) });
    }
    
    if (this.modoVisualizacao()) {
      this.acoesPagina.push(
        { label: 'Ficha', action: this.geraFichaChamado.bind(this) })
    }
    
  }

  public pesquisarCliente(input: string) : void {
    
    if (input.length > 3) {      
      this.clienteService.pesquisar(input)
        .then( (clientes: any) => {       
          this.filterClientes = clientes['content'];          
          this.opcoesClientes = clientes['content'].map(
            (cliente: any) => ({'label': cliente.nome, 'value': cliente.id}) );
        })
        .catch((erro) => { 
          this.poNotificationService.error('Não foi possível carregar os cliente. Verifica com o administrador')
          console.error(erro);
        })
    }
  }

  onChangeCliente(event: any) {

    if (event) {      
      this.overlayHidden = false;
      setTimeout(() => {
  
        this.clienteService.buscar(event)
        .then(
          cliente => {
            this.formChamado.get('cliente')?.patchValue(cliente);
            this.overlayHidden = true;
            this.modalContatos.open();
          }
        ).catch((erro) => { 
          this.overlayHidden = true;
          this.poNotificationService.error('Não foi possível carregar os cliente. Verifica com o administrador');
        })
  
      }, 1000);
    }

    /*const cliente = this.filterClientes.find( c => c.id === event);   

    console.log('CONTATOS',cliente.contatos);
    console.log(this.formChamado.value);*/    
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
      this.router.navigate(['app', 'chamados']);
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
      this.router.navigate(['app','chamados']);
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
      { property: 'ultimoStatus', label: 'Status', type: 'label', labels: [
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
          },
          { 
            action: (rowIndex: any) => { this.editarOcorrencia(rowIndex) } ,
            icon: 'po-icon po-icon-eye' ,
            tooltip: 'Visualizar' ,
            value: 'visulizar' 
          }
        ]
      }
    ]
  }

  private configuraFormChamado() : void{
    this.formChamado = this.formBuilder.group({
      id: [],
      dataCriacao: [,],
      status: [],
      cliente: this.formBuilder.group({
        id: [],
        nome: [],
        documento: [],
        tipoPessoa: ['FISICA'],
        endereco: this.formBuilder.group({
          cep: [],
          logradouro: [],
          numero: [],
          complemento: [],
          bairro: [],
          cidade: [],
          estado: [],
        }),
        contatos: [],
      }),
      contatos: [[],],
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
    this.poModal.primaryAction = this.btnModalItemPrimary();
    this.poModal.open();
  }

  editarOcorrencia(value: any) {
    this.formOcorrencia.patchValue(value);
    this.tituloModalOcorrencia = `Editando ocorrência ${value.index + 1}`
    this.poModal.primaryAction = this.btnModalItemPrimary();
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

  public btnModalItemPrimary() : PoModalAction {    
    if (!this.isEditandoChamado()) {
      return {
        action: () => {
          if (!this.isEditandoOcorrencia()) {
  
            this.formOcorrencia.get('index')?.setValue(this.itens.length);
            this.formOcorrencia.patchValue({ ultimoStatus: 'PENDENTE' });
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

    if (this.formOcorrencia.get('ultimoStatus')?.value === 'PENDENTE') {
      return {
        label: 'Avaliar',
        action: () => this.alterarStatusItemChamado({ status: 'AVALIANDO', posicaoTecnica: ''})
      }
    }

    if (this.formOcorrencia.get('ultimoStatus')?.value === 'AVALIANDO') {
      return {
        label: 'Concluir',
        action: () => this.alterarStatusItemChamado({ status: 'AVALIADO', posicaoTecnica: this.formOcorrencia.get('posicaoTecnica')?.value})
      }   
    } else {
      return {label: '', action: () => null};
    }
  }

  private alterarStatusItemChamado(alteraStatus: AlteraStatus) {
    this.overlayHidden = false;
    this.chamadoService.iniciaAvaliacao(this.formChamado.get('id')?.value, this.formOcorrencia.get('id')?.value, alteraStatus)
    .then(chamado => {
      this.carregarChamado(chamado);
      this.setarStatus(chamado.status);
      this.overlayHidden = true;
    })
    .catch(response => {       
      this.poNotificationService.warning({
        message: response.error.detail
      })
      this.overlayHidden = true;
    })
    this.poModal.close();
  }



  private ocorrenciaFormBuilder() : FormGroup{
    return this.formBuilder.group({
      index:[],
      id: [],
      ultimoStatus: [],
      sku: ['',],
      descProd: [,],
      serial: ['',],
      descricao: [,],
      posicaoTecnica: [,],
      acoes: ['editar']
    })
  }

  // ################ CONTATOS ################
  @ViewChild("modalContatos", { static: true }) modalContatos!: PoModalComponent;

  colunasContatos!: PoTableColumn[];
  contatos: any[] = [];

  private carregarColunasContatos() : void {
    this.colunasContatos = [
      { label: 'Nome', property: 'nome' },
      { label: 'E-mail', property: 'email' },
      { label: 'Telefone', property: 'telefone' },
      { label: 'Departamento', property: 'departamento' },
    ]
  }

  public selecionaContato(event: any) {
    const { $selected, ...contato } = event;
    this.contatos.push(contato);
  }

  public deselecionaContato(event: any) {
    this.contatos = this.contatos.filter(
      contato => contato.id !== event.id);
  }

  public vinculaContatoAoChamado() : PoModalAction {
    return {
      label: 'Vincular',
      action: () => {
        this.formChamado.get('contatos')?.setValue(this.contatos);
        this.poNotificationService.information({
          message: `Contatos vinculado ao chamado.`
        });
        this.modalContatos.close();
      }
    }
    
  }

  vicularContato() {
    //const contatos = this.formChamado.get('cliente')?.value;
    this.modalContatos.open();
  }
}

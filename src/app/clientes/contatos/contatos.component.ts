import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ContatosService } from '../contatos.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {

  @ViewChild(PoModalComponent, { static: true }) modalContato!: PoModalComponent;
  
  @Input() clienteId!: number;

  contatos: any[] = [];
  tituloModalContato!: string;
  formContato!: FormGroup;
  colunasContatos!: PoTableColumn[];

  constructor(
    private formBuilder: FormBuilder,
    private contatosService: ContatosService,
    private poNotificationService: PoNotificationService
  ) {}

  ngOnInit(): void { 
    this.formContato = this.formContatoBuilder();
    if (this.clienteId != undefined) {
      this.buscarContatos();
    }
    this.carregarColunasContatos();
  }

  public novoContato() {
    this.tituloModalContato = 'Novo Contato';
    this.formContato = this.formContatoBuilder();
    this.modalContato.open();
  }

  public editarContato(value: any) {
    this.tituloModalContato = `Editando contato`;
    this.formContatoBuilder();
    this.formContato.patchValue(value);
    this.modalContato.open();
  }
  
  public salvarContato() : PoModalAction{
    const editando = this.isEditandoContato()
    const contato = this.formContato.value
    // Remove as propriedades 'id', 'index', 'acoes' antes de enviar para o serviço
    const { id, index, acoes, ...contatoData } = contato;
    return {
      label: editando ? 'Atualizar' : 'Adicionar',
      action: () => {
        if (editando) {
          this.atualizaContato(this.clienteId, contato.id, contatoData);
        } else {
          console.log('ADICIONAR');
          this.criarContato(this.clienteId, contatoData);
        }
        this.modalContato.close();
      }
    }
  }

  public fecharModalContato() : PoModalAction {
    return {
      label: 'Fechar',
      action: () => this.modalContato.close()
    }
  }

  private buscarContatos() {
    this.contatosService.buscarContatos(this.clienteId)
      .then((contatos: any) => {
        this.contatos = 
        contatos.map((contato: any) => (
          {...contato, acoes: ['editar']}
        ));
      })
      .catch((error: any) => {
        this.poNotificationService.error({message: 'Erro ao buscar contatos.'});
      });
  }

  private atualizaContato(clienteId: number, contatoId: number, contato: any) {
    this.contatosService.atualizarContato(clienteId, contatoId, contato)
      .then((contato: any) => {
      this.poNotificationService.success({message: `Contato ${contato.nome} atualizado com sucesso.`});
    }).catch((error: any) => {
      console.error(error);      
      this.poNotificationService.error({message: 'Erro ao atualizar contato.'});
    }).finally(() => {
      this.buscarContatos();
    });
  }

  private criarContato(clienteId: number, contato: any) {
    this.contatosService.adicionarContato(clienteId, contato)
      .then((contato: any) => {
      this.poNotificationService.success({message: `Contato ${contato.nome} adicionado com sucesso.`});
    }).catch((error: any) => {
      console.error(error);      
      this.poNotificationService.error({message: 'Erro ao adicionar contato.'});
    }).finally(() => {
      this.buscarContatos();
    });
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

  private isEditandoContato(): boolean {
    return this.formContato.get('id')?.value != null;
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
}

import { Component, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { Observable, map, tap } from 'rxjs';
import { UsuariosService } from '../usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../model/Usuario';

@Component({
  selector: 'app-usuasios-pesquisa',
  templateUrl: './usuasios-pesquisa.component.html',
  styleUrls: ['./usuasios-pesquisa.component.css']
})
export class UsuasiosPesquisaComponent {

  public acoesPagina: PoPageAction[] = [];
  public carregandoUsuarios = true;
  public colunas: PoTableColumn[] = [];
  public permissoes$: Observable<any>;
  public permissoes: any[] = [];
  permissao = undefined ?? 'cnpj';
  public usuarioForm: FormGroup;
  public usuario$: Observable<any>;

  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private poNotificationService: PoNotificationService) {   
      
    this.usuarioForm = this.usuarioFormBuilder();
    this.acoesPagina = this.acoesPaginaConfig();
    this.colunas = this.colunasConfig();
    this.permissoes$ = this.usuariosService.listarPermissoes().pipe(
      map( (permisssoes: any) => {
        return permisssoes.map((permissao:any) => ({ label: permissao.nome, value: permissao.id })  )}
      )
    )
    this.usuario$ = this.carregarUsuarios()
  };

  private carregarUsuarios() {
    this.carregandoUsuarios = true;
    return this.usuariosService.listar()
    .pipe(
      tap( (v) => this.carregandoUsuarios = false )
    );
  }

  private acoesPaginaConfig() : PoPageAction[] {
    return [
      { label: 'Novo', action: this.usuarioFormModalOpen.bind(this) }
    ]
  }

  private usuarioFormModalOpen() : void {
    this.poModal.open();
  }

  protected usuarioFormModalSalvar() : PoModalAction {
    return {
      disabled: this.usuarioForm.invalid,
      label: 'Salvar',
      action: () => {
        this.salvarUsuario(this.usuarioForm.value);
        this.usuarioForm.reset();
        this.poModal.close();
      }
    }
  }

  private salvarUsuario(usuario: Usuario) {
    this.usuariosService.salvar(usuario)
    .subscribe({
      complete: () => {
        this.poNotificationService.success('Usuário adicionado com sucesso.');
        this.usuarioForm = this.usuarioFormBuilder();
        this.usuario$ = this.carregarUsuarios();
      },
      error: () => this.poNotificationService.error('Não foi possível adicionar o usuário.')
    })
  }

  protected usuarioFormModalFechar() : PoModalAction { 
    return {
      danger: true,
      label: 'Fechar',
      action: () => this.poModal.close()
    }
  }

  private colunasConfig() : PoTableColumn[] {
    return [
      { label: 'Código', property: 'id' },
      { label: 'Nome', property: 'nome' },
      { label: 'E-mail', property: 'email' },
      { label: 'Permissão', property: 'permissoes', type: 'columnTemplate',  },
    ]
  }

  private usuarioFormBuilder() : FormGroup {
    return this.usuarioForm = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmSenha: ['', Validators.required],
      permissoes: [[], Validators.required]
    })
  }

  public selectionaPermissao(permissao: any) : void {
    this.usuarioForm.get('permissoes')?.patchValue([{id: permissao}])
  }

}

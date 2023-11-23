export interface Usuario {
    id: number;
    nome: string;
    email: string;
    permissoes: any[];
}

export interface UsuarioForm extends Usuario {
    confirmSenha: string;
}
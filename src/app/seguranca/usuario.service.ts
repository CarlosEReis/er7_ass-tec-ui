import { Injectable } from '@angular/core';

import jwtDecode from 'jwt-decode';

import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarioSubject = new BehaviorSubject<Usuario>({});

  constructor(private tokenService: TokenService) {
    if (this.tokenService.possuiToken()) {
      this.decodificaToken();
    }
  }

  public retornaUsuario() {
    return this.usuarioSubject.asObservable();
  }

  public estaLogado() : boolean {
    return this.tokenService.possuiToken() && this.tokenService.isTokenValido();
  }

  public logout() : void {
    this.tokenService.removeToken();
    this.usuarioSubject.next({});
  }

  public retornaUsuarioObj() {
    const token = this.tokenService.retornaToken();  
    return jwtDecode(token) as Usuario;
  }

  public decodificaToken() {
    const token = this.tokenService.retornaToken();    
    const usuario = jwtDecode(token) as Usuario;    
    this.usuarioSubject.next(usuario);
  }

  public salvaToken(token: string) {
    this.tokenService.salvaToken(token);
    this.decodificaToken();
  }

  public possuiPermissao(role: string) {
    const usuario = this.retornaUsuarioObj();
    return usuario.roles?.includes(role);
  }

  public possuiQualquerPermissao(rolesRoute: string[]) {
    for (const roleRoute of rolesRoute) {
      if( this.possuiPermissao(roleRoute) ) return true;
    }
    return false;
  }
}

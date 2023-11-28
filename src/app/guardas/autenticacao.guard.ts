import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../seguranca/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.usuarioService.estaLogado()) {

        this.podeAcessarRota(route.data['roles']);

        return true;
      }

    this.router.navigate(['auth', 'login']);
    return false;
  }

  podeAcessarRota(rolesRoute: string[]) {
    if (rolesRoute && !this.usuarioService.possuiQualquerPermissao(rolesRoute)) {
      this.router.navigate(['nao-autorizado'])
      return false;
    }
    return true;
  }
  
}

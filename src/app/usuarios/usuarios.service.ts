import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, interval, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Usuario } from './model/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly usuariosURL = environment.apiUrl.concat('/usuarios')

  constructor(private http: HttpClient) { }

  public listar() : Observable<any[]> {
    return this.http.get<any[]>(`${this.usuariosURL}`).pipe(first());
  }

  public salvar(usuario: Usuario) : Observable<any>{
    return this.http.post<any>(`${this.usuariosURL}`, usuario ).pipe(first());
  }

  public listarPermissoes() : Observable<any[]> {
    return this.http.get<any[]>(`${this.usuariosURL}/permissoes`).pipe(first())
  }
}

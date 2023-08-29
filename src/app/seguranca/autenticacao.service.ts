import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private readonly URL_API = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  public logar(email: string, senha: String) : Observable<any>{
    const headers = new HttpHeaders().append('Content-type', 'Application/json')
    return this.http
      .post(`${this.URL_API}/auth/login`, { username: email, password: senha }, { headers })
      .pipe(
        tap((e:any) => {
          this.usuarioService.salvaToken(e.token);
        })      
      )
  }
}

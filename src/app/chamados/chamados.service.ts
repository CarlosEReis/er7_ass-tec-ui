import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChamadosService {

  private chamadosURL = environment.apiUrl.concat('/chamados')

  constructor(private http: HttpClient) { }

  public pesquisar(nome: string) : Promise<any> {
    if (nome) {
      const params = new HttpParams().append('nome', nome);
      return firstValueFrom(this.http.get(this.chamadosURL, { params }))
    }
    return firstValueFrom(this.http.get(this.chamadosURL));
  }
}

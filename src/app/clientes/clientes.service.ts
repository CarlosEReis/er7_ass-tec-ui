import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private clientesURL = environment.apiUrl.concat('/clientes')

  constructor(private http: HttpClient) { }

  public adicionar(cliente: any) : Promise<any> {
    const headers = new HttpHeaders().append('Content-type', 'Application/Json')
    return firstValueFrom(this.http.post(this.clientesURL, cliente, { headers }));
  }

  public pesquisar(nome: string) : Promise<any>{
    if (nome) {
      const params = new HttpParams().append('nome', nome);
      return firstValueFrom(this.http.get(this.clientesURL, { params }))
    }
    return firstValueFrom(this.http.get(`${this.clientesURL}`));
  }

  public buscar(codigo: number): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.clientesURL}/${codigo}`)
    );
  }
}

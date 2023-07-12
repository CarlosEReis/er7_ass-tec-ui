import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}

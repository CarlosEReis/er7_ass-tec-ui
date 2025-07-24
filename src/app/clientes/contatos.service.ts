import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContatosService {

  private contatosURL = environment.apiUrl.concat('/clientes')

  constructor(private http: HttpClient) { }

  public buscarContatos(clienteId: number): Promise<any> {
    return firstValueFrom(
      this.http.get(`${this.contatosURL}/${clienteId}/contatos`)
    );
  }

  public atualizarContato(clienteId: number, contatoId: number, contato: any): Promise<any> {
    return firstValueFrom(
      this.http.put(`${this.contatosURL}/${clienteId}/contatos/${contatoId}`, contato)
    );
  }

  public adicionarContato(clienteId: number, contato: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.contatosURL}/${clienteId}/contatos`, contato)
    );
  }
}

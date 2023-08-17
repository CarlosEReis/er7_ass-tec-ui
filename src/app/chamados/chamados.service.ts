import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  public buscarPorId(id: number) : Promise<any> {
    return firstValueFrom(this.http.get(`${this.chamadosURL}/${id}`));
  }

  public criar(chamado: any) : Promise<any> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json');
    return firstValueFrom(this.http.post(this.chamadosURL, chamado,{ headers }));
  }

  public atualiza(chamado: any) : Promise<any> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json');
    return firstValueFrom(this.http.put(`${this.chamadosURL}/${chamado.id}`, chamado, { headers }))
  }

  public fichaChamadoTecnico(idChamado: number) : Promise<Blob> {
    return firstValueFrom(this.http.get(`${this.chamadosURL}/${idChamado}/ficha`, { responseType: 'blob' }));
  }
}

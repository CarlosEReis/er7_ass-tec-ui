import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map, take } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PageChamadoResumo } from './model/PageChamadoResumo';

@Injectable({
  providedIn: 'root'
})
export class ChamadosService {

  private chamadosURL = environment.apiUrl.concat('/chamados')
  private produtosURL = environment.apiUrl.concat('/produtos')

  constructor(private http: HttpClient) { }

  public pesquisar(nome: string, paginacao = { size: 5, page: 0 }) : Observable<PageChamadoResumo> {

    let params = new HttpParams()
      .append('size',paginacao.size)
      .append('page', paginacao.page)
      .append('sort', 'id,desc')

    if (nome) {
      params = params.append('nome', nome);
      return this.http.get<PageChamadoResumo>(this.chamadosURL, { params });
    }
    return this.http.get<PageChamadoResumo>(this.chamadosURL, { params });
  }

  public buscarPorId(id: number) : Promise<any> {
    return firstValueFrom(this.http.get(`${this.chamadosURL}/${id}`));
  }

  public criar(chamado: any) : Promise<any> {   
    let itens = chamado.itens.map((i:any) => (
      {
        produto: { id: i.id },
        serial: i.serial,
        descricao: i.descricao,
        posicaoTecnica: i.posicaoTecnica
      }
    ));

    let contatos = chamado.contatos.map((c:any) => ({id: c.id}))

    let chamadoInput = {
      cliente: { id: chamado.cliente.id},
      itens: itens,
      contatos: contatos
    }  

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json');
    return firstValueFrom(this.http.post(this.chamadosURL, chamadoInput,{ headers }));
  }

  public atualiza(chamado: any) : Promise<any> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json');
    return firstValueFrom(this.http.put(`${this.chamadosURL}/${chamado.id}`, chamado, { headers }))
  }

  public fichaChamadoTecnico(idChamado: number) : Promise<Blob> {
    return firstValueFrom(this.http.get(`${this.chamadosURL}/${idChamado}/ficha`, { responseType: 'blob' }));
  }

  public iniciaAvaliacao(idChamado: number, idItemChamado: number, status: { status: string, posicaoTecnica: string } ) : Promise<any> {
    const headers = new HttpHeaders()
    .append('Content-Type', 'text/plain');
    return firstValueFrom(this.http.post(`${this.chamadosURL}/${idChamado}/alteracao-status-item/${idItemChamado}`, status, {headers}));
  }

  public pesquisarSKU(sku : string) : Observable<any>{
    return this.http.get(`${this.produtosURL}?search=${sku}`)
      .pipe(
        take(1),
        map(
          (response: any ) => response['content']));
  }
}

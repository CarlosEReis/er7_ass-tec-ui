import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private readonly produtosURL = environment.apiUrl.concat('/produtos')

  constructor(private http: HttpClient) { }

  public pesquisar(search = '', paginacao = { size: 5, page: 0 }) : Observable<any>{
    const params = new HttpParams()
    .append('size', paginacao.size)
    .append('page', paginacao.page)

    // TODO: Pesquisar sobre o operador RXJS shareReplay
    return this.http.get(`${this.produtosURL}?search=${search}`, { params }).pipe(first(), shareReplay(1))
  }

  public criar(produto: any) : Observable<any> {
    return this.http.post(this.produtosURL, produto );
  }

  public buscar(produtoId: any) : Observable<any> {
    return this.http.get(`${this.produtosURL}/${produtoId}`);
  }

  public atualizar(id: number, produto: any) : Observable<any> {
    return this.http.put(`${this.produtosURL}/${id}`, produto);
  }
}

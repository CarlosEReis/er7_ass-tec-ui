import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export class FilterDash {
  top!: number;
  dataInicial!: Date;
  dataFinal!: Date;
  filtrarPor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public ano = new Date().getFullYear();

  private readonly chamadosURL = environment.apiUrl.concat('/estatisticas')

  constructor(private http: HttpClient) { }

  public kpisPrincipais(filter: FilterDash, tipoFiltro: string) : Observable<any[]>{
    const params = new HttpParams()
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("tipoFiltro", tipoFiltro);
    return this.http.get<any[]>(`${this.chamadosURL}/kpis-principal`, {params});
  }

  public kpisPrincipaisNEW(filter: FilterDash, tipoFiltro: string) : Observable<any[]>{
    const params = new HttpParams()
    .append("dataBase", filter.dataInicial.toISOString().split('T')[0])
    .append("dataConfronto", filter.dataFinal.toISOString().split('T')[0])
    .append("tipoFiltro", tipoFiltro);

    console.log('headers', params)
    return this.http.get<any[]>(`${this.chamadosURL}/kpis-principal-impl`, {params});
  }

  public qtdeItensAvaliados(filter: FilterDash) : Observable<any[]> {
    const params = new HttpParams()
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0]);
    return this.http.get<any[]>(`${this.chamadosURL}/itens-avaliados`, {params});
  }

  public top4ProdutoDefeito(filter: FilterDash, tipoFiltro: string ) : Observable<any[]> {
    const params = new HttpParams()
    .append("top", 4)
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("tipoFiltro", tipoFiltro);
    return this.http.get<any[]>(`${this.chamadosURL}/produtos/top-mais-defeitos`, {params});
  }

  public topClientesComMaisChamados(filter: FilterDash, tipoFiltro: string) : Observable<any[]> {
    const params = new HttpParams()
    .append("top", 3)
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("tipoFiltro", tipoFiltro);
    return this.http.get<any[]>(`${this.chamadosURL}/clientes/top-mais-chamados`, {params});
  }

  public topTecnicosComMaisChamados(filter: FilterDash, tipoFiltro: string) : Observable<any[]> {
    const params = new HttpParams()
    .append("top", 3)
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("tipoFiltro", tipoFiltro);
    return this.http.get<any[]>(`${this.chamadosURL}/tecnicos/top-mais-chamados`, {params});
  }

  public statusChamadosPorDia(filter: FilterDash) : Observable<any[]> {
    return this.http.get<any[]>(`${this.chamadosURL}/status-chamado-pordia`);
  }

  public statusAbertosFechadosMes(filter: FilterDash): Observable<any[]> {
    const params = new HttpParams()
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("filtrarPor", filter.filtrarPor ? filter.filtrarPor: "");
    return this.http.get<any[]>(`${this.chamadosURL}/chamados-abertos-fechados`, {params});
  }

  public statusAbertosFechadosDia(filter: FilterDash): Observable<any[]> {
    const params = new HttpParams()
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("filtrarPor", "DIA");
    return this.http.get<any[]>(`${this.chamadosURL}/chamados-abertos-fechados`, {params});
  }

  public statusAbertosFechados(filter: FilterDash, tipoFiltro: string): Observable<any[]> {
    const params = new HttpParams()
    .append("dataInicial", filter.dataInicial.toISOString().split('T')[0])
    .append("dataFinal", filter.dataFinal.toISOString().split('T')[0])
    .append("filtrarPor", tipoFiltro);
    return this.http.get<any[]>(`${this.chamadosURL}/chamados-abertos-fechados`, {params});
  }

  private addHeadersParamAno(ano: number) {
    return new HttpParams().append('ano', ano)
  }
}

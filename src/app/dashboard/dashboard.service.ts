import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly chamadosURL = environment.apiUrl.concat('/chamados/estatisticas')

  constructor(private http: HttpClient) { }

  public kpisPrincipais() : Observable<any[]>{
    return this.http.get<any[]>(`${this.chamadosURL}/kpis-principal`);
  }

  public top4ProdutoDefeito() : Observable<any[]> {
    return this.http.get<any[]>(`${this.chamadosURL}/top4-produtos`);
  }

  public top3ClientesComMaisChamados() : Observable<any[]> {
    return this.http.get<any[]>(`${this.chamadosURL}/top3-clientes`);
  }

  public top3TecnicosComMaisChamados() : Observable<any[]> {
    return this.http.get<any[]>(`${this.chamadosURL}/top3-tecnicos`);
  }

  public statusChamadosPorDia() : Observable<any[]> {
    return this.http.get<any[]>(`${this.chamadosURL}/status-chamado-pordia`);
  }
}

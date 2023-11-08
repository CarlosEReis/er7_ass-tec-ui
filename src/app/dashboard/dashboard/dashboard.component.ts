import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PoChartOptions, PoChartSerie, PoChartType } from '@po-ui/ng-components';
import { DashboardService } from '../dashboard.service';


export interface DadosChamadosPorDia {
  status: string;
  quantidade: number;
  data: Date
}

export interface DadosChamadosPorMes {
  status: string;
  quantidade: number;
  mes: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit{

  public abertos: number = 0;
  public processando: number = 0;
  public finalizados: number = 0;
  public qtdeItensAvaliado: number = 0;

  public top4ProdutosCategories: string[] = [];
  public top4ProdutosSeries: PoChartSerie[] = [];
  public top4ProdutosOptionsColumn: PoChartOptions = {legend: false,axis: {gridLines: 3, minRange: 0}};

  public top3ClientesSeries: PoChartSerie[] = []; 
  public top3ClientesOptionsColumn: PoChartOptions = {}

  public top3TecnicosCategories: string[] = [];
  public top3tecnicosSeries: PoChartSerie[] = [];
  public top3TecnicosOptionsColumn: PoChartOptions = {legend: false,axis: {gridLines: 3, minRange: 0}};

  public abertosXfechadosPorMesSerie: PoChartSerie[] = []
  public abertosXfechadosPorMesOptionColumn: PoChartOptions = {legend: false, axis: {gridLines: 3, minRange: 0}}
  public fechados: number[] = [];

  public statusChamadoPorDiaCategories: string[] = [];
  public statusChamadoPorDiaSeries: PoChartSerie[] = [];
  public statusChamadoPorDiaSeriesOptionsColumn: PoChartOptions = {legend: false, axis: {gridLines: 3, minRange: 0}};

  public statusChamadoPorMesCategories: string[] = [];;
  public statusChamadoPorMesSeries: PoChartSerie[] = [];
  public statusChamadoPorMesSeriesOptionsColumn = {legend: false, axis: {gridLines: 3, minRange: 0}}


  constructor(
    private elRef: ElementRef,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.configuraKPIsPrincipal();
    this.configuraTOP4produtos();
    this.configuraTOP3Clientes();
    this.configuraTOP3Tecnicos();
    this.configuraStatusDiario();
    this.configuraStatusMensal();
  }

  private configuraKPIsPrincipal() : void {
    this.dashboardService.kpisPrincipais()
    .subscribe(
      (kpis: any[]) => {
        kpis.forEach(kpi => {
          switch (kpi.status) {
            case 'FILA': this.abertos = kpi.quantidade
              break;
            case 'PROCESSANDO': this.processando = kpi.quantidade
              break;
            case 'FINALIZADO': this.finalizados = kpi.quantidade
              break;
            default:
              break;
          }
        });
      }
    );
    this.dashboardService.qtdeItensAvaliados()
    .subscribe((dado: any) => this.qtdeItensAvaliado = dado.quantidade)
  }

  private configuraTOP4produtos() : void {
    this.dashboardService.top4ProdutoDefeito()
    .subscribe((produtos: any) => {
      this.top4ProdutosCategories = produtos.map((prod: any) => prod.sku)
      this.top4ProdutosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Bar,
        data: produtos.map((p:any) => p.quantidade),
        color: '#1F82BF'
      })
    });
  }

  private configuraTOP3Clientes() : void {
    this.dashboardService.top3ClientesComMaisChamados()
    .subscribe((clientes: any[]) => {

      const cores = ['#035AA6', '#439FD9', '#91CDF2']
      let cor = 0;

      this.top3ClientesSeries = clientes.map(
        (c:any) => ({ 
          label: (c.nome as string).split(' ')[0],
          tooltip: c.nome,
          data: c.quantidade,
          type: PoChartType.Donut,
          color: cores[cor++]
        }))
    })
  }
  
  private configuraTOP3Tecnicos() : void {
    this.dashboardService.top3TecnicosComMaisChamados()
    .subscribe((tecnicos: any) => {
      this.top3TecnicosCategories = tecnicos.map((tecnico: any) => (tecnico.tecnico as string).split(' ')[0])
        this.top3tecnicosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Column,
        data: tecnicos.map((p:any) => p.quantidade),
        color: '#439FD9'
      })
    });
  }

  private configuraStatusDiario() : void {
    this.dashboardService.statusChamadosPorDia()
    .subscribe(
      (dadosDiario: DadosChamadosPorDia[]) => {
        this.statusChamadoPorDiaCategories = this.diasUteisDoMesAtual();
        this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.formataDadosDiario(dadosDiario, 'FILA'), type: PoChartType.Area, color: '#1F82BF'  })
        this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.formataDadosDiario(dadosDiario, 'FINALIZADO'), type: PoChartType.Area, color: '#91CDF2' })
        
        //this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#1F82BF'  })
        //this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#91CDF2' })
      }
    )
  }

  private configuraStatusMensal() : void {
    this.dashboardService.statusChamadosPorMes()
    .subscribe(
      (dadosMes: any[]) => {
        this.statusChamadoPorMesCategories = this.meses();
        this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: dadosMes.filter(d => d.status === 'FILA').map(d => d.quantidade), type: PoChartType.Column, color: '#1F82BF' })
        this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: dadosMes.filter(d => d.status === 'FINALIZADO').map(d => d.quantidade), type: PoChartType.Column, color: '#91CDF2' })
 
        //this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: this.geraDados, type: PoChartType.Column, color: '#1F82BF' })
        //this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: this.geraDados, type: PoChartType.Column, color: '#91CDF2' })
      }
    )  
  }

  private formataDadosDiario(x: any[], status: string) : number[] {
    const y = x.filter(x => x.status === status);
    let fechados: number[] = [];
    for (const diaAtual of this.diasUteisDoMesAtual()) {
      fechados.push(0)
      for (const x of y) {
        var diaDado = x.data.split('-')[2];
        if (parseInt(diaAtual) === parseInt(diaDado)) {
          fechados.pop();
          fechados.push(x.quantidade)
          break;
        }  
      } 
    }
    return fechados;
  }

  public ngAfterViewInit() : void {
    const primeiraDivFilha = this.elRef.nativeElement.querySelector('.po-page-header > div > h1');
    primeiraDivFilha.outerHTML += this.addSubtitulo();
  }

  private geraDadosMes() : number[]{
    return this.meses().map((mes, index) => Math.floor(Math.random() * (30 - 15 + 1)) + 15);
  }

  private meses() : string[] {
   return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  }

  private diasUteisDoMesAtual() : string[] {
    const date = new Date();
    const month = date.getMonth();
    const weekdays: string[] = [];

    date.setDate(1);

    while (date.getMonth() === month) {
        const dayOfWeek = date.getDay();
        // Segunda-feira é 1 e sexta-feira é 5
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            weekdays.push(date.getDate().toString());
        }
        date.setDate(date.getDate() + 1);
    }   
    return weekdays;
  }

  private geraChamadosDiarios() : number[] {
    return this.diasUteisDoMesAtual().map(() => Math.floor(Math.random() * (40 - 15 + 1)) + 15);;
  }

  private addSubtitulo() : string {
    return `
    <div class="po-tag-sub-container" style="display: inline-block;vertical-align: super;">
      <div class="po-tag po-color-08" style="max-width: none !important">
        <div class="po-tag-value">
          <span style="color: #fff; font-size:.8rem">
            Os cards sinalizados com o ícone ✅, já estão implementados e os que estão com 🚫 ainda serão implementados
          </div>
      </div>
    </div>
    `
  }
}
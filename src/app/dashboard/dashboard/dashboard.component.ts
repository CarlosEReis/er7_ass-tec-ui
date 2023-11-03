import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PoChartOptions, PoChartSerie, PoChartType } from '@po-ui/ng-components';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit{

  public abertos: number = 0;
  public processando: number = 0;
  public finalizados: number = 0;

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
  public statusChamadoPorDiaSeriesOptionsColumn: PoChartOptions = {axis: {gridLines: 3, minRange: 0}};

  categoriesM: Array<string> = this.meses;
  

  mensal: Array<PoChartSerie> = [
    { label: 'Abertos', data: this.geraDados, type: PoChartType.Column },
    { label: 'Fechados', data: this.geraDados, type: PoChartType.Column }
  ];

  diarioB: Array<PoChartSerie> = []

  optionsColumn: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 25,
      gridLines: 3
    }
  };

  optionsColumnDiario: PoChartOptions = {
    axis: {gridLines: 3}
  };

  constructor(
    private elRef: ElementRef,
    private dashboardService: DashboardService
  ) {
    
  }
  ngOnInit(): void {
    this.configuraKPIsPrincipal();
    this.configuraTOP4produtos();
    this.configuraTOP3Clientes();
    this.configuraTOP3Tecnicos();
    this.configuraStatusDiario();

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
  }

  private configuraTOP4produtos() {
    this.dashboardService.top4ProdutoDefeito()
    .subscribe((produtos: any) => {
      this.top4ProdutosCategories = produtos.map((prod: any) => prod.sku)
      this.top4ProdutosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Bar,
        data: produtos.map((p:any) => p.quantidade)
      })
    });
  }

  private configuraTOP3Clientes() {
    this.dashboardService.top3ClientesComMaisChamados()
    .subscribe((clientes: any[]) => {
      this.top3ClientesSeries = clientes.map(
        (c:any) => ({ 
          label: (c.nome as string).split(' ')[0],
          tooltip: c.nome,
          data: c.quantidade,
          type: PoChartType.Donut }))
    })
  }
  
  private configuraTOP3Tecnicos() {
    this.dashboardService.top3TecnicosComMaisChamados()
    .subscribe((tecnicos: any) => {
      this.top3TecnicosCategories = tecnicos.map((tecnico: any) => (tecnico.tecnico as string).split(' ')[0])
      this.top3tecnicosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Column,
        data: tecnicos.map((p:any) => p.quantidade)
      })
    });
  }

  private configuraStatusDiario() {
    this.dashboardService.statusChamadosPorDia()
    .subscribe(
      (x: any[]) => {
        this.statusChamadoPorDiaCategories = this.diasUteisDoMesAtual();
        this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.conf(x, 'FILA'), type: PoChartType.Area })
        this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.conf(x, 'FINALIZADO'), type: PoChartType.Area })
      }
    )
  }

  conf(x: any[], status: string) {
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

  ngAfterViewInit() {
    const primeiraDivFilha = this.elRef.nativeElement.querySelector('.po-page-header > div > h1');
    primeiraDivFilha.outerHTML += this.novoComponente;
  }

  get geraDados() {
    const dados = this.categoriesM.map((mes, index) => Math.floor(Math.random() * (30 - 15 + 1)) + 15)  
    return dados
  }

  get meses() {
   const mesesAno = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
   const mesAtual = new Date().getMonth();
   return mesesAno.slice(0, mesAtual+1); 
  }

  private diasUteisDoMesAtual(): string[] {
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


  geraChamadosDiarios() {
    return this.diasUteisDoMesAtual().map(() => Math.floor(Math.random() * (40 - 15 + 1)) + 15);;
  }

  get novoComponente() {
    return `
    <div class="po-tag-sub-container" style="display: inline-block;vertical-align: super;">
      <div class="po-tag po-color-08" style="max-width: none !important">
        <div class="po-tag-value">
          <span style="color: #fff; font-size:.8rem">
            As funcionalidade desta página ainda estão em prototipação.</span>
          </div>
      </div>
    </div>
    `
  }
}
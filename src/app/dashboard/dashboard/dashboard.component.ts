import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PoButtonGroupItem, PoChartOptions, PoChartSerie, PoChartType, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { DashboardService } from '../dashboard.service';
import { EventService } from 'src/app/core/event.service';

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

enum EventType {
  CHAMADO_CRIADO = 'CHAMADO_CRIADO',
  CHAMADO_PROCESSANDO = 'CHAMADO_PROCESSANDO',
  CHAMADO_FINALIZADO = 'CHAMADO_FINALIZADO'
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit{

  attendances: Array<PoButtonGroupItem> = [
    { label: '2024', icon: 'po-icon-calendar', action: () => alert('teste') },
    { label: '2023', icon: 'po-icon-injector', action: () => alert('teste') },
    { label: '2022', icon: 'po-icon-exam', action: () => alert('teste') }
  ];

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

  public ano = 2023;
  private filtroData = { dataInicial: new Date(`${this.ano}-01-01`), dataFinal: new Date(`${this.ano}-12-30`) }

  public anos: PoSelectOption[] = [
    { label: '2021', value: 2021},
    { label: '2022', value: 2022},
    { label: '2023', value: 2023},
    {label: '2024', value: 2024}
  ]
  public aoSelecionarAno(ano: number) {
    this.ano = ano;
    this.filtroData = { dataInicial: new Date(`${this.ano}-01-01`), dataFinal: new Date(`${this.ano}-12-30`) }
    this.carregaInfoDashboard(this.ano);
  }

  constructor(
    private elRef: ElementRef,
    private eventService: EventService,
    private dashboardService: DashboardService,
    private poNotificationService: PoNotificationService
  ) { }

  ngOnInit(): void {
    this.dashboardService.statusAbertosFechadosMes({top: 3, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}).subscribe(  );

    this.carregaInfoDashboard(this.ano);

    this.ano = 2024

    this.eventService.events.subscribe((event: MessageEvent) => {
      if (event) {        
  
          if (event.type === EventType.CHAMADO_CRIADO) {
            this.configuraKPIsPrincipal();
            this.configuraTOPprodutos();
            this.configuraTOPClientes();
            this.configuraStatusDiario();
            this.configuraStatusMensal();
          }
  
          if (event.type === EventType.CHAMADO_PROCESSANDO) {
            this.configuraKPIsPrincipal();
          }
  
          if (event.type === EventType.CHAMADO_FINALIZADO) {
            this.configuraKPIsPrincipal();
            this.configuraTOPprodutos();
            this.configuraTOPClientes();
            this.configuraTOPTecnicos();
            this.configuraStatusDiario();
            this.configuraStatusMensal();
          }
      }
    })
  }

  private carregaInfoDashboard(ano: number) {
    //  this.configuraKPIsPrincipal();
    this.configuraTOPprodutos();
    //this.configuraTOPClientes();
    this.configuraTOPTecnicos();
    this.configuraStatusDiario();
    this.configuraStatusMensal();
  }

  private configuraKPIsPrincipal() : void {
    this.dashboardService.kpisPrincipais({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe(
      (kpis: any[]) => {

        this.abertos = 0;
        this.processando  = 0;
        this.finalizados  = 0;

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
    /*this.dashboardService.qtdeItensAvaliados({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe((dado: any) => {
      this.qtdeItensAvaliado  = 0;
      this.qtdeItensAvaliado = dado.quantidade})*/
  }

  private configuraTOPprodutos() : void {
    this.top4ProdutosSeries = [];
    this.dashboardService.top4ProdutoDefeito({top: 2, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe((produtos: any) => {
      this.top4ProdutosSeries = [];
      this.top4ProdutosCategories = produtos.map((prod: any) => prod.sku)
      this.top4ProdutosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Bar,
        data: produtos.map((p:any) => p.quantidade),
        color: '#1F82BF'
      })
    });
  }

  private configuraTOPClientes() : void {
    this.top3ClientesSeries = [];
    this.dashboardService.topClientesComMaisChamados({top: 2, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
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
  
  private configuraTOPTecnicos() : void {
    this.top3tecnicosSeries = [];
    this.dashboardService.topTecnicosComMaisChamados({top: 3, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe((tecnicos: any) => {   
      this.top3tecnicosSeries = []
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
    this.statusChamadoPorDiaSeries = [];

    var diasMes = this.diasUteisDoMesAtual();    
    var abertos: number[] = [];
    var fechados: number[] = [];
    
    this.dashboardService.statusAbertosFechadosDia({top: 0, dataInicial: new Date('2023-12-01'), dataFinal: new Date('2023-12-30')})
    .subscribe(
      (dadosDiario: any[]) => {

        diasMes.forEach(d => {
          dadosDiario.forEach(dd => {
            var dia = (dd.data as unknown as string).split('-')[2];
            if (parseInt(d) === parseInt(dia)) {
              abertos.push(dd.abertos);
              fechados.push(dd.fechados)
            }
          })
        })

        this.statusChamadoPorDiaCategories = diasMes;
        this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: abertos, type: PoChartType.Area, color: '#035AA6'  })
        this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: fechados, type: PoChartType.Area, color: '#91CDF2' })
        
        //this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#1F82BF'  })
        //this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#91CDF2' })
      }
    )
  }

  private configuraStatusMensal() : void {
    this.statusChamadoPorMesSeries = [];
    this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe(
      (dadosMes: any[]) => {
        this.statusChamadoPorMesCategories = this.meses();
        this.statusChamadoPorMesSeries = [];
        this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#035AA6E0' })
        this.statusChamadoPorMesSeries.push({ label: 'fechados', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#439FD9' })

        var dadosAbertos = this.statusChamadoPorMesSeries[0].data as number[]; 
        var dadosFechados = this.statusChamadoPorMesSeries[1].data as number[];       

        dadosMes.forEach(x => {
          var mes =new Date(x.data).getMonth();          
          dadosAbertos[mes] = x.abertos;
          dadosFechados[mes] = x.fechados;
        })
        //this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: this.geraDadosMes(), type: PoChartType.Column, color: '#035AA6E0' })
        //this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: this.geraDadosMes(), type: PoChartType.Column, color: '#91CDF2' })
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
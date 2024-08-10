import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { PoButtonGroupItem, PoChartOptions, PoChartSerie, PoChartType, PoNotificationService, PoPageAction, PoSelectOption } from '@po-ui/ng-components';
import { DashboardService } from '../dashboard.service';
import { EventService } from 'src/app/core/event.service';
import { map } from 'rxjs';

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

  public acoes!: PoPageAction[];

  public abertos: number = 0;
  public abertosPercent: number = 0;
 
  
  public processando: number = 0;
  public processandoPercent: number = 0;

  public finalizados: number = 0;
  public finalizadosPercent: number = 0;

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

  public ano = 2024;
  public tipoFiltro = "ANO";

  private filtroData = { dataInicial: new Date(), dataFinal: new Date(`${(this.ano-1)}-01-01`) }

  public anos: PoSelectOption[] = [
    { label: '2021', value: 2021},
    { label: '2022', value: 2022},
    { label: '2023', value: 2023},
    {label: '2024', value: 2024}
  ]
  public aoSelecionarAno(ano: number) {
    this.ano = ano;
    this.tipoFiltro = "ANO";
    this.filtroData = { dataInicial: new Date(`${this.ano}, ${this.filtroData.dataInicial.getMonth()+1},1`), dataFinal: new Date(`${(this.ano-1)}-01-01`) }
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

    this.filtraPeloAnoAtual();

    this.ano = 2024;
    this.tipoFiltro = "ANO";

    this.acoes = [
      { label: 'YTD', action: () => this.filtraPeloAnoAtual() },
      { label: 'ALL', action: () => this.filtraPorTodosAnos() },
    ]

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


  private filtraPeloAnoAtual() {
    let now = new Date();
    this.filtroData.dataInicial = new Date(this.ano-1, 0, 1)
    this.filtroData.dataFinal = now;
    
    console.log('data inicial:', this.filtroData.dataInicial.toLocaleDateString());
    console.log('data final:',this.filtroData.dataFinal.toLocaleDateString());
    console.log(`Filtrar ano atual (selecionado: ${this.ano}) comparado com ano anterior`);

    this.dashboardService.kpisPrincipaisNEW({top: 0, dataInicial:this.filtroData.dataFinal, dataFinal: this.filtroData.dataInicial}, this.tipoFiltro)
    .subscribe(
      (kpis: any) => {

        this.abertos = 0;
        this.processando  = 0;
        this.finalizados  = 0;

        console.log('KPIS',kpis);
        console.log('data >>>>>>>>>>>',this.filtroData);
        
        kpis['kpis'].forEach((kpi: any) => {
          
          switch (kpi.status) {
            case 'FILA': 
              this.abertos = kpi.anoBase
              this.abertosPercent = kpi.percent
            
              break;
            case 'PROCESSANDO': {
              this.processando = kpi.anoBase
              this.processandoPercent = kpi.percent
            }
              break;
            case 'FINALIZADO': {
              this.finalizados = kpi.anoBase
              this.finalizadosPercent = kpi.percent
            }
              break;
            default:
              break;
          }
        });
      }
    );

    this.configuraStatusMensalx('YTD');
    this.configuraTOPprodutos();
    this.configuraTOPClientes();
    this.configuraTOPTecnicos();

    this.tipoFiltro = 'MES'
    this.configuraStatusDiario();
  }

  private filtraPorTodosAnos() {
    let now = new Date();
    this.filtroData.dataInicial = new Date(2021, 0, 1);
    this.filtroData.dataFinal = now;
    console.log('data inicial:', this.filtroData.dataInicial.toLocaleDateString());
    console.log('data final:',this.filtroData.dataFinal.toLocaleDateString());
    console.log('Filtra todos os ano');
    this.dashboardService.statusAbertosFechados({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, this.tipoFiltro)
    .subscribe(
      (kpis: any) => {

        this.abertos = 0;
        this.processando  = 0;
        this.finalizados  = 0;

        console.log('KPIS',kpis);
        console.log('data >>>>>>>>>>>',this.filtroData);
        

        kpis['kpis'].forEach((kpi: any) => {
          
          switch (kpi.status) {
            case 'FILA': 
              this.abertos = kpis.kpis.filter((p:any) => p.status === 'FILA').map((r:any) => r.qtde ).reduce((a:any, b:any) => a + b);
              //this.abertosPercent = kpi.percent
              break;
            case 'PROCESSANDO': {
              this.processando = kpis.kpis.filter((p:any) => p.status === 'PROCESSANDO').map((r:any) => r.qtde ).reduce((a:any, b:any) => a + b);
              //this.processandoPercent = kpi.percent
            }
              break;
            case 'FINALIZADO': {
              this.finalizados = kpis.kpis.filter((p:any) => p.status === 'FINALIZADO').map((r:any) => r.qtde ).reduce((a:any, b:any) => a + b);
              //this.finalizadosPercent = kpi.percent
            }
              break;
            default:
              break;
          }
        });
      }
    );

    this.configuraStatusMensalx('ANO');
    this.configuraTOPprodutos();
    this.configuraTOPClientes();
    this.configuraTOPTecnicos();

    this.tipoFiltro = 'ANO'
    this.configuraStatusDiario();

    this.abertosPercent = 0;
    this.processandoPercent = 0;
    this.finalizadosPercent  = 0;
    
    console.log('porcent abertos', this.abertosPercent);
    console.log('porcent processando', this.processandoPercent);
    console.log('porcent finalizado', this.finalizadosPercent);
    
  }

  private carregaInfoDashboard(ano: number) {
    this.configuraKPIsPrincipal();
    this.configuraTOPprodutos();
    //this.configuraTOPClientes();
    //this.configuraTOPTecnicos();
    //this.configuraStatusDiario();
    this.configuraStatusMensal();
  }

  private configuraKPIsPrincipal() : void {
    //this.alteraData();
    //this.alteraTipoFiltro()
    console.log('<<<<<<<<<',this.filtroData);

    if (this.tipoFiltro === 'ANO') {
      
      
    }

    if (this.tipoFiltro === 'YTD') {
      
      
    }

    if (this.tipoFiltro === 'MES') {
      
    }


    
    /*
    this.dashboardService.kpisPrincipaisNEW({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, this.tipoFiltro)
    .subscribe(
      (kpis: any) => {

        this.abertos = 0;
        this.processando  = 0;
        this.finalizados  = 0;

        console.log('KPIS',kpis);
        console.log('data >>>>>>>>>>>',this.filtroData);
        

        kpis['kpis'].forEach((kpi: any) => {
          
          switch (kpi.status) {
            case 'FILA': 
              this.abertos = kpi.anoBase
              this.abertosPercent = kpi.percent
            
              break;
            case 'PROCESSANDO': {
              this.processando = kpi.anoBase
              this.processandoPercent = kpi.percent
            }
              break;
            case 'FINALIZADO': {
              this.finalizados = kpi.anoBase
              this.finalizadosPercent = kpi.percent
            }
              break;
            default:
              break;
          }
        });
      }
    );*/
    
    /*this.dashboardService.qtdeItensAvaliados({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal})
    .subscribe((dado: any) => {
      this.qtdeItensAvaliado  = 0;
      this.qtdeItensAvaliado = dado.quantidade})*/
  }

  private   configuraTOPprodutos() : void {
    /*let now = new Date()
    if (this.tipoFiltro === "ANO") {
      this.filtroData.dataInicial = new Date(2021,1,1);
      this.filtroData.dataFinal = now;
    } else if (this.tipoFiltro === "MES") {      
      this.filtroData.dataInicial = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filtroData.dataFinal = now;
    }*/

    //this.alteraData();

    console.log(`CONSULTANDO TOP PRODUTOS`);
    console.log(`DATA INCIAL:\t ${this.filtroData.dataInicial}`);
    console.log(`DATA FINAL:\t ${this.filtroData.dataFinal}`);    


    this.top4ProdutosSeries = [];
    this.dashboardService.top4ProdutoDefeito({top: 2, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, this.tipoFiltro)
    .subscribe((produtos: any) => {
      this.top4ProdutosSeries = [];
      this.top4ProdutosCategories = produtos.itens.map((prod: any) => prod.sku)
      this.top4ProdutosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Bar,
        data: produtos.itens.map((p:any) => p.quantidade),
        color: '#1F82BF'
      })
    });
  }

  private configuraTOPClientes() : void {
    /*let now = new Date()
    if (this.tipoFiltro === "ANO") {
      this.filtroData.dataInicial = new Date(2021,1,1);
      this.filtroData.dataFinal = now;
    } else if (this.tipoFiltro === "MES") {      
      this.filtroData.dataInicial = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filtroData.dataFinal = now;
    }*/
      //this.alteraData();

      console.log(`CONSULTANDO TOP CLIENTES`);
      console.log(`DATA INCIAL:\t ${this.filtroData.dataInicial}`);
      console.log(`DATA FINAL:\t ${this.filtroData.dataFinal}`);    
  

      
    this.top3ClientesSeries = [];
    this.dashboardService.topClientesComMaisChamados({top: 2, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, this.tipoFiltro)
    .subscribe((clientes: any) => {
      
      const cores = ['#035AA6', '#439FD9', '#91CDF2']
      let cor = 0;

      this.top3ClientesSeries = clientes.itens.map(
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
    /*let now = new Date()
    if (this.tipoFiltro === "ANO") {
      this.filtroData.dataInicial = new Date(2021,1,1);
      this.filtroData.dataFinal = now;
    } else if (this.tipoFiltro === "MES") {      
      this.filtroData.dataInicial = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filtroData.dataFinal = now;
    }*/
    
    //this.alteraData();

    console.log(`CONSULTANDO TOP TÉCNICOS`);
    console.log(`DATA INCIAL:\t ${this.filtroData.dataInicial}`);
    console.log(`DATA FINAL:\t ${this.filtroData.dataFinal}`);  

    this.top3tecnicosSeries = [];
    this.dashboardService.topTecnicosComMaisChamados({top: 3, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, this.tipoFiltro)
    .subscribe((tecnicos: any) => {
      this.top3tecnicosSeries = []
      this.top3TecnicosCategories = tecnicos.itens.map((tecnico: any) => (tecnico.tecnico as string).split(' ')[0])
        this.top3tecnicosSeries.push({
        label: 'Quantidade',
        type: PoChartType.Column,
        data: tecnicos.itens.map((p:any) => p.quantidade),
        color: '#439FD9'
      })
    });
  }

  private configuraStatusDiario() : void {
    this.statusChamadoPorDiaSeries = [];

    var diasMes = this.diasUteisDoMesAtual();   
    var meses = this.meses();
    
    var abertos: number[] = [];
    var fechados: number[] = [];

    //this.alteraData();
    let now = new Date();
    let dFinal = new Date(now.getFullYear(), now.getMonth() + 1, 0)


    if (this.tipoFiltro === "ANO") {
      this.dashboardService.statusAbertosFechados({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal}, "MES")
      .subscribe(
        (dados: any) => {          
          for (let i = 1; i <= 12; i++) {
            abertos.push(dados.kpis.filter((x: any) => x.status === 'FILA' && x.data.split('-')[1] == i).map((y: any) => y.qtde).reduce((a: any,b: any) => a+b,0));
            fechados.push(dados.kpis.filter((x: any) => x.status === 'FINALIZADO' && x.data.split('-')[1] == i).map((y: any) => y.qtde).reduce((a: any,b: any) => a+b,0));
          }  
          this.statusChamadoPorDiaCategories = meses;
          this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: abertos, type: PoChartType.Area, color: '#035AA6'  })
          this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: fechados, type: PoChartType.Area, color: '#91CDF2' })        
          //this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#1F82BF'  })
          //this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#91CDF2' })
        }
      )
      
    } else if(this.tipoFiltro === "MES") {

      console.log(`CONSULTANDO CHAMADOS DIARIOS`);
      console.log(`DATA INCIAL:\t ${new Date(this.filtroData.dataInicial.setMonth(7))}`);
      console.log(`DATA FINAL:\t ${this.filtroData.dataFinal}`);  
  
      this.configGraficoChamadosAbertoFechadosPorDia(new Date(this.filtroData.dataInicial.setMonth(7)), dFinal)

      /*this.dashboardService.statusAbertosFechadosDia({top: 0, dataInicial: new Date('2023-12-01'), dataFinal: new Date('2023-12-30'), filtrarPor: 'MES'})
      .subscribe(
        (dadosDiario: any) => {         
          diasMes.forEach(d => {
            dadosDiario.kpis.forEach((dd: any) => {
              var dia = (dd.data as unknown as string).split('-')[2];
              if (parseInt(d) === parseInt(dia) && dd.status === 'FILA') {
                abertos.push(dd.qtde);
              }
              if (parseInt(d) === parseInt(dia) && dd.status === 'FINALIZADO') {
                fechados.push(dd.qtde)
              }
            })
          })
          this.statusChamadoPorDiaCategories = diasMes;
          this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: abertos, type: PoChartType.Area, color: '#035AA6'  })
          this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: fechados, type: PoChartType.Area, color: '#91CDF2' })        
          //this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#1F82BF'  })
          //this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: this.geraChamadosDiarios(), type: PoChartType.Area, color: '#91CDF2' })
        }
      )*/




    }

    /*
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
    )*/
  }

  private configGraficoChamadosAbertoFechadosPorDia(dataInicial: Date, dataFinal: Date) {
    var diasMes = this.diasUteisDoMesAtual();
    var abertos: number[] = new Array(diasMes.length).fill(0);
    var fechados: number[] = new Array(diasMes.length).fill(0);
    
    this.dashboardService.statusAbertosFechadosDia({top: 0, dataInicial: dataInicial, dataFinal: dataFinal, filtrarPor: 'MES'})
    .subscribe(
      (dadosDiario: any) => {    
        diasMes.forEach((d:any, index) => {
          dadosDiario.kpis.forEach((dd: any) => {
            var dia = (dd.data as unknown as string).split('-')[2];            
            if (parseInt(d) === parseInt(dia) && dd.status === 'FILA') {
              abertos[index] = (dd.qtde);
            }
            if (parseInt(d) === parseInt(dia) && dd.status === 'FINALIZADO') {
              fechados[index] = (dd.qtde);
            }
          })
        })

        console.log('ABERTOS DIA:', abertos);
        console.log('FECHADOS DIA:', fechados);
        
        this.statusChamadoPorDiaCategories = diasMes;
        this.statusChamadoPorDiaSeries.push({ label: 'Abertos', data: abertos, type: PoChartType.Area, color: '#035AA6'  });
        this.statusChamadoPorDiaSeries.push({ label: 'Fechados', data: fechados, type: PoChartType.Area, color: '#91CDF2' });
      }
    )
  }

  private configuraStatusMensal() : void {
    console.log('MENSAL');
    
    this.statusChamadoPorMesSeries = [];
    if (this.tipoFiltro === "ANO") {
      //this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal, filtrarPor: this.tipoFiltro})
      this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: new Date(2021,0,1), dataFinal: new Date(2024,11,30), filtrarPor: this.tipoFiltro})
      .subscribe(
        (dadosMes: any) => {
            this.statusChamadoPorMesCategories = ['2021', '2022', '2023', '2024'];
            this.statusChamadoPorMesSeries = [];

            this.statusChamadoPorMesSeries.push({ 
              label: 'Abertos', 
              data: dadosMes.kpis.filter((p: any) => p.status === 'FILA').map((p:any) => p.qtde), 
              type: PoChartType.Column, 
              color: '#035AA6E0' })

            this.statusChamadoPorMesSeries.push({ 
              label: 'fechados', 
              data: dadosMes.kpis.filter((p: any) => p.status === 'FINALIZADO').map((p:any) => p.qtde), 
              type: PoChartType.Column, 
              color: '#439FD9' }) 
        }
      )
    }

    if (this.tipoFiltro === 'MES') {

      let dataFila = [0,0,0,0,0,0,0,0,0,0,0,0];
      let dataFinal = [0,0,0,0,0,0,0,0,0,0,0,0];
      console.log('EU PRECISO CORRIGIT AQUI');
      
      console.log('dataFila 01', dataFila);
      
      //dadosMes.kpis.filter((p: any) => p.status === 'FILA' && p.data.split('-')[0] === '2024').map((p:any) => p.qtde)
      //dadosMes.kpis.filter((p: any) => p.status === 'FINALIZADO' && p.data.split('-')[0] === '2024').map((p:any) => p.qtde)

      let now = new Date();
      this.filtroData.dataInicial = new Date(now.getFullYear(), 0, 1)
      this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal, filtrarPor: this.tipoFiltro})
      .subscribe(
        (dadosMes: any) => {
          this.statusChamadoPorMesCategories = this.meses();
          this.statusChamadoPorMesSeries = [];

          dadosMes.kpis.forEach((d:any) => {
            if (d.status === 'FILA') {
              const mes = d.data.split('-')[1];
              dataFila[mes-1] = (dataFila[mes-1] += d.qtde);
            }
            if (d.status === 'FINALIZADO') {
              const mes = d.data.split('-')[1];
              dataFinal[mes-1] = (dataFinal[mes-1] += d.qtde);
            }
          })



          /*for (let index = 0; index < 12; index++) {
            let mesGrafico = index +1;
            console.log('index', mesGrafico);
            dadosMes.kpis.filter((p: any) => p.status === 'FILA').forEach(
              ((d: any) => {
                console.log('teste', d.data.split('-')[1]);
                let mes = d.data.split('-')[1]
                if (mesGrafico == mes) {
                  let x = dataFila.at(index);
                  dataFila[index] = (x += d.qtde);
                  console.log('dataFila 02', dataFila);
                }
              })
            );
          }*/


          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: dataFila, type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: dataFinal, type: PoChartType.Column, color: '#439FD9' }) 

          
        }
      )
    }

    /*this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: new Date(2021,0,1), dataFinal: new Date(2023,11,30)})
    .subscribe(
      (dadosMes: any) => {
        if (this.tipoFiltro === "ANO") {
          this.statusChamadoPorMesCategories = ['2021', '2022', '2023'];
          this.statusChamadoPorMesSeries = [];
          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: dadosMes.kpis.filter((p: any) => p.status === 'FILA').map((p:any) => p.qtde), type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: dadosMes.kpis.filter((p: any) => p.status === 'FINALIZADO').map((p:any) => p.qtde), type: PoChartType.Column, color: '#439FD9' }) 
        }

        if (this.tipoFiltro === 'MES') {
          console.log('CONFIGURAR DE ACORDO ---- MES ')
          this.statusChamadoPorMesCategories = this.meses();
          this.statusChamadoPorMesSeries = [];
          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#439FD9' }) 

          var teste = dadosMes.kpis.filter((p: any) => p.status === 'FILA' ).map((p:any) => p.qtde);
          console.log(teste);
          
        }*/

/*
        this.statusChamadoPorMesCategories = this.meses();
        this.statusChamadoPorMesSeries = [];
        this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#035AA6E0' })
        this.statusChamadoPorMesSeries.push({ label: 'fechados', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#439FD9' })

        var dadosAbertos = this.statusChamadoPorMesSeries[0].data as number[]; 
        var dadosFechados = this.statusChamadoPorMesSeries[1].data as number[];     
*/        
        

        /*dadosMes.forEach(x => {
          var mes =new Date(x.data).getMonth();          
          dadosAbertos[mes] = x.abertos;
          dadosFechados[mes] = x.fechados;
        })*/

        //this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: this.geraDadosMes(), type: PoChartType.Column, color: '#035AA6E0' })
        //this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: this.geraDadosMes(), type: PoChartType.Column, color: '#91CDF2' })
     // }
    //)
  }

  private configuraStatusMensalx(tipoFiltro: string) : void {
    console.log('MENSAL x');
    console.log('parametro', tipoFiltro)
    
    this.statusChamadoPorMesSeries = [];
    if (tipoFiltro === "ANO") {

      let dadosMesFila = [];
      let dadosMesFinalizado = [];

      this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: new Date(2021,0,1), dataFinal: new Date(2024,11,30), filtrarPor: tipoFiltro})
      .subscribe(
        (dadosMes: any) => {
            this.statusChamadoPorMesCategories = ['2021', '2022', '2023', '2024'];
            this.statusChamadoPorMesSeries = [];

            dadosMesFila = dadosMes.kpis.filter((p: any) => p.status === 'FILA').map((p:any) => p.qtde);
            dadosMesFinalizado = dadosMes.kpis.filter((p: any) => p.status === 'FINALIZADO').map((p:any) => p.qtde)

            this.statusChamadoPorMesSeries.push({ 
              label: 'Abertos', 
              data: dadosMesFila, 
              type: PoChartType.Column, 
              color: '#035AA6E0' })

            this.statusChamadoPorMesSeries.push({ 
              label: 'fechados', 
              data: dadosMesFinalizado, 
              type: PoChartType.Column, 
              color: '#439FD9' }) 
        }
      )
    }

    if (tipoFiltro === 'YTD') {
      console.log('DEU MATCH tipo filtro com YTD')
      let dataFila = [0,0,0,0,0,0,0,0,0,0,0,0];
      let dataFinal = [0,0,0,0,0,0,0,0,0,0,0,0];

      let now = new Date();
      this.filtroData.dataInicial = new Date(now.getFullYear(), 0, 1)

      this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal, filtrarPor: 'MES'})
      .subscribe(
        (dadosMes: any) => {
          this.statusChamadoPorMesCategories = this.meses();
          this.statusChamadoPorMesSeries = [];

          dadosMes.kpis.forEach((d:any) => {
            if (d.status === 'FILA') {
              const mes = d.data.split('-')[1];
              dataFila[mes-1] = (dataFila[mes-1] += d.qtde);
            }
            if (d.status === 'FINALIZADO') {
              const mes = d.data.split('-')[1];
              dataFinal[mes-1] = (dataFinal[mes-1] += d.qtde);
            }
          })

          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: dataFila, type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: dataFinal, type: PoChartType.Column, color: '#439FD9' }) 
          
        }
      )
    }

    if (tipoFiltro === 'MES') {
      var diasMes = this.diasUteisDoMesAtual();
      var abertos: number[] = new Array(diasMes.length).fill(0);
      var fechados: number[] = new Array(diasMes.length).fill(0);
    
      this.dashboardService.statusAbertosFechadosDia({top: 0, dataInicial: this.filtroData.dataInicial, dataFinal: this.filtroData.dataFinal, filtrarPor: 'MES'})
      .subscribe(
        (dadosDiario: any) => {    
          diasMes.forEach((d:any, index) => {
            dadosDiario.kpis.forEach((dd: any) => {
              var dia = (dd.data as unknown as string).split('-')[2];            
              if (parseInt(d) === parseInt(dia) && dd.status === 'FILA') {
                abertos[index] = (dd.qtde);
              }
              if (parseInt(d) === parseInt(dia) && dd.status === 'FINALIZADO') {
                fechados[index] = (dd.qtde);
              }
            })
          })
          this.statusChamadoPorMesCategories = diasMes;
          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: abertos, type: PoChartType.Area, color: '#035AA6'  });
          this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: fechados, type: PoChartType.Area, color: '#91CDF2' });
        }
      )
    }

    /*this.dashboardService.statusAbertosFechadosMes({top: 0, dataInicial: new Date(2021,0,1), dataFinal: new Date(2023,11,30)})
    .subscribe(
      (dadosMes: any) => {
        if (this.tipoFiltro === "ANO") {
          this.statusChamadoPorMesCategories = ['2021', '2022', '2023'];
          this.statusChamadoPorMesSeries = [];
          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: dadosMes.kpis.filter((p: any) => p.status === 'FILA').map((p:any) => p.qtde), type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: dadosMes.kpis.filter((p: any) => p.status === 'FINALIZADO').map((p:any) => p.qtde), type: PoChartType.Column, color: '#439FD9' }) 
        }

        if (this.tipoFiltro === 'MES') {
          console.log('CONFIGURAR DE ACORDO ---- MES ')
          this.statusChamadoPorMesCategories = this.meses();
          this.statusChamadoPorMesSeries = [];
          this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#035AA6E0' })
          this.statusChamadoPorMesSeries.push({ label: 'fechados', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#439FD9' }) 

          var teste = dadosMes.kpis.filter((p: any) => p.status === 'FILA' ).map((p:any) => p.qtde);
          console.log(teste);
          
        }*/

/*
        this.statusChamadoPorMesCategories = this.meses();
        this.statusChamadoPorMesSeries = [];
        this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#035AA6E0' })
        this.statusChamadoPorMesSeries.push({ label: 'fechados', data: [0,0,0,0,0,0,0,0,0,0,0,0], type: PoChartType.Column, color: '#439FD9' })

        var dadosAbertos = this.statusChamadoPorMesSeries[0].data as number[]; 
        var dadosFechados = this.statusChamadoPorMesSeries[1].data as number[];     
*/        
        

        /*dadosMes.forEach(x => {
          var mes =new Date(x.data).getMonth();          
          dadosAbertos[mes] = x.abertos;
          dadosFechados[mes] = x.fechados;
        })*/

        //this.statusChamadoPorMesSeries.push({ label: 'Abertos', data: this.geraDadosMes(), type: PoChartType.Column, color: '#035AA6E0' })
        //this.statusChamadoPorMesSeries.push({ label: 'Fechados', data: this.geraDadosMes(), type: PoChartType.Column, color: '#91CDF2' })
     // }
    //)
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
       // if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            weekdays.push(date.getDate().toString());
        //}
        date.setDate(date.getDate() + 1);
    }   
    return weekdays;
  }

  private geraChamadosDiarios() : number[] {
    return this.diasUteisDoMesAtual().map(() => Math.floor(Math.random() * (40 - 15 + 1)) + 15);;
  }

  /*private alteraData() {
    let now = new Date()
    if (this.tipoFiltro === "ANO") {
      console.log('FILTRAR POR TODOS OS ANOS');
      
      this.filtroData.dataInicial = new Date(this.ano,1,1);
      this.filtroData.dataFinal = now;
    } else if (this.tipoFiltro === "MES") {      
      console.log('DADOS DO MES ATUAL');

      this.filtroData.dataInicial = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filtroData.dataFinal = now;
    } else if (this.tipoFiltro === 'YTD') {
      console.log('DADOS ANO ATUAL');

    }
  }*/

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
import { Component } from '@angular/core';
import { ChartOptions,registerables} from 'chart.js';
import Chart from 'chart.js/auto';
import { ChartData } from 'chart.js';
Chart.register(...registerables)
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  chart: any = []
  chart1: any = []
  chart2: any = []
  title = 'ng-chart';

  ngOnInit() {
    this.chart = new Chart('myChart', {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            hoverOffset: 15,
          },
        ],
      },
      options: {   
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    });
    this.chart1 = new Chart('myChart1', {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            hoverOffset: 15,
          },
        ],
      },
      options: {   
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    });
  this.chart2 = new Chart('myChart2', {
      type: 'doughnut',
      data: {
        labels: ['kunal', 'sanket', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            hoverOffset: 15,
          },
        ],
      },
      options: {   
        plugins: {
          legend: {
            display: true,
            position: 'right'
          }
        }
      }
    });
  }
  


  // equityData = [100]; // 100% Equity
  // equityLabels = ['Equity'];
  // equityColor=['blue']  
  
  // // Data for the second chart (Sectors)
  // sectorData = [27.66, 25.76, 14.96, 8.68, 8.41, 5.62, 5.34];
  // sectorLabels = [
  //   'Information Technology',
  //   'Financials',
  //   'Communication Services',
  //   'Materials',
  //   'Utilities',
  //   'Energy',
  //   'Consumer Discretionary',
  // ];
  // sectorColors=['yellow','blue','green','gray','red','orange']
  
  // // Data for the third chart (Stocks)
  // stockData = [67.72, 31.25, 1.03];
  // stockLabels = ['Large cap', 'Mid cap', 'Small cap'];
  // stockColors =['blue','red','orange'];

  // public donutChartData: ChartData<'doughnut'> = {
  //   labels: ['Red', 'Blue', 'Yellow', 'Green'],
  //   datasets: [
  //     {
  //       data: [300, 50, 100, 75],
  //       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  //       hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  //       borderWidth: 1
  //     }
  //   ]
  // };
  // public donutChartOptions: ChartOptions<'doughnut'> = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     tooltip: {
  //       enabled: true
  //     },
  //   },
  //   cutout: '70%' // Creates the donut effect
  // };

  //-------------
  // ngOninit(){
  //   this.renderAccountChart(this.equityData,this.equityLabels,this.equityColor);
  //   this.renderSectorsChart(this.sectorData,this.sectorLabels,this.sectorColors);
  //   this.renderStocksChart(this.stockData,this.stockLabels,this.stockColors);
  // }
  
  // renderAccountChart(labelData: any, valueData:any, colorData:any){
    
  //   const mychart = new Chart('account',{
  //     type: 'doughnut',
  //     data:{
  //       labels: labelData,
  //       datasets:[
  //         {
  //           data: valueData,
  //           backgroundColor: colorData
  //         }
  //       ]
  //     }
  //   })
  // }
  // renderSectorsChart(labelData: any, valueData:any, colorData:any){
    
  //   const mychart = new Chart('sectors',{
  //     type: 'doughnut',
  //     data:{
  //       labels: labelData,
  //       datasets:[
  //         {
  //           data: valueData,
  //           backgroundColor: colorData
  //         }
  //       ]
  //     }
  //   })
  // }
  // renderStocksChart(labelData: any, valueData:any, colorData:any){
    
  //   const mychart = new Chart('stocks',{
  //     type: 'doughnut',
  //     data:{
  //       labels: labelData,
  //       datasets:[
  //         {
  //           data: valueData,
  //           backgroundColor: colorData
  //         }
  //       ]
  //     }
  //   })
  // }

}

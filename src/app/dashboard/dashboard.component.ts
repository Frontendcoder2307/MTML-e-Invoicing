import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts'
import { ThemeService } from "../theme.service";
import { Subscription } from 'rxjs';
import { style } from "@angular/animations";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  waveChart: any
  PieChart:any
  isDark: boolean = true
  message: any = localStorage.getItem('theme');
  messageSubscription: any;

  barChart: any
  RecordList: any = []
  RecordListWithStatus: any = []
  RecordlistCount: any;
  RejectedCount: any;
  SuccessCount: any;
  PendingCount: any;
  waveChartData:any=[]

  allRecordsAPI: any = 'http://41.222.103.118:8889/api/invoices/all'

  
  constructor(private themeObject: ThemeService,private router:Router,private http:HttpClient ){}

  ngOnInit() {
      this.messageSubscription = this.themeObject.getMessage().subscribe(msg => {
        this.message = msg;
        console.log("Message===>>", this.message)
        this.getdailyInvoiceCount(this.message)
        this.getAllRecords(this.message)
      });   
    this.getdailyInvoiceCount(this.message)
    this.getAllRecords(this.message)
  }

  getdailyInvoiceCount(theme:any) {
    this.http.get('http://41.222.103.118:8889/api/invoices/stats/invoice-count-daily').subscribe((data: any) => {
      let response = data
      this.waveChartData = response
      // this.sinewavaBarGraph(theme)
      if (theme == 'light-theme') {
        this.isDark = false
      }
      else {
        this.isDark = true
      }

      this.waveChart = new Chart({
        chart: {
          type: 'spline', // Smooth wave-like lines
          backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
        },
        title: {
          text: 'Daily Invoice Count',
          style: { color: this.isDark ? '#ffffff' : '#000000' },
        },
        xAxis: {
          categories: this.waveChartData.map((entry: any) => entry.date),
          title: {
            text: 'Date',
            style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
          },
          labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        },
        yAxis: {
          title: {
            text: 'Count',
            style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
          },
          labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
          allowDecimals: true
        },
        legend: {
          itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
        },
        series: [
          {
            name: 'Count',
            type: 'spline',
            color: '#00c2ff',
            data: this.waveChartData.map((entry: any) => entry.count)
          }
        ],
        credits: {
          enabled: false
        }
      });
    },
      error => {
      console.log(error)
    })
  }
  
  // getlineGraph(theme:any) {
  //   if (theme == 'light-theme') {
  //     this.isDark = false
  //   }
  //   else {
  //     this.isDark = true
  //   }

  //   console.log("IsDark===>>", this.isDark)


  //   this.waveChart = new Chart({
  //     chart: {
  //       type: 'spline',
  //       backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
  //     },
  //     title: {
  //       text: 'Revenue Overview',
  //       style: { color: this.isDark ? '#ffffff' : '#000000' },
  //     },
  //     xAxis: {
  //       categories: ['Jan', 'Feb', 'Mar'],
  //       labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
  //       title: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
  //     },
  //     yAxis: {
  //       title: {
  //         text: 'Revenue ($)',
  //         style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  //       },
  //       labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
  //     },
  //     legend: {
  //       itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  //     },
  //     series: [
  //       {
  //         name: 'Prepaid',
  //         type: 'spline',
  //         data: [1000, 1200, 1400],
  //         color: '#ff006a',
          
  //       },
  //       {
  //         name: 'Postpaid',
  //         type: 'spline',
  //         data: [800, 950, 1100],
  //         color: '#00c2ff',
  //       },
  //       {
  //         name: 'Goods',
  //         type: 'spline',
  //         data: [600, 700, 750],
  //         color: '#00e676',
  //       },
  //     ],
  //   }
  //   )
  // }
  
  // initBarChart(theme: any) {
  //   if (theme == 'light-theme') {
  //     this.isDark = false
  //   }
  //   else {
  //     this.isDark = true
  //   }
    
  //   this.barChart = new Chart({
  //     chart: {
  //       type: 'bar',
  //       backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
  //     },
  //     title: {
  //       text: 'Revenue Collection',
  //       style: { color: this.isDark ? '#ffffff' : '#000000' },
  //     },
  //     xAxis: {
  //         categories: ['Q1', 'Q2', 'Q3'],
  //         labels: { style: { color: this.isDark ? '#ffffff' : '#000000',fontWeight:'bold' } },
  //         title: { style: { color: this.isDark ? '#ffffff' : '#000000' } },
  //     },
  //     yAxis: {
  //       title: {
  //         text: 'Revenue (Cr.)$s',
  //         style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  //       },
  //       labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },

  //     },
  //     legend: {
  //       itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  //     },
  //     series: [
  //       {
  //         name: 'Prepaid',
  //         type: 'bar',
  //         data: [20, 21, 27],
  //         color: '#ff006a',
  //       },
  //       {
  //         name: 'Postpaid',
  //         type: 'bar',
  //         data: [25, 23, 24],
  //         color: '#00c2ff'
  //       },
  //       {
  //         name: 'Goods',
  //         type: 'bar',
  //         data: [20, 25, 23],
  //         color: '#00e676'
  //       }
  //     ]
  //   });
  // }

  pieGraph(theme: any) {
    if (theme == 'light-theme') {
      this.isDark = false
    }
    else {
      this.isDark = true
    }
  
    this.PieChart = new Chart({
        chart: {
          type: 'pie',
          backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
        },
        title: {
          text: 'Invoice  Share by Status',
          style: { color: this.isDark ? '#ffffff' : '#000000' },
        },
        // tooltip: {
        //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>Revenue: ${point.y:,.0f}'
        // },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            innerSize: '60%',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  
            },
            colors: ['#facc15', '#ff006a', '#00e676'], // Custom colors
            borderColor: this.isDark ? '#000000' : '#ffffff'
          }
        },
        series: [
          {
            name: 'Share',
            type: 'pie',
            data: [
              { name: 'Pending', y: this.PendingCount },
              { name: 'Rejected', y: this.RejectedCount },
              { name: 'Success', y: this.SuccessCount }
            ]
          }
      ], credits: { enabled: false }
      });
    }

  

  // sinewavaBarGraph(theme:any) {
  //   if (theme == 'light-theme') {
  //     this.isDark = false
  //   }
  //   else {
  //     this.isDark = true
  //   }

  //   this.waveChart = new Chart({
  //     chart: {
  //       type: 'spline', // Smooth wave-like lines
  //       backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
  //     },
  //     title: {
  //       text: 'Daily Invoice Count',
  //       style: { color: this.isDark ? '#ffffff' : '#000000' },
  //     },
  //     xAxis: {
  //       categories: this.waveChartData.map((entry:any) => entry.date),
  //       title: {
  //         text: 'Date',
  //          style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
  //       },
  //       labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
  //     },
  //     yAxis: {
  //       title: {
  //         text: 'Count',
  //         style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
  //       },
  //       labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
  //       allowDecimals: true
  //     },
  //     legend: {
  //           itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
  //           },
  //     series: [
  //       {
  //         name: 'Count',
  //         type: 'spline',
  //         color: '#00c2ff',
  //         data: this.waveChartData.map((entry: any) => entry.count)
  //       }
  //     ],
  //     credits: {
  //       enabled: false
  //     }
  //   });

  // }

  gotoPage(path:string) {
    this.router.navigate([path])
  }

  getAllRecords(theme:any) {
    this.RecordList = []
    // this.SuccessCount = 0
    // this.RejectedCount = 0
    // this.PendingCount = 0
    // this.RecordlistCount = 0
    this.RecordListWithStatus=[]
      let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8'});
      this.http.get(this.allRecordsAPI,{headers:headers}).subscribe((data: any) => {
        let response:any = data
        this.RecordList = response
        for (let i = 0; i < this.RecordList.length; i++){
          const record = this.RecordList[i];
          const responseArray = JSON.parse(record.invoiceResponse);
          const status = responseArray[0].status;
  
          this.RecordListWithStatus.push({
            ...record,
            status: status
          });
        }
        this.RecordlistCount = this.RecordListWithStatus.length
        let selectedrecordArray: any = []
        let rejectedrecordArray: any = []
        let pendingrecordArray: any = []

        for (let i = 0; i < this.RecordListWithStatus.length; i++){
          if (this.RecordListWithStatus[i].status == 'SUCCESS') {
            selectedrecordArray.push(this.RecordListWithStatus[i])
          }
          else if (this.RecordListWithStatus[i].status == 'REJECTED' || this.RecordListWithStatus[i].status == 'FAILED' ) {
            rejectedrecordArray.push(this.RecordListWithStatus[i])
          }
          else {
            pendingrecordArray.push(this.RecordListWithStatus[i])
          }
        }
        this.SuccessCount = selectedrecordArray.length
        this.RejectedCount = rejectedrecordArray.length
        this.PendingCount = pendingrecordArray.length

          console.log("Selected Array count===>>",this.SuccessCount)
        console.log("Full Array===>>", this.RecordListWithStatus)
        this.pieGraph(theme)
      },
        error => {
            console.log("Error---->>",error)
      })
    }

}

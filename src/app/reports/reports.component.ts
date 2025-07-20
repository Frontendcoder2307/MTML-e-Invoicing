import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Chart } from "angular-highcharts";
import { ThemeService } from "../theme.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  revenueBarChart: any;
  revenuePieChart: any;


  waveChart: any
  pieChart:any

  isDark: boolean = true
  message: any = localStorage.getItem('theme');
  messageSubscription: any;

  barChart: any

  dailypaidChart:any



  constructor(private themeObject: ThemeService, private router: Router,private http:HttpClient) { }

  ngOnInit() {
    this.messageSubscription = this.themeObject.getMessage().subscribe(msg => {
      this.message = msg;
      console.log("Message===>>", this.message)
        this.dailyTotalPaidGraph(this.message)
        this.monthlyTotalPaidGraph(this.message)

      // this.barGraph(this.message)
      // this.pieGraph(this.message)
      // this.getlineGraph(this.message)
      // this.initBarChart(this.message)

    });
    this.dailyTotalPaidGraph(this.message)
    this.monthlyTotalPaidGraph(this.message)




    // this.barGraph(this.message)
    // this.pieGraph(this.message)
    // this.getlineGraph(this.message)
    // this.initBarChart(this.message)

  }

  getlineGraph(theme: any) {
    if (theme == 'light-theme') {
      this.isDark = false
    }
    else {
      this.isDark = true
    }

    console.log("IsDark===>>", this.isDark)


    this.waveChart = new Chart({
      chart: {
        type: 'spline',
        backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
      },
      title: {
        text: 'Revenue Overview',
        style: { color: this.isDark ? '#ffffff' : '#000000' },
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar'],
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        title: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
      },
      yAxis: {
        title: {
          text: 'Revenue ($)',
          style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
        },
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
      },
      legend: {
        itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
      },
      series: [
        {
          name: 'Prepaid',
          type: 'spline',
          data: [1000, 1200, 1400],
          color: '#ff006a',

        },
        {
          name: 'Postpaid',
          type: 'spline',
          data: [800, 950, 1100],
          color: '#00c2ff',
        },
        {
          name: 'Goods',
          type: 'spline',
          data: [600, 700, 750],
          color: '#00e676',
        },
      ],
    }
    )
  }

  initBarChart(theme: any) {
    if (theme == 'light-theme') {
      this.isDark = false
    }
    else {
      this.isDark = true
    }

    this.barChart = new Chart({
      chart: {
        type: 'bar',
        backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
      },
      title: {
        text: 'Revenue Collection',
        style: { color: this.isDark ? '#ffffff' : '#000000' },
      },
      xAxis: {
        categories: ['Q1', 'Q2', 'Q3'],
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        title: { style: { color: this.isDark ? '#ffffff' : '#000000' } },
      },
      yAxis: {
        title: {
          text: 'Revenue (Cr.)$s',
          style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
        },
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },

      },
      legend: {
        itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
      },
      series: [
        {
          name: 'Prepaid',
          type: 'bar',
          data: [20, 21, 27],
          color: '#ff006a'
        },
        {
          name: 'Postpaid',
          type: 'bar',
          data: [25, 23, 24],
          color: '#00c2ff'
        },
        {
          name: 'Goods',
          type: 'bar',
          data: [20, 25, 23],
          color: '#00e676'
        }
      ]
    });
  }

  barGraph(theme: any) {
    if (theme == 'light-theme') {
      this.isDark = false
    }
    else {
      this.isDark = true
    }

    this.revenueBarChart = new Chart({
      chart: {
        type: 'column',
        backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',

      },
      title: {
        text: 'Revenue Breakdown',
        style: { color: this.isDark ? '#ffffff' : '#000000' },
      },
      xAxis: {
        categories: ['Postpaid', 'Prepaid', 'Goods'],
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        title: {
          text: 'Category',
          style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Revenue (in MUR)',
          style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
        },
        labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
      },
      
      legend: {
        reversed: true,
        itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        },
        column: {
          colorByPoint: true  // allows individual bar colors
        }
      },
      series: [
        {
          name: 'Revenue',
          type: 'column',
          data: [
            {
              y: 50000,
              color: '#00c2ff', // Postpaid - Blue
            },
            {
              y: 30000,
              color: '#ff006a', // Prepaid - Orange
            },
            {
              y: 20000,
              color: '#00e676', // Goods - Green
            }
          ]
        }
      ]
    });
  }

  pieGraph(theme: any) {
    if (theme == 'light-theme') {
      this.isDark = false
    }
    else {
      this.isDark = true
    }

    this.revenuePieChart = new Chart({
      chart: {
        type: 'pie',
        backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
      },
      title: {
        text: 'Revenue Share by Category',
        style: { color: this.isDark ? '#ffffff' : '#000000' },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>Revenue: ${point.y:,.0f}'
      },
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
          colors: ['#00c2ff', '#ff006a', '#00e676'] // Custom colors
        }
      },
      series: [
        {
          name: 'Share',
          type: 'pie',
          data: [
            { name: 'Postpaid', y: 50000 },
            { name: 'Prepaid', y: 30000 },
            { name: 'Goods', y: 20000 }
          ]
        }
      ]
    });
  }

  gotoPage(path: string) {
    this.router.navigate([path])
  }




  dailyTotalPaidGraph(theme:any) {
    this.http.get('http://41.222.103.118:8889/api/invoices/stats/total-paid-daily').subscribe((data: any) => {
      let response = data
      let jsonData: any = response
      if (theme == 'light-theme') {
        this.isDark = false
      }
      else {
        this.isDark = true
      }
      this.dailypaidChart = new Chart({
        chart: {
          type: 'spline',
          backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',
        },
        title: {
          text: 'Daily Total Paid Report ',
          style: { color: this.isDark ? '#ffffff' : '#000000' },
        },
        xAxis: {
          categories: jsonData.map((entry: any) => entry.date),
          title: {
            text: 'Date',
            style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
          },
          labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        },
        yAxis: {
          title: {
            text: 'Total Paid',
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
            name: 'Total Paid',
            type: 'spline',
            data: jsonData.map((entry:any) => entry.totalPaid)
          }
        ],
        credits: { enabled: false }
      });

    }, error => {
          console.log(error)
    })
  }

  monthlyTotalPaidGraph(theme: any) {
    this.http.get('http://41.222.103.118:8889/api/invoices/stats/total-paid-monthly').subscribe((data:any)=>{
      let response:any = data
      let invoiceData: any = response
      const categories =invoiceData.map((item:any) => `${item.month}/${item.year}`);
      const amt = invoiceData.map((item: any) => item.totalPaid);  

      if (theme == 'light-theme') {
        this.isDark = false
      }
      else {
        this.isDark = true
      }
      this.barChart = new Chart({
        chart: {
          type: 'column', // Vertical bars
          backgroundColor: this.isDark ? '#1e1e2e' : '#ffffff',

        },
        title: {
          text: 'Monthly Total Paid Report',
          style: { color: this.isDark ? '#ffffff' : '#000000' },
        },
        xAxis: {
          categories: categories,
          title: {
            text: 'Month/Year',
            style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
          },
          labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total Paid (MUR)',
            style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' }
          },
          labels: { style: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' } },
        },
        tooltip: {
          valuePrefix: 'MUR'
        },
        legend: {
          itemStyle: { color: this.isDark ? '#ffffff' : '#000000', fontWeight: 'bold' },
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              format: 'MUR {y:,.2f}'
            },
            colorByPoint: true // Each bar has a different color
          }
        },
        colors: [
          '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#00A5A8', '#C9CBCF'
        ],
        series: [
          {
            name: 'Total Paid',
            type: 'column',
            data: amt
          }
        ],
        credits: { enabled: false }

      });
  

    }, error => {
      console.log(error)
    })
  }


}

import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { ToastService } from "../toast.service";

@Component({
  selector: 'app-all-records',
  templateUrl: './all-records.component.html',
  styleUrls: ['./all-records.component.css']
})
export class AllRecordsComponent {

  search = '';
  singleDate = '';
  showDateRange: boolean = false

  allRecordAPI ='http://41.222.103.118:8889/api/invoices/all'
  allRecordsAPIbyDate: any = 'http://41.222.103.118:8889/api/invoices/filter-by-date?start='
  searchAPI: any = 'http://41.222.103.118:8889/api/invoices/search?value='
  RecordList: any = []
  RecordListWithStatus: any = []
  RecordlistCount: any
  ShowSpinner: boolean = false
  selectedDate: string = ''; // This will hold the selected date as a string in "YYYY-MM-DD" format
 

  constructor(private http: HttpClient, private router: Router,private toast:ToastService) { }

  ngOnInit() {

    localStorage.removeItem('invoiceDetails')
    // Formatting date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formatted = `${year}${month}${day}`;

    console.log(formatted);  
    // this.getAllRecords(formatted)

    this.getAllInvoices()

  }
  // toggle function for date range
  showDateRangefunction() {
    this.showDateRange = !this.showDateRange
  }


  // Search API Integrated
  applyFilters(searchvalue: any) {
    
    console.log("search value==>>",typeof(searchvalue))
   
    if (searchvalue != '' && searchvalue!=' ') {
   
      this.ShowSpinner = true
      let searchArray: any = []
      this.RecordListWithStatus = []
      let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
      this.http.get(this.searchAPI + searchvalue, { headers: headers }).subscribe((data: any) => {
        let response: any = data
        searchArray = response
        for (let i = 0; i < searchArray.length; i++) {
          const record = searchArray[i];
          const responseArray = JSON.parse(record.invoiceResponse);
          const status = responseArray[0].status;
          this.RecordListWithStatus.push({
            ...record,
            status: status
          });
        }
        this.ShowSpinner = false

        this.RecordlistCount = this.RecordListWithStatus.length
        this.RecordListWithStatus = this.RecordListWithStatus.reverse()
        console.log("serach Array===>>", searchArray)
      },
        error => {
          this.ShowSpinner = false
          console.log("Error---->>", error)
        })
    }
    else {
      // console.log("Empty value")
      this.toast.show("Please Enter Name or Invoice No", 'warning')
    }
  }

  getAllInvoices() {
    this.ShowSpinner = true
    this.RecordList = []
    this.RecordListWithStatus = []
    let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
    this.http.get(this.allRecordAPI, { headers: headers }).subscribe((data: any) => {
      let response: any = data
      this.RecordList = response
      for (let i = 0; i < this.RecordList.length; i++) {
        const record = this.RecordList[i];
        const responseArray = JSON.parse(record.invoiceResponse);
        const status = responseArray[0].status;

        this.RecordListWithStatus.push({
          ...record,
          status: status
        });
      }
      this.ShowSpinner = false

      this.RecordlistCount = this.RecordListWithStatus.length
      this.RecordListWithStatus = this.RecordListWithStatus.reverse()
      console.log("Full Array===>>", this.RecordListWithStatus)
    },
      error => {
        this.RecordListWithStatus = []
        this.ShowSpinner = false
        console.log("Error---->>", error)
      })
  }


  //Bydefault it gets called by ngOnInit
  getAllRecords(date:any) {
    this.ShowSpinner = true
    this.RecordList = []
    this.RecordListWithStatus = []
    let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
    this.http.get(this.allRecordsAPIbyDate+date, { headers: headers }).subscribe((data: any) => {
      let response: any = data
      this.RecordList = response
      for (let i = 0; i < this.RecordList.length; i++) {
        const record = this.RecordList[i];
        const responseArray = JSON.parse(record.invoiceResponse);
        const status = responseArray[0].status;

        this.RecordListWithStatus.push({
          ...record,
          status: status
        });
      }
      this.ShowSpinner = false

      this.RecordlistCount = this.RecordListWithStatus.length
      this.RecordListWithStatus = this.RecordListWithStatus.reverse()
      console.log("Full Array===>>", this.RecordListWithStatus)
    },
      error => {
        this.RecordListWithStatus = []
        this.ShowSpinner = false
        console.log("Error---->>", error)
      })
  }


  // After selecting single date
  singledate(selecteddate:any) {
    // Formatting date  
    let fdate: any
    fdate = selecteddate.split('-')
    fdate = fdate[0] + fdate[1] + fdate[2]
    console.log('FromDate==>>', fdate)
    this.getAllRecords(fdate)
  }


  // For date Range
  dateRange(fromDate: any, toDate: any) {

    if (fromDate!='' && toDate!='') {
      let fdate: any
      fdate = fromDate.split('-')
      fdate = fdate[0] + fdate[1] + fdate[2]
      console.log('FromDate==>>', fdate)

      // Todate Logic
      let tdate: any
      tdate = toDate.split('-')
      tdate = tdate[0] + tdate[1] + tdate[2]
      console.log("ToDate==>", tdate);

      this.ShowSpinner = true
      this.RecordList = []
      this.RecordListWithStatus = []
      let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
      this.http.get('http://41.222.103.118:8889/api/invoices/filter-by-date?start=' + fdate + '&end=' + tdate, { headers: headers }).subscribe((data: any) => {
        let response: any = data
        this.RecordList = response
        for (let i = 0; i < this.RecordList.length; i++) {
          const record = this.RecordList[i];
          const responseArray = JSON.parse(record.invoiceResponse);
          const status = responseArray[0].status;

          this.RecordListWithStatus.push({
            ...record,
            status: status
          });
        }
        this.ShowSpinner = false

        this.RecordlistCount = this.RecordListWithStatus.length
        this.RecordListWithStatus = this.RecordListWithStatus.reverse()
        console.log("Full Array===>>", this.RecordListWithStatus)
      },
        error => {
          this.ShowSpinner = false
          console.log("Error---->>", error)
        })
    }
    else {
      this.toast.show("Please Select Dates",'warning')
    }
  }


  // goto Dashboard
  gotoInvoicepage(record: any) {
    localStorage.setItem('invoiceDetails', JSON.stringify(record))
    this.router.navigate(['/invoicePDF'])
  }
}

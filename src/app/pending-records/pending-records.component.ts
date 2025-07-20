import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ToastService } from "../toast.service";

@Component({
  selector: 'app-pending-records',
  templateUrl: './pending-records.component.html',
  styleUrls: ['./pending-records.component.css']
})
export class PendingRecordsComponent {


  search = '';
  singleDate = '';
  showDateRange: boolean = false
  allPendingRecordsAPI: any = 'http://41.222.103.118:8889/api/invoices/filter-by-date?start='
  searchAPI: any = 'http://41.222.103.118:8889/api/invoices/search?value='
  RecordList: any = []
  PendingRecordList: any = []
  RecordlistCount: any
  ShowSpinner: boolean = false
  selectedDate: string = ''; // This will hold the selected date as a string in "YYYY-MM-DD" format

  constructor(private http: HttpClient, private router: Router,private toast:ToastService) { }


  ngOnInit() {
    localStorage.removeItem('invoiceDetails')

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formatted = `${year}${month}${day}`;

    console.log(formatted); 
    this.getAllPendingRecords(formatted)
  }

  showDateRangefunction() {
    this.showDateRange = !this.showDateRange
  }

  applyFilters(searchvalue: any) {

    console.log("search value==>>", typeof (searchvalue))

    if (searchvalue != '' && searchvalue != ' ') {

      this.ShowSpinner = true
      let searchArray: any = []
      this.PendingRecordList = []
      let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
      this.http.get(this.searchAPI + searchvalue, { headers: headers }).subscribe((data: any) => {
        let response: any = data
        searchArray = response
        for (let i = 0; i < searchArray.length; i++) {
          const record = searchArray[i];
          const responseArray = JSON.parse(record.invoiceResponse);
          const status = responseArray[0].status;
          if (status == 'PENDING') {
            this.PendingRecordList.push({
              ...record,
              status: status
            });
          }
        }
        this.ShowSpinner = false

        this.RecordlistCount = this.PendingRecordList.length
        this.PendingRecordList = this.PendingRecordList.reverse()
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
  

  getAllPendingRecords(date:any) {
    this.ShowSpinner = true
    this.RecordList = []
    let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
    this.http.get(this.allPendingRecordsAPI+date, { headers: headers }).subscribe((data: any) => {
      let response: any = data
      this.RecordList = response
      for (let i = 0; i < this.RecordList.length; i++) {
        const record = this.RecordList[i];
        const responseArray = JSON.parse(record.invoiceResponse);
        const status = responseArray[0].status;
        if (status == 'PENDING') {
          this.PendingRecordList.push({
            ...record,
            status: status
          });
        }
      }
      this.ShowSpinner = false
      this.RecordlistCount = this.PendingRecordList.length
      this.PendingRecordList = this.PendingRecordList.reverse()
      console.log("Full Array===>>", this.PendingRecordList)
    },
      error => {
        this.ShowSpinner = false
        console.log("Error---->>", error)
      })
  }

  singledate(selecteddate: any) {
    // Formatting date
    let fdate: any
    fdate = selecteddate.split('-')
    fdate = fdate[0] + fdate[1] + fdate[2]
    console.log('FromDate==>>', fdate)
 
    this.getAllPendingRecords(fdate)
  }

  dateRange(fromDate: any, toDate: any) {

    if (fromDate != '' && toDate != '') {
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
      this.PendingRecordList = []
      let headers = new HttpHeaders({ "Content-Type": 'application/json; charset=utf-8' });
      this.http.get('http://41.222.103.118:8889/api/invoices/filter-by-date?start=' + fdate + '&end=' + tdate, { headers: headers }).subscribe((data: any) => {
        let response: any = data
        this.RecordList = response
        for (let i = 0; i < this.RecordList.length; i++) {
          const record = this.RecordList[i];
          const responseArray = JSON.parse(record.invoiceResponse);
          const status = responseArray[0].status;
          if (status == 'PENDING') {
            this.PendingRecordList.push({
              ...record,
              status: status
            });
          }
        }
        this.ShowSpinner = false
        this.RecordlistCount = this.PendingRecordList.length
        this.PendingRecordList = this.PendingRecordList.reverse()
        console.log("Full Array===>>", this.PendingRecordList)
      },
        error => {
          this.PendingRecordList = []
          this.ShowSpinner = false
          console.log("Error---->>", error)
        })
    }
    else {
      this.toast.show("Please Select Dates", 'warning')
    }
  }

  gotoInvoicepage(record: any) {
    localStorage.setItem('invoiceDetails', JSON.stringify(record))
    this.router.navigate(['/invoicePDF'])
  }




}

import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-downloadpdf',
  templateUrl: './downloadpdf.component.html',
  styleUrls: ['./downloadpdf.component.css']
})
export class DownloadpdfComponent {

  ShowSpinner:boolean = true
 invoice: any
  QRCode:any
  theme: any = localStorage.getItem('theme')
  IRN: any
  status: any
  InvoiceTotal: any = 0
  roundingOffamt:any=0
  userName: any = localStorage.getItem('username')
  mobileNumber: any
  previousBalance: number = 0


  constructor( private router: Router, private activatedRouter:ActivatedRoute, private http:HttpClient) { }
  
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      console.log(params)
      let invoiceNumber = params['invNo']
      this.getData(invoiceNumber)
        })
  }

  // getData(data: any) {
  //   this.invoice = data
  //   console.log("Invoice data==>>", this.invoice)
  //   const response = JSON.parse(this.invoice.invoiceResponse)[0];
  //   if (response.qrCode != "" || response.qrCode != null) {
  //     this.QRCode = 'data:image/png;base64,' + response.qrCode;
  //   }
  //   this.IRN = response.irn

  //   for (let i = 0; i < this.invoice.products.length; i++) {
  //     this.InvoiceTotal = this.InvoiceTotal + this.invoice.products[i].quantity * this.invoice.products[i].unitPrice
  //   }
  //   // console.log('Invoice Total--->>', this.InvoiceTotal)
  //   this.roundingOffamt = (parseFloat(this.invoice.totalAmtWoVatMur) + parseFloat(this.invoice.totalVatAmount) - parseFloat(this.invoice.totalAmtPaid))
  //   // console.log('Rounding Amount--->>', this.roundingOffamt)

  //   // console.log("Response==>>", response.irn)

  //   this.mobileNumber = this.invoice.buyerMsisdn
  // }

  getData(invoiceNumber: any) {
    this.ShowSpinner = true
    console.log("Invoce Number===>>", invoiceNumber)
    this.http.get('http://41.222.103.118:8889/api/invoices/search/identifier?value=' + invoiceNumber).subscribe((data: any) => {
      let response: any = data
      console.log("Response==>>", response.length)
      if (response.length == 0) {
        this.ShowSpinner = false
        console.log("Data not Found")
      }
      else {

        this.invoice = response[0]
        this.ShowSpinner = false

        console.log("Invoice==>>", this.invoice)
        const objresponse = JSON.parse(this.invoice.invoiceResponse)[0];
        if (objresponse.qrCode != "" || objresponse.qrCode != null) {
          this.QRCode = 'data:image/png;base64,' + objresponse.qrCode;
        }
        this.IRN = objresponse.irn
        this.status = objresponse.status
        for (let i = 0; i < this.invoice.products.length; i++) {
          this.InvoiceTotal = this.InvoiceTotal + this.invoice.products[i].quantity * this.invoice.products[i].unitPrice
          this.previousBalance = parseFloat(this.previousBalance + this.invoice.products[i].previousBalance)

        }
        // console.log('Invoice Total--->>', this.InvoiceTotal)
        this.roundingOffamt = (parseFloat(this.invoice.totalAmtWoVatMur) + parseFloat(this.invoice.totalVatAmount) - parseFloat(this.invoice.totalAmtPaid))
        // console.log('Rounding Amount--->>', this.roundingOffamt)
    
        // console.log("Response==>>", response.irn)
    
        this.mobileNumber = this.invoice.buyerMsisdn
      }
      }, error => {
        console.log("Error msg==>", error)
      })
    
  }

  getQRCode(): string {
    const response = JSON.parse(this.invoice.invoiceResponse)[0];
    return 'data:image/png;base64,' + response.qrCode;
  }

  goBack() {
    window.location.href = 'https://www.chili.mu';
  }

  printInvoice() {
    window.print();
  }

}

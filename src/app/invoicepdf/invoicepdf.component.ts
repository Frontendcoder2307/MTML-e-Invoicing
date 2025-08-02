import { Component,ViewChild,ElementRef } from '@angular/core';
import { Location } from "@angular/common";
import jsPDF from "jspdf";
import { image } from "html2canvas/dist/types/css/types/image";
import html2canvas from "html2canvas";
import * as html2pdf from 'html2canvas'
import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "../toast.service";
import { startWith } from "rxjs";

@Component({
  selector: 'app-invoicepdf',
  templateUrl: './invoicepdf.component.html',
  styleUrls: ['./invoicepdf.component.css']
})
export class InvoicepdfComponent {

  @ViewChild('content',{static:false}) el!:ElementRef

  invoice: any
  QRCode:any
  theme: any = localStorage.getItem('theme')
  IRN: any
  InvoiceTotal: any = 0
  roundingOffamt:any=0
  userName: any = localStorage.getItem('username')
  mobileNumber: any
  previousBalance: any = 0
  postBalance: any = 0
  invoiceRefNumber:any
  invoiceDueDate: any
  invoiceIssueDate: any
  invoiceTotalHeading: any
  unitPriceHeading:any

  constructor(private location:Location,private router:Router, private http:HttpClient,private toast:ToastService){}


  ngOnInit() {
    if (this.userName == '' || this.userName == null) {
      localStorage.clear()
      this.router.navigate([''])
    }
    else {
      this.getData(JSON.parse(localStorage.getItem('invoiceDetails')!))

    }
  }
  

  getData(data: any) {
    this.invoice = data
    this.previousBalance = 0
    this.postBalance = 0

    console.log("Invoice data==>>", this.invoice)
    const response = JSON.parse(this.invoice.invoiceResponse)[0];
    if (response.qrCode != "" || response.qrCode != null) {
      this.QRCode = 'data:image/png;base64,' + response.qrCode;
    }
      this.IRN=response.irn

    for (let i = 0; i < this.invoice.products.length; i++){
      this.InvoiceTotal = this.InvoiceTotal + this.invoice.products[i].quantity * this.invoice.products[i].unitPrice
      // if (this.invoice.products[i].itemDesc.includes('Postpaid Invoice')) {
      this.previousBalance = this.invoice.products[0].previousBalance
      

        this.roundingOffamt = (parseFloat(this.invoice.totalAmtWoVatMur) + parseFloat(this.invoice.totalVatAmount) - parseFloat(this.invoice.totalAmtPaid))
      // }
      
    }

    // this.previousBalance = parseFloat(this.invoice.totalAmtPaid) - (parseFloat(this.invoice.totalAmtWoVatMur) + parseFloat(this.invoice.totalVatAmount))
    this.roundingOffamt = (parseFloat(this.invoice.totalAmtWoVatMur) + parseFloat(this.invoice.totalVatAmount) + this.previousBalance - parseFloat(this.invoice.totalAmtPaid))

    this.mobileNumber = this.invoice.buyerMsisdn
    if (this.mobileNumber.startsWith('230')) {
      this.mobileNumber = this.mobileNumber.split('230')[1]
    }
    else {
      this.mobileNumber = this.mobileNumber
    }

    if (this.invoice.invoiceIndentifier.startsWith('R_')) {
      this.invoiceRefNumber = this.invoice.invoiceIndentifier.split('R_')[1]
      console.log("InvRef Number===>>",this.invoiceRefNumber)
    }
    
    this.invoiceDueDate = this.invoice.invoiceDueDate || ''
    const year = +this.invoiceDueDate.substring(0, 4);
    const month = +this.invoiceDueDate.substring(4, 6) - 1;
    const day = +this.invoiceDueDate.substring(6, 8);

    this.invoiceIssueDate = this.invoice.dateTimeInvoiceIssued.split(' ')[0]
    const Issueyear = +this.invoiceIssueDate.substring(0, 4);
    const Issuemonth = +this.invoiceIssueDate.substring(4, 6) - 1;
    const Issueday = +this.invoiceIssueDate.substring(6, 8);
  

    this.invoiceDueDate = new Date(year, month, day);
    this.invoiceIssueDate = new Date(Issueyear, Issuemonth, Issueday)
    
    console.log("Previous Balance--->>", this.previousBalance)
    
    console.log(this.invoice.products[0].quantity)
    if (this.invoice.products[0].quantity!=0) {
      this.unitPriceHeading = 'Unit Price'
      this.invoiceTotalHeading='Invoice Total'
    }
    else {
      this.unitPriceHeading = 'Amount'
      this.invoiceTotalHeading = 'Pre Balance Total'
    }
    
  }

  getQRCode(): string {
    const response = JSON.parse(this.invoice.invoiceResponse)[0];
    return 'data:image/png;base64,' + response.qrCode;
  }

  goBack() {
    this.location.back()
  }

  printInvoice() {
    window.print();
  }

  makePDF() {

    let element:any = document.getElementById('content')
    var opt = {
      margin: 0.1,
      filename: 'Invoice.pdf',
      image: { type: 'jpeg', quality: 1 },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legecy']
      },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    // html2pdf().from(element).set(opt).save()


    
  }

  sendSMS() {
    if (this.mobileNumber.length < 8) {
      this.toast.show("Please Enter valid Mobile Number",'warning')
    }
    else {
      console.log("Mobile Number", this.mobileNumber)
      if (this.invoice.invoiceIndentifier.includes('/')) {
        // console.log(this.invoice.invoiceIndentifier)
        this.invoice.invoiceIndentifier = this.invoice.invoiceIndentifier.split('/')[1]
      }
      let msg: any ='Dear Customer, your VAT Invoice can be downloaded from '+'https://tinyurl.com/bdduwvz7/' + this.invoice.invoiceIndentifier+' in PDF format. Thank you.'
      this.http.get('https://ekyc.chili.mu:9443/ekyc/v1/sms?msisdn=230'+this.mobileNumber+'&from=CHiLi%20Bill&text='+msg+'&configId=1&locale=en').subscribe((data: any) => {
        let response = data
        this.toast.show(`Successfully sent to ${this.mobileNumber}`,'success')
      },
        error => {
      this.toast.show("Failed..! Please try again",'danger')
    })
    //   console.log("URL===>>",msg)

 
    }
    // this.router.navigate(['downloadPDF/' + this.invoice.invoiceIndentifier])
  }


  
}

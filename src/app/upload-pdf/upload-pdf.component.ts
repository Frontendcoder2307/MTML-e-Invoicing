import { Component } from '@angular/core';
import { ToastService } from "../toast.service";
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html',
  styleUrls: ['./upload-pdf.component.css']
})
export class UploadPDFComponent {

  selectedFiles: File[] = [];
  uploadStatus: string[] = [];
  showuploadBtn: boolean = true
  showoptions: boolean = true
  ShowSpinner: boolean = false

  docType = ''; // default value


  constructor(private http: HttpClient, private toast: ToastService, private router:Router) { }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const pdfs = Array.from(input.files).filter(f => f.type === 'application/pdf');
      this.selectedFiles = pdfs;
      this.uploadStatus = pdfs.map(() => '');
    }
    this.showoptions = false
  }

  uploadAll(): void {

    if (this.docType == '') {
      this.toast.show('Please select Document Type', "info")
      this.uploadStatus = [];
      this.selectedFiles = []

    }
    else {
      this.selectedFiles.forEach((file, index) => setTimeout(() => {
        this.uploadFile(file, index)
      }, 500));
    }
  }

  uploadFile(file: File, index: number): void {
    console.log("Doc type==>>", this.docType)
    console.log("File Name==>>", file.name)

    let api = ''
    if (this.docType == 'postpaid') {
      api = 'http://41.222.103.118:8889/api/invoice/upload-and-transmit'
    }
    else if (this.docType == 'recharge') {
      api = 'http://41.222.103.118:8889/api/recharge/upload-and-transmit-recharge'
    }
    else if (this.docType == 'invoice') {
      api = 'http://41.222.103.118:8889/api/invoices/sales/uploadAndTransmitSalesGood'
    }
    else {
      api = 'http://41.222.103.118:8889/api/invoices/mobile/upload-and-transmit-mobile'
    }

    this.ShowSpinner = true
    const formData = new FormData();
    formData.append('file', file);
    this.showuploadBtn = false
    this.http.post(api, formData, {
      // observe: 'events',
      // reportProgress: false
    }).subscribe((data: any) => {
      let response = data;
      this.uploadStatus[index] = '✅ Successfully Uploaded to MRA';
      this.docType = ''
      this.showoptions = true
      this.ShowSpinner = false

    }, error => {
      console.log("Error===>>", error.error.text)
      let errorText = error.error.text
      if (errorText == 'Invoice already submitted. Skipping submission.') {
        this.toast.show(`${file.name} is already Submitted`,"info")
      }
      this.uploadStatus[index] = '❌ Failed to Upload...';
      this.docType = ''
      this.showoptions = true
      this.ShowSpinner = false

    });
    console.log("selectedFiles length==>", this.selectedFiles.length)
  }

  removeFiles() {
    this.selectedFiles = []
  }

  gotoSuccessRecords() {
    this.router.navigate(['home/AllRecords'])
  }



}

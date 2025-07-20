import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from "./loginpage/loginpage.component";
import { LayoutpageComponent } from "./layoutpage/layoutpage.component";
import { AllRecordsComponent } from "./all-records/all-records.component";
import { SuccessRecordsComponent } from "./success-records/success-records.component";
import { PendingRecordsComponent } from "./pending-records/pending-records.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RejectedRecordsComponent } from "./rejected-records/rejected-records.component";
import { ReportsComponent } from "./reports/reports.component";
import { UploadPDFComponent } from "./upload-pdf/upload-pdf.component";
import { OfflineinvoiceComponent } from "./offlineinvoice/offlineinvoice.component";
import { InvoicepdfComponent } from "./invoicepdf/invoicepdf.component";
import { DownloadpdfComponent } from "./downloadpdf/downloadpdf.component";

const routes: Routes = [
  { path: 'login', component: LoginpageComponent },
  { path: '', component:LoginpageComponent },
  { path: 'home', component: LayoutpageComponent,
    children: [
    
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'AllRecords', component: AllRecordsComponent },
      { path: 'SuccessRecords', component: SuccessRecordsComponent },
      { path: 'PendingRecords', component: PendingRecordsComponent },
      { path: 'RejectedRecords', component: RejectedRecordsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'upload', component: UploadPDFComponent },
      { path: 'invoices', component: OfflineinvoiceComponent },

    ]
   },
  { path: 'invoicePDF', component: InvoicepdfComponent },
  { path: 'downloadPDF/:invNo', component: DownloadpdfComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

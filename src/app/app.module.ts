import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router'
import { ChartModule } from 'angular-highcharts'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';
import { LayoutpageComponent } from './layoutpage/layoutpage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AllRecordsComponent } from './all-records/all-records.component';
import { SuccessRecordsComponent } from './success-records/success-records.component';
import { PendingRecordsComponent } from './pending-records/pending-records.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RejectedRecordsComponent } from './rejected-records/rejected-records.component';
import { ReportsComponent } from './reports/reports.component';
import { UploadPDFComponent } from './upload-pdf/upload-pdf.component';
import { OfflineinvoiceComponent } from './offlineinvoice/offlineinvoice.component';
import { InvoicepdfComponent } from './invoicepdf/invoicepdf.component';
import { DownloadpdfComponent } from './downloadpdf/downloadpdf.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    HeaderComponent,
    ToastComponent,
    LayoutpageComponent,
    SidebarComponent,
    AllRecordsComponent,
    SuccessRecordsComponent,
    PendingRecordsComponent,
    FooterComponent,
    DashboardComponent,
    RejectedRecordsComponent,
    ReportsComponent,
    UploadPDFComponent,
    OfflineinvoiceComponent,
    InvoicepdfComponent,
    DownloadpdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ChartModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

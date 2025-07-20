import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from "../toast.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offlineinvoice',
  templateUrl: './offlineinvoice.component.html',
  styleUrls: ['./offlineinvoice.component.css']
})
export class OfflineinvoiceComponent {

  vatRate = 0.15;
  invoiceForm: FormGroup;
  totalDiscountAmount: any = 0
  ShowSpinner: boolean = false
  uploadSuccessfully:boolean = false

  constructor(private fb: FormBuilder, private http: HttpClient, private toast: ToastService, private router:Router) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      // dueDate: ['', Validators.required],
      // poReferenceNumber: [''],
      transactionType: ['B2B',Validators.required],
      personType: ['VATR', Validators.required], // dropdown: VATR / NON-VATR
      invoiceTypeDesc: ['STD', Validators.required], // dropdown: STD, CRN, DRN, PRF, TRN
      salesTransactions: ['CASH', Validators.required], // CASH, BANK TRANSFER, CARD, CHEQUE

      clientName: ['', Validators.required],
      contactNumber: [''],
      address: [''],
      vatNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      brnNumber: ['',  ],

      discountTotalAmount: [0],
      roundoffAMount:[0],
      // totalAmtPaid: [0, Validators.required],

      reasonStated: [''], // conditionally shown for CRN/DRN
      invoiceRefIdentifier: ['0'], // conditionally shown for CRN/DRN

      items: this.fb.array([this.createItem()])
    });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only digits
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemNo: [''], // to be set on add
      taxCode: ['TC01', Validators.required], 

      nature: ['GOODS', Validators.required], // dropdown: GOODS, POSTPAID, RECHARGE, INVOICE
      productCodeMra: [''],
      productCodeOwn: [''],
      itemDesc: ['', Validators.required], // item description
      itemType:[''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0], // optional
      discountedValue: [{ value: 0, disabled: true }], // calculated
      amtWoVatCur: [{ value: 0, disabled: true }], // calculated
      amtWoVatMur: [{ value: 0, disabled: true }], // calculated
      vatAmt: [{ value: 0, disabled: true }], // calculated
      totalPrice: [{ value: 0, disabled: true }], // calculated

      modeOfSale: ['Sale', Validators.required],
      model: [''],
      make: [''],
      rentalPeriod: this.fb.group({
        from: [''],
        to: ['']
      })
    });
  }

  addItem() {
    const newItem = this.createItem();
    newItem.get('itemNo')?.setValue(this.items.length + 1);
    this.items.push(newItem);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    // Update itemNo for remaining items
    this.items.controls.forEach((ctrl, idx) => ctrl.get('itemNo')?.setValue(idx + 1));
  }

  calculateItem(i: number) {
    const item = this.items.at(i);
    const val = item.value;

    const quantity = val.quantity || 0;
    const unitPrice = val.unitPrice || 0;
    const discount = val.discount || 0;

    const amtWoVatCur = quantity * unitPrice - discount;
    const vatAmt = amtWoVatCur * this.vatRate; //we need to change vatRate as per TAXCODE use if()
    const totalPrice = amtWoVatCur + vatAmt;

    item.patchValue({
      discountedValue: (quantity * unitPrice - discount).toFixed(2),
      amtWoVatCur: amtWoVatCur.toFixed(2),
      amtWoVatMur: amtWoVatCur.toFixed(2),
      vatAmt: vatAmt.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    }, { emitEvent: false });
  }

  calculateAllItems() {
    this.items.controls.forEach((_, i) => this.calculateItem(i));
  }

  get subtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const val = item.value;
      return sum + (val.quantity * val.unitPrice - val.discount);
    }, 0);
  }

  get vatAmount(): number {
    return this.subtotal * this.vatRate;
  }

  grandTotal(): number {
    const discountTotal = this.invoiceForm.get('discountTotalAmount')?.value + this.invoiceForm.get('roundoffAMount')?.value || 0;
    return this.subtotal + this.vatAmount - discountTotal;
  }

  ngOnInit() {
    // Subscribe to changes to recalc totals automatically
    this.items.controls.forEach((ctrl, i) => {
      ctrl.valueChanges.subscribe(() => this.calculateItem(i));
    });

    this.items.valueChanges.subscribe(() => this.calculateAllItems());

    // React to discountTotalAmount changes too
    this.invoiceForm.get('discountTotalAmount')?.valueChanges.subscribe(() => {
      // just trigger grand total recalculation by Angular change detection
    });
  }

  formatInvoiceDate(date: any): string {
    const d = new Date(date);
    return (
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0') + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0') + ':' +
      String(d.getSeconds()).padStart(2, '0')
    );
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      this.ShowSpinner = true
      this.totalDiscountAmount=0
      const data = this.invoiceForm.value;
        // Format invoiceDate
        const formattedDate = this.formatInvoiceDate(data.invoiceDate);

        // Prepare items list in API format
        const itemList = data.items.map((item: any, index: number) => {
          const quantity = Number(item.quantity);
          const unitPrice = Number(item.unitPrice);
          const discount = Number(item.discount) || 0;

          const amtWoVatCur = quantity * unitPrice - discount;
          const vatAmt = amtWoVatCur * this.vatRate;
          const totalPrice = amtWoVatCur + vatAmt;

          return {
            itemNo: (index + 1).toString(),
            taxCode: item.taxCode,
            nature: item.nature,
            productCodeMra: item.productCodeMra,
            productCodeOwn: item.productCodeOwn,
            itemDesc: item.itemType +"-"+ item.itemDesc,
            quantity: quantity.toString(),
            unitPrice: unitPrice.toString(),
            discount: discount ? discount.toString() : '',
            discountedValue: discount > 0 ? (amtWoVatCur.toFixed(2)) : '',
            amtWoVatCur: amtWoVatCur.toFixed(2),
            amtWoVatMur: amtWoVatCur.toFixed(2),
            vatAmt: vatAmt.toFixed(2),
            totalPrice: totalPrice.toFixed(2)
          };
        });

      
        for (let i = 0; i < itemList.length; i++) {
          console.log("Item Length--->>", itemList[i].discount)
          this.totalDiscountAmount = this.totalDiscountAmount + parseFloat(itemList[i].discount)
          // console.log("TYpe of totalDiscountAmount--->>", typeof (itemList[i].discount))

        }
        console.log("totalDiscountAmount--->>", this.totalDiscountAmount)

        const requestBody = [{
          invoiceCounter: '1',
          transactionType: data.transactionType,
          personType: data.personType,
          invoiceTypeDesc: data.invoiceTypeDesc, //STD/CR/DRN
          currency: 'MUR',
          invoiceIdentifier: data.invoiceNumber, // fixed
          invoiceRefIdentifier: data.invoiceRefIdentifier,
          previousNoteHash: 'prevNote',
          reasonStated: (data.invoiceTypeDesc === 'CRN' || data.invoiceTypeDesc === 'DRN') ? data.reasonStated : '',
          salesTransactions: data.salesTransactions,
          totalVatAmount: this.vatAmount.toFixed(2),
          totalAmtWoVatCur: this.subtotal.toFixed(2),
          totalAmtWoVatMur: this.subtotal.toFixed(2),
          invoiceTotal: this.grandTotal().toFixed(2),
          discountTotalAmount: data.discountTotalAmount,
          totalAmtPaid: this.grandTotal().toFixed(2),
          dateTimeInvoiceIssued: formattedDate,
          seller: {
            name: 'MTML',
            tradeName: 'MTML',
            tan: '20275899',
            brn: 'C07048459',
            businessAddr: '25, Rosiers Avenue',
            businessPhoneNo: '52943333',
            ebsCounterNo: 'a1'
          },
          buyer: {
            name: data.clientName || '',
            tan: data.vatNumber || '',
            brn: data.brnNumber || '',
            businessAddr: data.address || '',
            buyerType: data.personType,
            nic: '',
            msisdn: data.contactNumber || ''            
          },
          itemList: itemList
        }];

        console.log('Request Body:', requestBody);

        // Call your API service here
        this.http.post('http://41.222.103.118:8889/mtml/mra/invoices/v1/transmitInvoice', requestBody).subscribe((data: any) => {
          let response = data
          console.log('response==>>', response.fiscalisedInvoices)
          
          this.ShowSpinner = false


          if (response.status == 'SUCCESS') {
            this.toast.show('Uploaded Successfully', "success")
            this.invoiceForm.reset()
            this.uploadSuccessfully = true

          }
          else {
            let errorList: { code: any; description: string }[] = [];
            const invoice = response.fiscalisedInvoices[0];
            if (invoice && invoice.errorMessages) {
              errorList = invoice.errorMessages;
            }
            for (let i = 0; i < errorList.length; i++){
              this.toast.show(errorList[i].description, "danger")
            }
          }
        }, error => {
          console.log('Failed')
          this.toast.show('Failed to Upload', "danger")
          this.ShowSpinner = false

        })

      
    } else {
      this.invoiceForm.markAllAsTouched();
      const data:any = this.invoiceForm.value;
      console.log("Invoice Form==>>", data)
      let vatNumber: any = data.vatNumber.toString()
      let address: any = data.address.toString()
      let brnNumber: any = data.brnNumber.toString()
      let contactNumber: any = data.contactNumber.toString()
      let invoiceNumber: any = data.invoiceNumber.toString()
      let invoiceDate: any = data.invoiceDate.toString()
      let paymentMode: any = data.salesTransactions
      let customerName: any = data.clientName.toString()
      let totalAmtPaid: any = data.totalAmtPaid
      console.log("VatNumber==>>", vatNumber)


      if (vatNumber.length < 8) {
        this.toast.show('Invalid VAT Number', "warning")
      }
      if (brnNumber.length < 9) {
        this.toast.show('Invalid BRN Number', "warning")
      }
      // if (address=='') {
      //   this.toast.show('Please Enter Address', "warning")
      // }
      // if (contactNumber.length < 8) {
      //   this.toast.show('Please Enter Valid Mobile', "warning")
      // }
      if (invoiceNumber.length < 0) {
        this.toast.show('Please Enter Invoice Number', "warning")
      }
      if (invoiceDate=='') {
        this.toast.show('Please Enter Invoice Date', "warning")
      }
      if (paymentMode=='') {
        this.toast.show('Please select salesTransactions Type', "warning")
      }
      if (customerName=='') {
        this.toast.show('Please Enter Customer Name', "warning")
      }
      if (totalAmtPaid == 0) {
        this.toast.show('Please Enter Inventory Items properly', "warning")
      }
      
      this.ShowSpinner = false


    }
  }

  showForm() {
    this.uploadSuccessfully=false
  }

  gotoSuccessRecords() {
    this.router.navigate(['home/SuccessRecords'])
  }
  

}

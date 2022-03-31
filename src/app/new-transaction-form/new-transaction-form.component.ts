import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { responseXML } from "../../assets/json/customer.json"
import { Transaction } from '../model/model';
import { TransactionService } from '../services/transaction.service';


@Component({
  selector: 'app-new-transaction-form',
  templateUrl: './new-transaction-form.component.html',
  styleUrls: ['./new-transaction-form.component.scss']
})
export class NewTransactionFormComponent implements OnInit {

  formValid = true;
  transactionForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  startSequence: number;
  currencies: string[] = ["AED", "EUR", "CHF", "MUR", "USD"];
  regions: string[] = ["Port Louis", "Curepipe", "Vacoas", "Port Mathurin"];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private transService: TransactionService
  ) {
    let lastSeq = parseInt(localStorage.getItem("lastSequence"));
    this.startSequence = lastSeq + 1;
  }

  ngOnInit(): void {
    this.transactionForm = this.formBuilder.group({
      reference: ['CUS' + this.datePipe.transform(Date.now(), "yyyyMMdd") + this.startSequence, [Validators.required, Validators.maxLength(15)]],
      type: [{ value: 'NEW', disabled: true }, [Validators.required]],
      cNumber: ['', Validators.required],
      cName: ['', Validators.required],
      cAddress: ['', Validators.required],
      cPhoneNumber: ['', Validators.required],
      transferAmount: ['', Validators.required],
      transferCurrency: ['', Validators.required],
      benBank: ['', Validators.required],
      benBankAccount: ['', Validators.required],
      cardDetails: ['', Validators.required],
      region: ['', Validators.required],
      paymentDetails: ['', Validators.required],

    });
  }

  get f() { return this.transactionForm.controls; }

  onSubmit() {
    this.formValid = true;
    if (this.transactionForm.valid) {
      this.submitted = true;
      let transArray: Transaction[] = [];
      let trans: Transaction = {
        reference: this.transactionForm.controls['reference'].value,
        transferAmount: this.transactionForm.controls['transferAmount'].value,
        transferCurrency: this.transactionForm.controls['transferCurrency'].value,
        custInfo: {
          cName: this.transactionForm.controls['cName'].value,
          cAddress: this.transactionForm.controls['cAddress'].value,
          cPhoneNumber: this.transactionForm.controls['cPhoneNumber'].value,
          cNumber: this.transactionForm.controls['cNumber'].value
        }
      };
      transArray.push(trans);
      this.transService.saveTransaction(transArray).subscribe(data => {
        let lastSeq = parseInt(localStorage.getItem("lastSequence"));
        lastSeq = lastSeq + 1;
        localStorage.setItem("lastSequence", "" + lastSeq);
        this.router.navigate(["/view-transaction"]);
      },
      (error) => {
        this.formValid = false;
        this.error = error;
      });
    }
  }

  getCustomerInfo() {
    if (this.transactionForm.controls['cNumber'].valid
      && responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.CUST_NO == this.transactionForm.controls['cNumber'].value) {
      this.transactionForm.controls['cName'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.SHORT_NAME);
      this.transactionForm.controls['cPhoneNumber'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.CONTACT_INFO_V7.CONTACT_INFO_V7.PHONE_LIST_V7.PHONE_LIST_ITEM_V7.PHONE);
      this.transactionForm.controls['cAddress'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.STREET_ADDR);
      this.transactionForm.controls['type'].patchValue("EXISTING");
    }
  }

}

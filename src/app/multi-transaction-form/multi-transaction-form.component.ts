import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../services/transaction.service';
import { responseXML } from "../../assets/json/customer.json"
import { Router } from '@angular/router';
import { Transaction } from '../model/model';

@Component({
  selector: 'app-multi-transaction-form',
  templateUrl: './multi-transaction-form.component.html',
  styleUrls: ['./multi-transaction-form.component.scss']
})
export class MultiTransactionFormComponent implements OnInit {

  submitted: boolean = false;
  error = '';
  multiForm = this.formBuilder.group({
    transactionForms: this.formBuilder.array([])
  });

  showDeleteIcon: boolean = false;

  startSequence: number;
  initialSequence: number;
  currencies: string[] = ["AED", "EUR", "CHF", "MUR", "USD"];
  regions: string[] = ["Port Louis", "Curepipe", "Vacoas", "Port Mathurin"];

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private transService: TransactionService, private router: Router) {
    let lastSeq = parseInt(localStorage.getItem("lastSequence"));
    this.startSequence = lastSeq;
    this.initialSequence = lastSeq;
  }


  ngOnInit(): void {
    this.addTransactionForm();
  }

  get transactionForms() {
    return this.multiForm.controls["transactionForms"] as FormArray;
  }

  addTransactionForm() {
    this.startSequence = this.startSequence + 1;
    const transactionForm = this.formBuilder.group({
      reference: ['CUS' + this.datePipe.transform(Date.now(), "yyyyMMdd") + this.startSequence, [Validators.required, Validators.maxLength(15)]],
      type: ['NEW', [Validators.required]],
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
    if (transactionForm.controls['type'].value == "NEW") {
      this.clearValidityIfNew(transactionForm);
    } else {
      this.addValidiesIfExisting(transactionForm);
    }
    this.transactionForms.push(transactionForm);
    if(this.transactionForms.length > 1) {
      this.showDeleteIcon = true;
    }
  }

  deleteTransactionForm(index: number) {
    this.transactionForms.removeAt(index);
    this.startSequence = this.initialSequence;
    for (let i = 0; i < this.transactionForms.length; i++) {
      this.startSequence = this.startSequence + 1;
      var formArray = this.multiForm.get('transactionForms') as FormArray;
      var item = formArray.at(i) as FormGroup;
      let oldValue = item.controls['reference'].value.substring(0, 11);
      item.controls['reference'].patchValue(oldValue + this.startSequence);
    }
    if(this.transactionForms.length > 1) {
      this.showDeleteIcon = true;
    }
  }

  getCustomerInfo(index: number) {
    var formArray = this.multiForm.get('transactionForms') as FormArray;
    var item = formArray.at(index) as FormGroup;
    if (item.controls['cNumber'].valid
      && responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.CUST_NO == item.controls['cNumber'].value) {
      item.controls['cName'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.SHORT_NAME);
      item.controls['cPhoneNumber'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.CONTACT_INFO_V7.CONTACT_INFO_V7.PHONE_LIST_V7.PHONE_LIST_ITEM_V7.PHONE);
      item.controls['cAddress'].patchValue(responseXML.getCustomerInfoResponse.getCustomerInfoResult.CUST_INFO.STREET_ADDR);
      item.controls['type'].patchValue("EXISTING");
    }
  }

  onSubmit() {
    if (this.transactionForms.valid) {
      this.submitted = true;
      let transArray: Transaction[] = [];
      for(let i=0; i < this.transactionForms.length; i++) {
        var item = this.transactionForms.at(i) as FormGroup;
        let trans: Transaction = {
          reference: item.controls['reference'].value,
          transferAmount: item.controls['transferAmount'].value,
          transferCurrency: item.controls['transferCurrency'].value,
          custInfo: {
            cName: item.controls['cName'].value,
            cAddress: item.controls['cAddress'].value,
            cPhoneNumber: item.controls['cPhoneNumber'].value,
            cNumber: item.controls['cNumber'].value
          }
        };
        transArray.push(trans);
      }
      this.transService.saveTransaction(transArray).subscribe(data => {
        let lastSeq = parseInt(localStorage.getItem("lastSequence"));
        lastSeq = lastSeq + transArray.length;
        localStorage.setItem("lastSequence", "" + lastSeq);
        this.router.navigate(["/view-transaction"]);
      },
      (error) => {
        this.error = error;
      });
    }
  }

  resetForms() {
    this.transactionForms.clear();
    this.startSequence = this.initialSequence;
    this.addTransactionForm();
  }

  regionChanged(index: number) {
    var formArray = this.multiForm.get('transactionForms') as FormArray;
    var item = formArray.at(index) as FormGroup;
    if (item.controls['region'].value == "Port Mathurin") {
      item.controls['cAddress'].disable();
    } else {
      item.controls['cAddress'].enable();
    }
  }

  changeCustomerType(event, i) {
    var formArray = this.multiForm.get('transactionForms') as FormArray;
    var item = formArray.at(i) as FormGroup;
    if (event.target.value == "NEW") {
      this.clearValidityIfNew(item);
    } else {
      this.addValidiesIfExisting(item);
    }
  }

  addValidiesIfExisting(item) {

    item.controls['reference'].setValidators([Validators.required, Validators.maxLength(15)]);
    item.controls['reference'].updateValueAndValidity();
    item.controls['type'].setValidators([Validators.required]);
    item.controls['type'].updateValueAndValidity();
    item.controls['cNumber'].setValidators([Validators.required]);
    item.controls['cNumber'].enable();
    item.controls['cNumber'].updateValueAndValidity();
    item.controls['cAddress'].setValidators([Validators.required]);
    item.controls['cAddress'].updateValueAndValidity();
    item.controls['cPhoneNumber'].setValidators([Validators.required]);
    item.controls['cPhoneNumber'].updateValueAndValidity();
    item.controls['transferAmount'].setValidators([Validators.required]);
    item.controls['transferAmount'].updateValueAndValidity();
    item.controls['transferCurrency'].setValidators([Validators.required]);
    item.controls['transferCurrency'].updateValueAndValidity();
    item.controls['benBank'].setValidators([Validators.required]);
    item.controls['benBank'].updateValueAndValidity();
    item.controls['benBankAccount'].setValidators([Validators.required]);
    item.controls['benBankAccount'].updateValueAndValidity();
    item.controls['cardDetails'].setValidators([Validators.required]);
    item.controls['cardDetails'].updateValueAndValidity();
    item.controls['region'].setValidators([Validators.required]);
    item.controls['region'].updateValueAndValidity();
    item.controls['paymentDetails'].setValidators([Validators.required]);
    item.controls['paymentDetails'].updateValueAndValidity();
  }

  clearValidityIfNew(item) {
    item.controls['reference'].clearValidators();
    item.controls['reference'].updateValueAndValidity();
    item.controls['type'].clearValidators();
    item.controls['type'].updateValueAndValidity();
    item.controls['cNumber'].clearValidators();
    item.controls['cNumber'].disable();
    item.controls['cNumber'].updateValueAndValidity();
    item.controls['cAddress'].clearValidators();
    item.controls['cAddress'].updateValueAndValidity();
    item.controls['cPhoneNumber'].clearValidators();
    item.controls['cPhoneNumber'].updateValueAndValidity();
    item.controls['transferAmount'].clearValidators();
    item.controls['transferAmount'].updateValueAndValidity();
    item.controls['transferCurrency'].clearValidators();
    item.controls['transferCurrency'].updateValueAndValidity();
    item.controls['benBank'].clearValidators();
    item.controls['benBank'].updateValueAndValidity();
    item.controls['benBankAccount'].clearValidators();
    item.controls['benBankAccount'].updateValueAndValidity();
    item.controls['cardDetails'].clearValidators();
    item.controls['cardDetails'].updateValueAndValidity();
    item.controls['region'].clearValidators();
    item.controls['region'].updateValueAndValidity();
    item.controls['paymentDetails'].clearValidators();
    item.controls['paymentDetails'].updateValueAndValidity();
  }


}

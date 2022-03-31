import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Transaction } from "../model/model";
import { data } from "../../assets/json/transaction.json"

@Injectable({ providedIn: 'root' })
export class TransactionService {
   constructor(private http: HttpClient) {

      this.fillTransactionStorage();
   }

   fillTransactionStorage() {
      localStorage.setItem("EXISTING_TRANSACITONS", JSON.stringify(data.transactions));
      localStorage.setItem("lastSequence", "" + data.transactions.length);
   }


   saveTransaction(trans: Transaction[]): Observable<any> {
      let existingTrans: Transaction[] = JSON.parse(localStorage.getItem("EXISTING_TRANSACITONS"));
      existingTrans = existingTrans.concat(trans);
      localStorage.setItem("EXISTING_TRANSACITONS", JSON.stringify(existingTrans));
      return of({});
   }

   getAllTransactions() : Observable<Transaction[]> {
      let existingTrans: Transaction[] = JSON.parse(localStorage.getItem("EXISTING_TRANSACITONS"));
      return of(existingTrans);
   }

}
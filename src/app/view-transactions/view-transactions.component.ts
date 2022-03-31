import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction, TransCustomer } from '../model/model';
import { TransactionService } from '../services/transaction.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.scss']
})
export class ViewTransactionsComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['cName', 'transferAmount', 'transferCurrency', 'reference'];

  public dataSource = new MatTableDataSource<TransCustomer>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private transService: TransactionService) { }

  ngOnInit(): void {
    this.getAllTransactions();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllTransactions() {
    this.transService.getAllTransactions().subscribe(data => {
      let transCustArr: TransCustomer[] = [];
      data.forEach(element => {
        transCustArr.push({
          cName: element.custInfo.cName,
          reference: element.reference,
          transferAmount: element.transferAmount,
          transferCurrency: element.transferCurrency
        });
      });
      this.dataSource.data = transCustArr;
    });
  }

}

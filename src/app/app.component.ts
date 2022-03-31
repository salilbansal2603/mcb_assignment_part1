import { Component } from '@angular/core';
import { User } from './model/model';
import { AuthenticationService } from './services/authentication.service';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'transaction-app';
  user: User;

  constructor(private authenticationService: AuthenticationService,
    private transactionService: TransactionService) {
      this.authenticationService.user.subscribe(x => this.user = x);
  }

}

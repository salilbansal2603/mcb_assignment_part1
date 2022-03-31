import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './interceptor/auth.guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MultiTransactionFormComponent } from './multi-transaction-form/multi-transaction-form.component';
import { NewTransactionFormComponent } from './new-transaction-form/new-transaction-form.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  /*{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },*/
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path:'new-transaction',
    component: NewTransactionFormComponent
  },
  {
    path: 'view-transaction',
    component: ViewTransactionsComponent
  },
  {
    path: 'multiForm',
    component: MultiTransactionFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ROLE_ADMIN"] }
  },
  {
    path: 'profile',
    component: ProfileComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

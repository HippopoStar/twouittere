import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLogInComponent } from './auth-log_in/auth-log_in.component';
import { AuthSignInComponent } from './auth-sign_in/auth-sign_in.component';

const routes: Routes = [
  {
    path: 'log_in',
    component: AuthLogInComponent,
    outlet: 'authLogIn'
  },
  {
    path: 'sign_in',
    component: AuthSignInComponent,
    outlet: 'authSignIn'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

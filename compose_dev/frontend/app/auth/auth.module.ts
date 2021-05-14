import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { AuthLogInComponent } from './auth-log_in/auth-log_in.component';
import { AuthSignInComponent } from './auth-sign_in/auth-sign_in.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    AuthComponent,
    AuthLogInComponent,
    AuthSignInComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
  ],
  exports: [AuthComponent],
  providers: [],
  bootstrap: [AuthComponent]
})
export class AuthModule { }

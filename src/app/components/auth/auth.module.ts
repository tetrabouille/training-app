import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { SharedModule } from 'app/shared.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [SharedModule, ReactiveFormsModule, SharedComponentsModule],
  exports: [],
})
export class AuthModule {}

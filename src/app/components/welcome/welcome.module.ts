import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared.module';

import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [SharedModule],
  exports: [],
})
export class WelcomeModule {}

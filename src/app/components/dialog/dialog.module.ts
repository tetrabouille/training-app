import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared.module';

import { ValidationComponent } from './validation/validation.component';

@NgModule({
  declarations: [ValidationComponent],
  imports: [SharedModule],
  exports: [],
})
export class DialogModule {}

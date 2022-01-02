import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'app/material.module';

import { ValidationComponent } from './validation.component';

@NgModule({
  declarations: [ValidationComponent],
  imports: [CommonModule, MaterialModule],
  exports: [],
})
export class DialogModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'app/material.module';

import { LoadingButtonComponent } from './loading-button/loading-button.component';

@NgModule({
  declarations: [LoadingButtonComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingButtonComponent],
})
export class SharedComponentsModule {}

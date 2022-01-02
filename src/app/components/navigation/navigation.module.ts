import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'app/app-routing.module';

import { MaterialModule } from 'app/material.module';

import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [HeaderComponent, SidenavListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    MaterialModule,
  ],
  exports: [HeaderComponent, SidenavListComponent],
})
export class NavigationModule {}

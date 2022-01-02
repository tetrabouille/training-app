import { NgModule } from '@angular/core';

import { AppRoutingModule } from 'app/app-routing.module';
import { SharedModule } from 'app/shared.module';

import { HeaderComponent } from './header/header.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [HeaderComponent, SidenavListComponent],
  imports: [SharedModule, AppRoutingModule],
  exports: [HeaderComponent, SidenavListComponent],
})
export class NavigationModule {}

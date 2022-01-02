import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';

import { AuthModule } from '@components/auth/auth.module';
import { TrainingModule } from '@components/training/training.module';
import { NavigationModule } from '@components/navigation/navigation.module';
import { WelcomeModule } from '@components/welcome/welcome.module';
import { DialogModule } from '@components/dialog/dialog.module';
import { AppComponent } from '@components/app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { environment } from 'environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    MaterialModule,
    NavigationModule,
    AuthModule,
    TrainingModule,
    WelcomeModule,
    DialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

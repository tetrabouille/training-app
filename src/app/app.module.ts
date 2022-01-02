import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from '@components/auth/auth.module';

import { AppComponent } from './components/app.component';

import { environment } from 'environments/environment';
import { TrainingModule } from '@components/training/training.module';
import { NavigationModule } from '@components/navigation/navigation.module';
import { WelcomeModule } from '@components/welcome/welcome.module';
import { DialogModule } from '@components/dialog/validation/dialog.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NavigationModule,
    AuthModule,
    TrainingModule,
    WelcomeModule,
    DialogModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

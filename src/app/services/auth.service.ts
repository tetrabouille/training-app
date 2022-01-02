import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';

import { AuthData } from '@models/auth-data.model';
import { TrainingService } from '@services/training.service';
import { UiService } from '@services/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authChange = new Subject<boolean>();

  private isAuth = false;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  initAuthentication() {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        this.authChange.next(true);
        this.isAuth = true;
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelFireSubscription();
        this.authChange.next(false);
        this.isAuth = false;
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.fireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.displayMessage('User created');
      })
      .catch(() => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.displayMessage('Failed to create account');
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.fireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch(() => {
        this.uiService.loadingStateChanged.next(false);
        this.authChange.next(false);
        this.uiService.displayMessage('Failed to log in');
      });
  }

  logout() {
    this.fireAuth.signOut();
  }

  getIsAuth(): boolean {
    return this.isAuth;
  }
}

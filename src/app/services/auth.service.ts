import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subject } from 'rxjs';

import { User } from '@models/user.model';
import { AuthData } from '@models/auth-data.model';
import { TrainingService } from './training.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authChange = new Subject<boolean>();

  private isAuth = false;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService
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
    this.fireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((value) => {
        console.log('register success : ', value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.fireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((value) => {
        console.log('login success', value);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this.fireAuth.signOut();
  }

  getIsAuth(): boolean {
    return this.isAuth;
  }
}

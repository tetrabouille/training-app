import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { User } from '@models/user.model';
import { AuthData } from '@models/auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authChange = new Subject<boolean>();

  private user: User;

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(
        Math.random() * 10000 + new Date().getTime()
      ).toString(),
    };
    this.onAuth(true);
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(
        Math.random() * 10000 + new Date().getTime()
      ).toString(),
    };
    this.onAuth(true);
  }

  logout() {
    this.user = null;
    this.onAuth(false);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user != null;
  }

  private onAuth(isAuth) {
    this.authChange.next(isAuth);
    const to = isAuth ? '/training' : '/login';
    this.router.navigate([to]);
  }
}

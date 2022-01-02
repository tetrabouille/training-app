import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { UiService } from '@services/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public maxDate: Date | undefined;
  public loading = false;

  private loadingSub: Subscription;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (loading) => {
        this.loading = loading;
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }

  public onSubmit(form: NgForm) {
    const newUser = {};
    if (!form.valid) return;
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}

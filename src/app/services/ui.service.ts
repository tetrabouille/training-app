import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public loadingStateChanged = new BehaviorSubject<boolean>(false);

  constructor(private snackbar: MatSnackBar) {}

  displayMessage(message: string, action: string = null, duration = 3000) {
    this.snackbar.open(message, action, { duration });
  }
}

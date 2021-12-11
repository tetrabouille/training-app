import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuClick = new EventEmitter<void>();

  public isAuth = false;

  private authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.authChange.subscribe((isAuth) => {
      this.isAuth = isAuth;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}

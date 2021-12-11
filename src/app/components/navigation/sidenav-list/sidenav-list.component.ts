import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() linkClick = new EventEmitter<void>();

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

  onLinkClick(): void {
    this.linkClick.emit();
  }

  onLogout(): void {
    this.onLinkClick();
    this.authService.logout();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.sass'],
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      (authStatus) => (this.isAuth = authStatus)
    );
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}

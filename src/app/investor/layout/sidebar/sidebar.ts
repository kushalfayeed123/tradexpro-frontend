import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from '../../../auth/state/auth.actions';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive,],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
    readonly currentYear = new Date().getFullYear();
  private store = inject(Store);
  private notify = inject(NotificationService);


  
  async onLogout() {
    const confirmed = await this.notify.confirm(
      'Sign Out?',
      'You will need to enter your credentials to access your account again.',
      'Sign Out Now'
    );

    if (confirmed) {
      this.store.dispatch(new Logout());
    }
  }
}

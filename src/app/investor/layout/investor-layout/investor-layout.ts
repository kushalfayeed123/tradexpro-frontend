import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth/state/auth.state';

@Component({
  selector: 'app-investor-layout',
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './investor-layout.html',
  styleUrl: './investor-layout.css',
})
export class InvestorLayout {
  isSidebarOpen = false; // Controls mobile visibility
  private store = inject(Store);

  user$ = this.store.select(AuthState.user);


  getInitials(displayName: string): string {
    if (!displayName) return '??';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}

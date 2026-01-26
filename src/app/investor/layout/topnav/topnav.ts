import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth/state/auth.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topnav',
  imports: [CommonModule],
  templateUrl: './topnav.html',
  styleUrl: './topnav.css',
})
export class Topnav {
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

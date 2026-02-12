import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from './common/components/toast/toast';
import { Store } from '@ngxs/store';
import { AuthState } from './auth/state/auth.state';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InitializeAuth } from './auth/state/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,           // ✅ REQUIRED
  imports: [RouterOutlet, Toast, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ProsperaFinWealth';
  private store = inject(Store);
  private router = inject(Router);
  // Reactive loading state for the entire app
  isLoading$ = this.store.select(AuthState.isLoading);
  showLoading = false;


  ngOnInit() {
    const currentPath = window.location.pathname;
    if (currentPath !== '/home') {
      this.showLoading = true;
    }
    // 1. Rehydrate user data from server
    this.store.dispatch(new InitializeAuth()).subscribe(() => {
      const user = this.store.selectSnapshot(AuthState.user);

      if (user) {
        // 2. Only redirect IF the user is currently on the login or home page

        if (currentPath === '/login') {
          const dashboard = user.role === 'admin' ? '/admin/dashboard' : '/investor/dashboard';
          this.router.navigate([dashboard]);
        } else {
          this.router.navigate([currentPath]);
        }

      }
    });
  }
}

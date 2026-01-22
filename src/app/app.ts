import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  protected title = 'topequity5';
  private store = inject(Store);
  // Reactive loading state for the entire app
  isLoading$ = this.store.select(AuthState.isLoading);


  ngOnInit() {
    this.store.dispatch(new InitializeAuth());
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login, SetLoading } from './state/auth.actions';
import { AuthState } from './state/auth.state';
import { AuthApiService } from '../core/services/auth.service';
import { UiService } from '../core/services/ui.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthApiService);
  public ui = inject(UiService);
  public notify = inject(NotificationService);

  mode: 'login' | 'register' = 'login';
  isLoading$ = this.store.select(AuthState.isLoading);

  formData = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    referralCode: '',
  };

  async handleLogin() {
    this.store.dispatch(new SetLoading(true));
    try {
      const credentials = {
        email: this.formData.email,
        password: this.formData.password
      };

      const result = await this.authService.signIn(credentials);

      // Direct Login (Verification check removed)
      this.store.dispatch(new Login(result));
      this.notify.show(`Welcome back, ${result.user?.profile?.first_name}!`, 'success');

      this.navigateToDashboard(result.user.role);

    } catch (error: any) {
      this.notify.show(error.error?.message || 'Login failed', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  async handleRegister() {
    this.store.dispatch(new SetLoading(true));
    try {
      // 1. Sign up user
      const result = await this.authService.signUp(this.formData);
      
      // 2. Automatically log them in after registration
      this.store.dispatch(new Login(result));
      this.notify.show('Account created successfully!', 'success');
      
      this.navigateToDashboard(result.user.role);
    } catch (error: any) {
      this.notify.show(error.error?.message || 'Registration failed', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  private navigateToDashboard(role: string) {
    this.router.navigate([
      role === 'admin' ? '/admin/dashboard' : '/investor/dashboard'
    ]);
  }

  switchMode(newMode: 'login' | 'register') {
    this.mode = newMode;
  }
}
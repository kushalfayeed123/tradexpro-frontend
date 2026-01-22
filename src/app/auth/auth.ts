import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login, SetLoading, } from './state/auth.actions';
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

  mode: 'login' | 'register' | 'verify' = 'login';
  isLoading$ = this.store.select(AuthState.isLoading);

  formData = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    otp: ['', '', '', '', '', '']
  };

  // Inside auth.ts
  async handleLogin() {
    this.store.dispatch(new SetLoading(true));
    try {
      const credentials = {
        email: this.formData.email,
        password: this.formData.password
      };
      const result = await this.authService.signIn(credentials);
      this.store.dispatch(new Login(result));

      // SUCCESS NOTIFICATION
      this.notify.show(`Welcome back, ${result.user?.profile?.first_name}!`, 'success');

      this.router.navigate([result.user.role === 'admin' ? '/admin/dashboard' : '/investor/dashboard']);
    } catch (error: any) {
      // ERROR NOTIFICATION
      this.notify.show(error.error?.message || 'Login failed', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  switchMode(newMode: 'login' | 'register' | 'verify') {
    this.mode = newMode;
  }

  async handleRegister() {
    this.store.dispatch(new SetLoading(true));
    try {
      // Send the full formData for registration
      await this.authService.signUp(this.formData);
      this.notify.show('Account created! Please verify your email.', 'success');
      this.mode = 'verify'; // Switch to OTP mode
    } catch (error: any) {
      this.notify.show(error.error?.message || 'Registration failed', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  // Auto-focus next input for OTP
  onOtpInput(event: any, index: number) {
    const val = event.target.value;
    if (val && index < 5) {
      const nextInput = event.target.parentElement.nextElementSibling?.querySelector('input');
      nextInput?.focus();
    }
  }

  handleVerify() {
    const fullCode = this.formData.otp.join('');
    console.log("Verifying code:", fullCode);
    // Redirect to dashboard on success
  }


}

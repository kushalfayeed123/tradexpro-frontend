import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login, SetLoading, VerifyOtp, } from './state/auth.actions';
import { AuthState } from './state/auth.state';
import { AuthApiService } from '../core/services/auth.service';
import { UiService } from '../core/services/ui.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { lastValueFrom } from 'rxjs';

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

  timerDisplay: string = '10:00';
  canResend: boolean = false;
  private timerInterval: any;

  mode: 'login' | 'register' | 'verify' = 'login';
  isLoading$ = this.store.select(AuthState.isLoading);
  currentUserId: string | null = null; // Stores ID from registration for verification

  formData = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    referralCode: '', // Add this line
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

      // 1. Check if the user is verified
      if (!result.user.is_verified) {
        this.currentUserId = result.user.id; // Store ID for OTP verification
        await this.authService.resendOtp(result.user.id, result.user.email, result.user.profile?.phone ?? '')
        this.notify.show('Please verify your account to continue.', 'warning');
        this.mode = 'verify';
        this.startOtpTimer(); // Optional: trigger a new timer or let them click resend
        return; // Stop here, do not navigate to dashboard
      }

      // 2. If verified, proceed normally
      this.store.dispatch(new Login(result));
      this.notify.show(`Welcome back, ${result.user?.profile?.first_name}!`, 'success');

      this.router.navigate([
        result.user.role === 'admin' ? '/admin/dashboard' : '/investor/dashboard'
      ]);

    } catch (error: any) {
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
  
      const result = await this.authService.signUp(this.formData);
      this.currentUserId = result.userId;
      this.notify.show('Account created! Please verify your email.', 'success');
      this.mode = 'verify';
      this.startOtpTimer();
    } catch (error: any) {
      this.notify.show(error.error?.message || 'Registration failed', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  async handleResendOtp() {

    this.store.dispatch(new SetLoading(true));
    try {
      if (this.currentUserId)
        await this.authService.resendOtp(this.currentUserId, this.formData.email, this.formData.phone);
      this.notify.show('A new code has been sent!', 'success');
      this.startOtpTimer();// Restart the 10m countdown
    } catch (err) {
      this.notify.show('Failed to resend code.', 'error');
    } finally {
      this.store.dispatch(new SetLoading(false));
    }
  }

  startOtpTimer() {
    this.canResend = false;
    let secondsLeft = 600; // 10 minutes

    // Clear any existing timer to prevent duplicates
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      secondsLeft--;
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;

      // Update the string display
      this.timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      if (secondsLeft <= 0) {
        clearInterval(this.timerInterval);
        this.canResend = true;
        this.timerDisplay = '0:00';
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  async handleVerify() {
    const fullCode = this.formData.otp.join('');
    if (fullCode.length < 6) {
      this.notify.show('Please enter the full 6-digit code', 'warning');
      return;
    }

    if (!this.currentUserId) {
      this.notify.show('Session error. Please register again.', 'error');
      this.mode = 'register';
      return;
    }

    try {
      // Dispatching to NGXS State
      await lastValueFrom(this.store.dispatch(new VerifyOtp(fullCode, this.currentUserId)));

      this.notify.show('Verification successful! Please log in.', 'success');
      this.mode = 'login';
      this.formData.otp = ['', '', '', '', '', '']; // Reset OTP slots
    } catch (error: any) {
      this.notify.show(error.error?.message || 'Invalid verification code', 'error');
    }
  }

  // OTP Auto-focus and Backspace handling
  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value && index < 5) {
      // Move to next input
      const nextSibling = input.parentElement.nextElementSibling?.querySelector('input');
      nextSibling?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.formData.otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevSibling = (event.target as HTMLElement).parentElement?.previousElementSibling?.querySelector('input');
      prevSibling?.focus();
    }
  }



}

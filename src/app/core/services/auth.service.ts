import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LoginResponse, User } from '../../common/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://topequity5-api.onrender.com/api'; // Replace with your URL

  /**
   * Performs a two-step login:
   * 1. Authenticates credentials to get JWT
   * 2. Fetches full user profile including role and wallet
   */
  async signIn(credentials: { email: string; password: string }): Promise<{ token: string; user: User }> {
    // Step 1: Login
    const loginData = await lastValueFrom(
      this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
    );

    const token = loginData.access_token;

    // Step 2: Fetch "Me" details using the token obtained
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const userProfile = await lastValueFrom(
      this.http.get<User>(`${this.API_URL}/users/me`, { headers })
    );

    return {
      token: token,
      user: userProfile
    };
  }

  /**
   * Optional: Verify OTP after registration
   */
  async verifyOtp(email: string, code: string) {
    return lastValueFrom(
      this.http.post(`${this.API_URL}/auth/verify`, { email, code })
    );
  }


  async signUp(userData: any) {
    // We remove OTP from registration payload if the API doesn't expect it yet
    const { otp, ...payload } = userData;
    return lastValueFrom(
      this.http.post(`${this.API_URL}/auth/register`, payload)
    );
  }

  async checkSession(): Promise<{ user: User }> {
    const user = await lastValueFrom(
      this.http.get<User>(`${this.API_URL}/users/me`)
    );
    return { user };
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LoginResponse, User } from '../../common/models/user.model';
import { environment } from '../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
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
  async verifyOtp(userId: string, code: string) {
    return lastValueFrom(
      this.http.post<{ success: boolean, message: string }>(
        `${this.API_URL}/auth/verify`,
        { 'userId': userId, 'code': code, } // Backend expects these keys
      )
    );
  }

  async resendOtp(userId: string, email: string, phone: string) {

    try {
      await lastValueFrom(
        this.http.post(`${this.API_URL}/notifications/otp/request`, {
          userId: userId,
          email,
          phone,
          type: 'verification',
        })
      );
    } catch (e) {
      console.error('Email OTP failed:', e);
    }




  }


  async signUp(userData: any): Promise<any> {
    // We remove OTP from registration payload if the API doesn't expect it yet
    const payload = {
      email: userData.email,
      password: userData.password,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      country: 'USA', // Add a default or bind to UI
      referralCode: userData.referralCode

    }; return lastValueFrom(
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
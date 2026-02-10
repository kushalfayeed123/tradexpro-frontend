import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReferralStats {
  referralCode: string;
  totalEarned: number;
  pendingCount: number;
  successfulCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/promotions`;

  /**
   * Fetches referral statistics for the current user
   */
  getReferralStats(userId: string): Observable<ReferralStats> {
    return this.http.get<ReferralStats>(`${this.baseUrl}/referral-stats/${userId}`);
  }

  /**
   * Validates a coupon code during the investment checkout process
   */
  validateCoupon(code: string, investmentAmount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/coupons/validate`, { code, amount: investmentAmount });
  }
}
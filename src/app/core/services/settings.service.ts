import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DepositMethod {
  id?: string;
  asset_name: string;
  network?: string;
  wallet_address: string;
  instructions?: string;
  is_active: boolean;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  // Get all methods for Admin table
  getAllMethods(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createMethod(data: Partial<DepositMethod>): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateMethod(id: string, data: Partial<DepositMethod>): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  deleteMethod(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
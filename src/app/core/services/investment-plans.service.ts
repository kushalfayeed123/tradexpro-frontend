import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvestmentPlansService {
    private http = inject(HttpClient);
private readonly API_URL = environment.apiUrl;
    /**
     * Fetch all plans (Backend uses Supabase .select('*'))
     */
    findAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/investment-plans`);
    }

    /**
     * Get a specific plan by ID
     */
    findOne(id: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/investment-plans/${id}`);
    }

    /**
     * Create a new plan + ledger account
     */
    create(plan: any): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/investment-plans`, plan);
    }

    /**
     * Update plan parameters or status
     */
    update(id: string, plan: any): Observable<any> {
        return this.http.patch<any>(`${this.API_URL}/investment-plans/${id}`, plan);
    }

    /**
     * Delete a plan (if allowed by your business logic)
     */
    delete(id: string): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/investment-plans/${id}`);
    }
}
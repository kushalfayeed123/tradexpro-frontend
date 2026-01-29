import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KycService {
    private readonly baseUrl = `${environment.apiUrl}/kyc`;

    constructor(private http: HttpClient) { }

    getUserKyc(): Observable<any> {
        return this.http.get(`${this.baseUrl}/me`);
    }

    initiateKyc(level: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/initiate`, { level });
    }

    uploadDocument(kycId: string, file: File): Observable<{ path: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ path: string }>(`${this.baseUrl}/${kycId}/upload`, formData);
    }

    submitKyc(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/submit`, payload);
    }

    // Add this to your existing KycService
    getKycDocument(path: string): Observable<{ url: string }> {
        return this.http.get<{ url: string }>(`${this.baseUrl}/document`, {
            params: { path }
        });
    }// Add to KycService
    getAllPendingKycs(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/pending`);
    }

    // Add to KycService
    reviewKyc(kycId: string, decision: 'approved' | 'rejected', rejection_reason?: string): Observable<any> {
        const dto = {
            decision,
            ...(rejection_reason && { rejection_reason })
        };
        return this.http.post(`${this.baseUrl}/admin/${kycId}/review`, dto);
    }

    getDocumentUrl(path: string): Observable<{ url: string }> {
        return this.http.get<{ url: string }>(`${this.baseUrl}/document`, {
            params: { path }
        });
    }
}
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private http = inject(HttpClient);
    private readonly API_URL = 'https://topequity5-api.onrender.com/api'; // Replace with your URL


    getTransactions(params: any): Observable<any> {
        return this.http.get(`${this.API_URL}/admin/transactions`, { params });
    }

    getStats(): Observable<any> {
        return this.http.get(`${this.API_URL}/admin/transactions/stats`);
    }

    approveTransaction(id: string): Observable<any> {
        return this.http.post(`${this.API_URL}/admin/transactions/${id}/approve`, {});

    }
    reverseTransaction(id: string): Observable<any> {
        return this.http.post(`${this.API_URL}/admin/transactions/${id}/reverse`, {});

    }
    rejectTransaction(id: string,): Observable<any> {
        return this.http.post(`${this.API_URL}/admin/transactions/${id}/reject`, {});

    }
}
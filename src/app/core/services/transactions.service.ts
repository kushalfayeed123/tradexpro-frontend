import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export interface UpdateBalanceDto {
    amount: number;
    description: string;
    userId: string;
}

export interface CreateTransactionDto {
    amount: number;
    type: 'deposit' | 'withdrawal' | 'investment';
    reference: string;
    description: string;
    wallet_id: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
    private http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

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

    createTransaction(dto: CreateTransactionDto): Observable<any> {
        return this.http.post(`${this.API_URL}/transactions`, dto);
    }

    getInvestorTransactions(params: any): Observable<any> {
        return this.http.get(`${this.API_URL}/transactions`, { params });
    }

    updateUserBalance(dto: UpdateBalanceDto): Observable<any> {
        return this.http.post(`${this.API_URL}/admin/transactions/update-balance`, dto)
    }

}
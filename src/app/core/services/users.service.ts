import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../../common/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersApiService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/api'; // Replace with your URL


    async fetchAll(params: any = {}): Promise<any> {
        // HttpClient's 'params' option automatically handles the URL encoding
        // e.g., it converts { email: 'test' } to ?email=test
        return lastValueFrom(
            this.http.get(`${this.API_URL}/users`, { params })
        );
    }

    async fetchOne(userId: string): Promise<{ user: User }> {
        const user = await lastValueFrom(
            this.http.get<User>(`${this.API_URL}/user/${userId}`)
        );
        return { user };
    }
}
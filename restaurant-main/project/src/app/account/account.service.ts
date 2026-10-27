import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7083/api/user';

  updateAccount(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-user`, payload, { responseType: 'text' });
  }

  deleteAccount(payload: any): Observable<any> {
    return this.http.request('post', `${this.apiUrl}/delete-user`, { body: payload, responseType: 'text' });
  }

  // Added Admin Delete Method
  adminDeleteUser(payload: { adminEmail: string; adminPassword: string; userId: number }): Observable<any> {
    return this.http.request('post', `${this.apiUrl}/admin-delete-user`, { body: payload, responseType: 'text' });
  }
}
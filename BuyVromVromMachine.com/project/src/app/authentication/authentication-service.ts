import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IAuthTokens, ILogIn, IRegister, AuthResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7083/api/User';

  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  signUp(data: IRegister): Observable<any> {
    // Crucial fix: tells Angular to expect plain text instead of JSON
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' });
  }

  verifyCode(data: { email: string; code: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, data, { responseType: 'text' });
  }

  signIn(data: ILogIn): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        const token = res.token || res.access_token;
        if (token) {
          this.saveTokens({ access_token: token });
        }
      })
    );
  }

  saveTokens(tokens: IAuthTokens): void {
    const tokenToSave = tokens.access_token || tokens.token;
    if (tokenToSave) {
      localStorage.setItem('token', tokenToSave);
      localStorage.setItem('access_token', tokenToSave);
    }
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
    this.loggedInSubject.next(true);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token') || localStorage.getItem('access_token');
  }

  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
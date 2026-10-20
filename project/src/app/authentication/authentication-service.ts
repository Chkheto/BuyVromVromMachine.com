import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { IAuthTokens, ILogIn, IRegister } from './interfaces'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient)

  private readonly ACCESS_TOKEN_KEY = 'everrest_access_token'
  private readonly REFRESH_TOKEN_KEY = 'everrest_refresh_token'

  public isLoggedIn$ = new BehaviorSubject<boolean>(!!this.getAccessToken())

  signUp(registrationData: any) {
    return this.http.post('https://api.everrest.educata.dev/auth/sign_up', registrationData)
  }

  signIn(logInData: any) {
    return this.http.post<any>('https://api.everrest.educata.dev/auth/sign_in', logInData).pipe(
      map((resp: any) => {
        // try to extract access + refresh tokens from a number of possible shapes
        const access = resp?.access_token || resp?.accessToken || resp?.token || resp?.data?.access_token || resp?.data?.accessToken
        const refresh = resp?.refresh_token || resp?.refreshToken || resp?.data?.refresh_token || resp?.data?.refreshToken

        if (access) {
          return { access_token: access, refresh_token: refresh || '' }
        }

        // If no tokens found, return the original response so the caller can inspect errors/messages
        return resp
      })
    )
  }


  saveTokens(tokens: IAuthTokens) {
    const access = (tokens as any).access_token || (tokens as any).accessToken || ''
    const refresh = (tokens as any).refresh_token || (tokens as any).refreshToken || ''
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh)
    this.isLoggedIn$.next(true)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }
  

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    this.isLoggedIn$.next(false)
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  getCurrentUser() {
    let token = this.getAccessToken()
    let headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      accept: 'application/json',
    })

    return this.http.get('https://api.everrest.educata.dev/auth', { headers })
  }
}

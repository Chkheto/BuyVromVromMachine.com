import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '../authentication/authentication-service'
import { IAuthTokens, ILogIn } from '../authentication/interfaces'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit {
  signInForm!: FormGroup
  errorMessage = ''

  private fb = inject(FormBuilder)
  private authService = inject(AuthenticationService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

    let email = this.route.snapshot.queryParamMap.get('email')
    if (email) this.signInForm.patchValue({ email })
  }

  signIn(): void {
    this.errorMessage = ''

    if (!this.signInForm.valid) {
      this.signInForm.markAllAsTouched()
      return
    }

    let loginData: ILogIn = {
      email: (this.signInForm.value.email || '').trim(),
      password: this.signInForm.value.password || '',
    }

    console.log('SIGN IN payload:', loginData)

    this.authService.signIn(loginData).subscribe({
      next: (resp: any) => {

        console.log('SIGN IN response:', resp)

        const access = resp?.access_token || resp?.accessToken || resp?.token || resp?.data?.access_token || resp?.data?.accessToken
        const refresh = resp?.refresh_token || resp?.refreshToken || resp?.data?.refresh_token || resp?.data?.refreshToken

        if (!access) {
          console.error('Token response missing expected fields:', resp)
          const serverMsg = resp?.message || resp?.error || resp?.detail || resp?.error_description
          this.errorMessage = serverMsg || 'Login failed: token was not returned by the server.'
          return
        }

        const tokensToSave = { access_token: access, refresh_token: refresh || '' }
        this.authService.saveTokens(tokensToSave)

        console.log('Saved access token:', this.authService.getAccessToken())

        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home'
        this.router.navigate([returnUrl])
      },
      error: (err) => {
        console.error('Sign in failed:', err)
        console.error('Backend payload:', err?.error)
        console.error('Error keys:', err?.error?.errorKeys)

        // surface common server error messages if present
        const serverMsg = err?.error?.message || err?.error?.error || err?.message || (err?.error && JSON.stringify(err.error))
        if (serverMsg?.toString()?.includes('Invalid')) {
          this.errorMessage = 'Invalid email or password.'
          return
        }

        this.errorMessage = serverMsg || 'Sign in failed. Please try again.'
      },
    })
  }
}

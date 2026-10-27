import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '../authentication/authentication-service'
import { ILogIn } from '../authentication/interfaces'
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

        // Backend returns the User object directly (e.g. id, email, role) instead of a token
        if (!resp || (!resp.id && !resp.email)) {
          console.error('Login response missing expected user fields:', resp)
          const serverMsg = resp?.message || resp?.error || resp?.detail
          this.errorMessage = serverMsg || 'Login failed: user data was not returned by the server.'
          return
        }

        // Save the user profile to localStorage to track the active session
        localStorage.setItem('currentUser', JSON.stringify(resp))

        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home'
        this.router.navigate([returnUrl])
      },
      error: (err) => {
        console.error('Sign in failed:', err)
        console.error('Backend payload:', err?.error)

        const serverMsg = err?.error?.message || err?.error?.error || err?.message || (err?.error && JSON.stringify(err.error))
        if (serverMsg?.toString()?.includes('Invalid') || err.status === 400 || err.status === 404 || err.status === 401) {
          this.errorMessage = 'Invalid email or password.'
          return
        }

        this.errorMessage = serverMsg || 'Sign in failed. Please try again.'
      },
    })
  }
}
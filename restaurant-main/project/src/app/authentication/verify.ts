import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from './authentication-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="verify-container">
      <div class="verify-card">
        <h2>Verify Your Account</h2>
        <p>Enter the 6-digit verification code sent to your email.</p>

        <form [formGroup]="verifyForm" (ngSubmit)="verifyCode()">
          <div class="form-group">
            <input 
              type="text" 
              formControlName="code" 
              placeholder="123456" 
              maxlength="6" 
            />
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" [disabled]="verifyForm.invalid">Verify Code</button>
        </form>
      </div>
    </div>
  `,
})
export class VerifyComponent implements OnInit {
  verifyForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  verifyCode() {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      this.errorMessage = 'No pending verification email found. Please register again.';
      return;
    }

    const payload = {
      email: email,
      code: this.verifyForm.value.code
    };

    this.authService.verifyCode(payload).subscribe({
      next: () => {
        this.successMessage = 'Account verified successfully! Redirecting...';
        localStorage.removeItem('pendingVerificationEmail');
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 1500);
      },
      error: (err) => {
        console.error('Verification failed:', err);
        this.errorMessage = err?.error || 'Invalid or expired code. Please try again.';
      }
    });
  }
}
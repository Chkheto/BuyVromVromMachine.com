import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthenticationService } from './authentication-service'
import { IRegister } from './interfaces'
import { RouterLink, Router } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss',
})
export class Authentication implements OnInit {
  registerForm!: FormGroup
  verifyForm!: FormGroup
  
  isVerifying = false; // Toggle to show verification screen
  errorMessage = ''
  successMessage = ''
  registeredEmail = ''

  private router = inject(Router)
  private formBuilder = inject(FormBuilder)
  private authenticationService = inject(AuthenticationService)
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [18, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: ['somewhere', [Validators.required]],
      phone: ['+995599123456', [Validators.required]],
      gender: ['MALE', [Validators.required]],
      isSeller: [false] // <-- Added seller control defaulting to false
    });

    this.verifyForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  register() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched()
      return;
    }

    const formVal = this.registerForm.value;
    this.registeredEmail = formVal.email; // Save the email for the verify screen

    let registerData: any = {
      ...formVal,
      zipcode: '0178',
      fullName: `${formVal.firstName} ${formVal.lastName}`,
      Fullname: `${formVal.firstName} ${formVal.lastName}`,
      PhoneNumber: formVal.phone,
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + formVal.firstName,
    }

    this.authenticationService.signUp(registerData).subscribe({
      next: () => {
        console.log('Registration successful, code sent to email.');
        this.errorMessage = '';
        this.isVerifying = true; // <-- THIS JUST SWITCHES THE SCREEN LOCALLY! No routing!
      },
      error: (err) => {
        console.error('Sign up failed:', err)
        this.errorMessage = err?.error || 'Registration failed. Please check your inputs.';
      }
    });
  }

  verifyCode() {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.registeredEmail,
      code: this.verifyForm.value.code
    };

    this.authenticationService.verifyCode(payload).subscribe({
      next: () => {
        this.successMessage = 'Account verified successfully! Redirecting to sign in...';
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
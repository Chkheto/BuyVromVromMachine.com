import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthenticationService } from './authentication-service'
import { IAuthTokens, IRegister } from './interfaces'
import { RouterLink } from "@angular/router";
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'


@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss',
})
export class Authentication implements OnInit {
  registerForm!: FormGroup
  errorMessage = ''
  
  private router = inject(Router)
  private route = inject(ActivatedRoute)
 
  private formBuilder = inject(FormBuilder)
  private authenticationService = inject(AuthenticationService)
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [18, [Validators.required, Validators.min(1)]],
      email: ['isuckatchess@example.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: ['somewhere', [Validators.required]],
      phone: ['+995599123456', [Validators.required]],
      gender: ['MALE', [Validators.required]],
    })
  }

  register() {
    if (!this.registerForm.valid) {
      console.log('Form is invalid')
      this.registerForm.markAllAsTouched()
      return;
    
    }

    let registerData: IRegister & { avatar?: string } = {
      ...(this.registerForm.value as Omit<IRegister, 'zipcode'>),
      zipcode: '0178',
      avatar:
        'https://api.dicebear.com/7.x/pixel-art/svg?seed=' +
        this.registerForm.value.firstName,
    }

    this.authenticationService.signUp(registerData).subscribe({
      next: () => {
  let logInData = {
    email: this.registerForm.value.email,
    password: this.registerForm.value.password,
  }

  this.authenticationService.signIn(logInData).subscribe({
    next: (resp: any) => {
      const access = resp?.access_token || resp?.accessToken || resp?.token || resp?.data?.access_token || resp?.data?.accessToken
      const refresh = resp?.refresh_token || resp?.refreshToken || resp?.data?.refresh_token || resp?.data?.refreshToken

      if (!access) {
        console.error('Registration sign-in failed, no tokens:', resp)
        console.error('Server payload:', resp)
        return
      }

      this.authenticationService.saveTokens({ access_token: access, refresh_token: refresh || '' })
      this.router.navigate(['/home'])
    },
    error: (err) => {
      console.error('Registration failed:', err)
      console.error('Server payload:', err?.error)
      console.error('Error keys:', err?.error?.errorKeys)
    }
  })
}
    }) 
  }
}

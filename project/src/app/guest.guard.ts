import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthenticationService } from './authentication/authentication-service'

export let guestGuard: CanActivateFn = () => {
  let authService = inject(AuthenticationService)
  let router = inject(Router)

  let token = authService.getAccessToken()

  if (!token) return true

  router.navigate(['/home'])
  return false
}
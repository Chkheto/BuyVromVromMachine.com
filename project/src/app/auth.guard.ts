import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthenticationService } from './authentication/authentication-service'

export let authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthenticationService)
  let router = inject(Router)

  let token = authService.getAccessToken()

  if (token) return true

  router.navigate(['/authentication'], {
    queryParams: { returnUrl: state.url },
  })
  return false
}
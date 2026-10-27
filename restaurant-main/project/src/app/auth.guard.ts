import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if the user object exists in localStorage
  const currentUser = localStorage.getItem('currentUser');

  if (currentUser) {
    return true; // User is logged in, let them pass!
  }

  // Otherwise, redirect to authentication and preserve the returnUrl
  router.navigate(['/authentication'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
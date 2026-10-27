import { Routes } from '@angular/router'
import { Home } from './home/home'
import { Menu } from './menu/menu'
import { AboutUs } from './about-us/about-us'
import { NotFound } from './not-found/not-found'
import { Authentication } from './authentication/authentication'
import { Cart } from './cart/cart'
import { Account } from './account/account'
import { AreYouSure } from './are-you-sure/are-you-sure'
import { SignIn } from './sign-in/sign-in'
import { UploadCarComponent } from './Upload-car/upload-car'
import { CarDetailComponent } from './car-detail/car-detail'
import { authGuard } from './auth.guard'
import { guestGuard } from './guest.guard'

export const routes: Routes = [
  { path: '', 
    redirectTo: '/authentication', 
    pathMatch: 'full'
  },

  { path: 'authentication', 
    component: Authentication, 
    canActivate: [guestGuard] 
  },
  {
  path: 'account',
  component: Account,
  canActivate: [authGuard]
},
    
  { path: 'home', component: Home },
  { path: 'about-us', 
    component: AboutUs 
  },
  {
    path: 'sign-in',
    component: SignIn
  },

  { path: 'menu', 
    component: Menu, 
    canActivate: [authGuard] 
  },
  { path: 'cart', 
    component: Cart, 
    canActivate: [authGuard] 
  },
  { path: 'are-you-sure', 
    component: AreYouSure, 
    canActivate: [authGuard] 
  },
  {
    path: 'upload-car',
    component: UploadCarComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'car/:id', 
    component: CarDetailComponent, 
    canActivate: [authGuard] 
  },

  { path: '**', 
    component: NotFound 
  },
]
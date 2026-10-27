import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLinkWithHref, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './authentication/authentication-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private routerSub: any;

  // Bulletproof getter checking both localStorage keys and your auth service
  get loggedIn(): boolean {
    const hasLocalStorageUser = !!localStorage.getItem('currentUser') || !!localStorage.getItem('token');
    return hasLocalStorageUser || this.authService.isAuthenticated();
  }

  // Dark Mode state
  isDarkMode = false;

  // Easter Egg state
  tractorMode = false;
  private typedBuffer: string = '';
  private targetWord: string = 'tractor';
  private keyListener = (event: KeyboardEvent) => this.handleKeyPress(event);

  ngOnInit() {
    window.addEventListener('keydown', this.keyListener);

    // Force UI refresh on every route change so the navbar updates instantly upon login/logout navigation
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyListener);
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    const key = event?.key;
    if (key) {
      this.typedBuffer += key.toLowerCase();

      if (this.typedBuffer.length > this.targetWord.length) {
        this.typedBuffer = this.typedBuffer.slice(-this.targetWord.length);
      }

      if (this.typedBuffer === this.targetWord) {
        this.triggerEasterEgg();
        this.typedBuffer = '';
      }
    }
  }

  triggerEasterEgg() {
    if (this.tractorMode) return;

    this.tractorMode = true;

    const audio = document.getElementById('tractor-audio') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.log('Audio play blocked:', err));
    }

    setTimeout(() => {
      this.tractorMode = false;
    }, 3000);
  }

  logout(): void {
    this.authService.clearTokens();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/authentication']);
  }
}
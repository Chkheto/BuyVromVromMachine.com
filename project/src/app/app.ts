import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './authentication/authentication-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  loggedIn = this.authService.isAuthenticated();

  // Dark Mode state
  isDarkMode = false;

  // Easter Egg state
  tractorMode = false;
  private typedBuffer: string = '';
  private targetWord: string = 'tractor';
  private keyListener = (event: KeyboardEvent) => this.handleKeyPress(event);

  constructor() {
    this.authService.isLoggedIn$.subscribe(v => (this.loggedIn = v));
  }

  ngOnInit() {
    window.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyListener);
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
    this.typedBuffer += event.key.toLowerCase();

    if (this.typedBuffer.length > this.targetWord.length) {
      this.typedBuffer = this.typedBuffer.slice(-this.targetWord.length);
    }

    if (this.typedBuffer === this.targetWord) {
      this.triggerEasterEgg();
      this.typedBuffer = '';
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
    this.router.navigate(['/authentication']);
  }
}
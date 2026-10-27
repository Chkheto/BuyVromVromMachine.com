import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { AuthenticationService } from '../authentication/authentication-service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.scss']
})
export class Account {
  private accountService = inject(AccountService);
  private authService = inject(AuthenticationService);
  private router = inject(Router);

  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  get isAdmin(): boolean {
    return this.currentUser.role === 'Admin' || 
           this.currentUser.Role === 'Admin' || 
           this.currentUser.isAdmin === true;
  }

  get currentUserId(): string | number | null {
    return this.currentUser.id || this.currentUser.Id || null;
  }
  
  // Editable profile fields
  editUsername = this.currentUser.username || this.currentUser.Username || '';
  editEmail = this.currentUser.email || this.currentUser.Email || '';
  editPassword = '';
  editIsSeller = this.currentUser.isSeller || this.currentUser.IsSeller || false;
  
  // Danger zone fields
  deletePassword = '';
  deleteCode = '';

  // Admin section fields
  targetUserId: number | null = null;
  adminPassword = '';
  adminSuccessMessage = '';
  adminErrorMessage = '';
  isDeletingUser = false;
  
  successMessage = '';
  errorMessage = '';
  isUpdating = false;
  isLoading = false;

  updateProfile(): void {
    if (!this.editPassword) {
      this.errorMessage = 'Please enter your current password to save changes.';
      return;
    }

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      email: this.currentUser.email || this.currentUser.Email,
      newUsername: this.editUsername,
      newEmail: this.editEmail,
      password: this.editPassword,
      isSeller: this.editIsSeller
    };

    this.accountService.updateAccount(payload).subscribe({
      next: () => {
        this.isUpdating = false;
        this.successMessage = 'Profile updated successfully!';
        this.currentUser.email = this.editEmail;
        this.currentUser.username = this.editUsername;
        this.currentUser.isSeller = this.editIsSeller;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.editPassword = '';
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        this.isUpdating = false;
        this.errorMessage = err?.error || 'Failed to update profile. Check your password.';
      }
    });
  }

  deleteAccount(): void {
    if (!this.deletePassword) {
      this.errorMessage = 'Please enter your password to confirm account deletion.';
      return;
    }

    if (confirm('Are you absolutely sure you want to delete your account?')) {
      this.isLoading = true;
      this.errorMessage = '';

      const payload = {
        email: this.currentUser.email || this.currentUser.Email,
        password: this.deletePassword,
        code: this.deleteCode || ''
      };

      this.accountService.deleteAccount(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.authService.clearTokens();
          localStorage.removeItem('currentUser');
          alert('Your account has been deleted successfully.');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Failed to delete account:', err);
          this.isLoading = false;
          this.errorMessage = err?.error || 'Failed to delete account.';
        }
      });
    }
  }

  adminDeleteUser(): void {
    if (!this.targetUserId || !this.adminPassword) {
      this.adminErrorMessage = 'Please provide both the Target User ID and your Admin Password.';
      return;
    }

    if (confirm(`Are you sure you want to delete user ID ${this.targetUserId}?`)) {
      this.isDeletingUser = true;
      this.adminErrorMessage = '';
      this.adminSuccessMessage = '';

      const payload = {
        adminEmail: this.currentUser.email || this.currentUser.Email,
        adminPassword: this.adminPassword,
        userId: Number(this.targetUserId)
      };

      this.accountService.adminDeleteUser(payload).subscribe({
        next: () => {
          this.isDeletingUser = false;
          this.adminSuccessMessage = `User ID ${this.targetUserId} deleted successfully.`;
          this.targetUserId = null;
          this.adminPassword = '';
        },
        error: (err) => {
          console.error('Admin delete failed:', err);
          this.isDeletingUser = false;
          this.adminErrorMessage = err?.error || 'Failed to delete user. Verify your admin password.';
        }
      });
    }
  }
}
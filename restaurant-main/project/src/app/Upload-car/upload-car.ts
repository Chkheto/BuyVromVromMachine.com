import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-car',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-car.html',
  styleUrl: './upload-car.scss'
})
export class UploadCarComponent implements OnInit {
  carForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  // File handling properties
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7083/api/car';

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.carForm = this.fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      mileage: ['', [Validators.required, Validators.min(0)]],
      fuelType: ['Petrol', [Validators.required]],
      transmission: ['Automatic', [Validators.required]],
      color: ['', [Validators.required]],
      imageUrl: [''],
      isAvailable: [true],
      sellerEmail: [currentUser?.email || '', [Validators.required, Validators.email]],
      sellerPassword: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    console.log('Form Valid?', this.carForm.valid);
    console.log('Form Values:', this.carForm.value);
    console.log('Invalid Controls:', this.findInvalidControlsRecursive(this.carForm));

    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    const formValues = this.carForm.value;

    Object.keys(formValues).forEach(key => {
      if (key !== 'imageUrl' && formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http.post(this.apiUrl, formData, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Car successfully uploaded to the marketplace!';
        setTimeout(() => {
          this.router.navigate(['/menu']);
        }, 1500);
      },
      error: (err) => {
        console.error('Failed to upload car:', err);
        this.isLoading = false;
        this.errorMessage = err?.error || 'Failed to upload car. Please check your credentials and inputs.';
      }
    });
  }

  private findInvalidControlsRecursive(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.invalid) {
        invalidControls.push(key);
      }
    });
    return invalidControls;
  }
}
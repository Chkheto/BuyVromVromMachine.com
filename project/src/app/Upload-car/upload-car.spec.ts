import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-car.html',
  styleUrl: './upload-car.scss'
})
export class UploadCarComponent {
  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Car uploaded!');
  }
}
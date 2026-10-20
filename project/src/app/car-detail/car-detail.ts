import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss'
})
export class CarDetailComponent implements OnInit {
  carId: string | null = null;
  selectedCar: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.carId = this.route.snapshot.paramMap.get('id');
    this.loadCarDetails(this.carId);
  }

  loadCarDetails(id: string | null) {
    // Mock lookup or service call using the GUID id
    // Example: this.selectedCar = this.carService.getById(id);
    console.log('Active car GUID:', id);
  }
}
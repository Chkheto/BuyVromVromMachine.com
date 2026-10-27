import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, Subscription } from 'rxjs';

export interface ICar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  sellerId?: number | string | null;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit, OnDestroy {
  cars: ICar[] = [];
  filteredCars: ICar[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // Filters
  brandFilter = '';
  fuelFilter = '';
  maxPrice: number | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7083/api/car';
  private routerSub!: Subscription;

  ngOnInit(): void {
    this.loadCars();

    // Re-fetch cars every time the user navigates back to this page
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadCars();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  getCarImage(car: ICar): string {
    if (car.imageUrl && car.imageUrl.trim() !== '') {
      if (car.imageUrl.startsWith('/')) {
        return `https://localhost:7083${car.imageUrl}`;
      }
      return car.imageUrl;
    }
    
    const uniqueCarImages = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80'
    ];

    let hash = 0;
    const safeId = car.id || 'default-car';
    for (let i = 0; i < safeId.length; i++) {
      hash = safeId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % uniqueCarImages.length;
    return uniqueCarImages[index];
  }

  loadCars(): void {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        const rawList = Array.isArray(res) ? res : (res?.items || []);
        
        // Map and normalize keys to handle both camelCase and C# PascalCase
        this.cars = rawList.map((car: any) => ({
          id: car.id || car.Id || Math.random().toString(),
          brand: car.brand || car.Brand || 'Unknown',
          model: car.model || car.Model || '',
          year: car.year || car.Year || 2024,
          price: car.price ?? car.Price ?? 0,
          mileage: car.mileage ?? car.Mileage ?? 0,
          fuelType: car.fuelType || car.FuelType || 'Petrol',
          transmission: car.transmission || car.Transmission || 'Automatic',
          color: car.color || car.Color || '',
          imageUrl: car.imageUrl || car.ImageUrl || null,
          isAvailable: car.isAvailable ?? car.IsAvailable ?? true,
          sellerId: car.sellerId || car.SellerId || null
        }));

        this.filteredCars = [...this.cars];
        this.isLoading = false;
        console.log('Processed Cars for Menu:', this.cars);
      },
      error: (err) => {
        console.error('Failed to load cars:', err);
        this.errorMessage = 'Could not load vehicle listings from the API.';
        this.isLoading = false;
      }
    });
  }

  filterCars(): void {
    this.filteredCars = this.cars.filter(car => {
      const matchBrand = !this.brandFilter || `${car.brand} ${car.model}`.toLowerCase().includes(this.brandFilter.toLowerCase());
      const matchFuel = !this.fuelFilter || car.fuelType === this.fuelFilter;
      const matchPrice = this.maxPrice === null || car.price <= this.maxPrice;
      return matchBrand && matchFuel && matchPrice;
    });
  }

  addToCart(car: ICar, buttonEl: EventTarget | null): void {
    const button = buttonEl as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    const cartKey = 'cart_cars';
    const existingCart: ICar[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (!existingCart.some(item => item.id === car.id)) {
      existingCart.push(car);
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
    }

    setTimeout(() => {
      if (button) {
        button.textContent = 'Added!';
        setTimeout(() => {
          button.textContent = 'Add to Cart';
          button.disabled = false;
        }, 1500);
      }
      this.successMessage = `${car.brand} ${car.model} added to your cart!`;
      setTimeout(() => this.successMessage = '', 3000);
    }, 400);
  }
}
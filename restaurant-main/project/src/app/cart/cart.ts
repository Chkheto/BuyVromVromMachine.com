import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ICar } from '../menu/menu';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  cartItems: ICar[] = [];
  private storageKey = 'cart_cars';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const data = localStorage.getItem(this.storageKey);
    this.cartItems = data ? JSON.parse(data) : [];
  }

  getCarImage(car: ICar): string {
    if (car.imageUrl && car.imageUrl.trim() !== '') {
      if (car.imageUrl.startsWith('/')) {
        return `https://localhost:7083${car.imageUrl}`;
      }
      return car.imageUrl;
    }
    
    // Fallback pool of unique car images
    const uniqueCarImages = [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
    ];

    let hash = 0;
    for (let i = 0; i < car.id.length; i++) {
      hash = car.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % uniqueCarImages.length;
    return uniqueCarImages[index];
  }

  removeItem(carId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== carId);
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    this.cartItems = [];
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, car) => total + car.price, 0);
  }

  checkout(): void {
    window.alert('Checkout feature coming soon!');
  }
}
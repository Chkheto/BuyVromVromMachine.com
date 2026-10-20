import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MenuService, BasketItem } from '../menu/menu-service'

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private menuService = inject(MenuService)

  basket: BasketItem[] = []

  ngOnInit(): void {
    this.loadBasket()
  }

  loadBasket() {
    this.menuService.getBasket().subscribe({
      next: (data) => {
        this.basket = Array.isArray(data) ? data : []
      },
      error: (err) => {
        console.error(err)
        this.basket = []
      },
    })
  }

  removeFromCart(basketItemId: number) {
    this.menuService.deleteBasketItem(basketItemId).subscribe({
      next: () => this.loadBasket(),
      error: (err) => {
        console.error(err)
        alert('Failed to remove item')
      },
    })
  }
}

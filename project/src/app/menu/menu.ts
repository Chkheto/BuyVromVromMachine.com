import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MenuService, ProductDto } from './menu-service'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {

  

  private menuService = inject(MenuService)

  products: ProductDto[] = []

  vegetarianFilter: string = ''
  nutsFilter: string = ''
  spicinessFilter: number | null = null

  ngOnInit(): void {
    this.showProducts()
  }

  showProducts() {
    this.menuService.getProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : []
      },
      error: (error) => {
        console.error(error)
        this.products = []
      },
    })
  }

  filterProducts() {
    if (this.spicinessFilter !== null && (this.spicinessFilter < 0 || this.spicinessFilter > 4)) {
      alert('Spiciness must be between 0 and 4')
      return
    }

    let params = {
      vegetarian: this.vegetarianFilter,
      nuts: this.nutsFilter,
      spiciness: this.spicinessFilter === null ? '' : String(this.spicinessFilter),
    }

    this.menuService.getFilteredProducts(params).subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : []
      },
      error: (error) => {
        console.error(error)
        this.products = []
      },
    })
  }

  // NOTE: menu.html should pass $event.currentTarget instead of $event.target
  addToCart(product: ProductDto, quantity: number, buttonEl: EventTarget | null) {
    let button = buttonEl as HTMLButtonElement
    if (!button) return

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    button.disabled = true
    button.textContent = 'Adding...'

    this.menuService.getBasket().subscribe({
      next: (basket) => {
        let basketArray = Array.isArray(basket) ? basket : []

        // Prevent “same product becomes a second row” problems
        let existingItem = basketArray.find((item) => Number(item.productId) === Number(product.id))

        if (existingItem) {
          let updateObject = {
            quantity: (existingItem.quantity || 0) + quantity,
            price: product.price,
            productId: product.id,
          }

          this.menuService.putBasket(updateObject).subscribe({
            next: () => this.resetButton(button),
            error: (error: any) => {
              console.error(error)
              this.failButton(button)
              alert('Failed to update item in cart')
            },
          })
        } else {
          let addObject = {
            quantity,
            price: product.price, // REQUIRED :contentReference[oaicite:7]{index=7}
            productId: product.id,
          }

          this.menuService.addToBasket(addObject).subscribe({
            next: () => this.resetButton(button),
            error: (error: any) => {
              console.error(error)
              this.failButton(button)
              alert('Failed to add item to cart')
            },
          })
        }
      },
      error: (error: any) => {
        console.error(error)
        this.failButton(button)
        alert('Failed to check cart')
      },
    })
  }

  private resetButton(button: HTMLButtonElement) {
    button.textContent = 'Added!'
    setTimeout(() => {
      button.textContent = 'Add to Cart'
      button.disabled = false
    }, 2000)
  }

  private failButton(button: HTMLButtonElement) {
    button.textContent = 'Failed'
    setTimeout(() => {
      button.textContent = 'Add to Cart'
      button.disabled = false
    }, 2000)
  }
}

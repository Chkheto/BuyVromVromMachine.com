import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { catchError, throwError } from 'rxjs'

export type ProductDto = {
  id: number
  name: string
  price: number
  nuts: boolean
  image: string
  vegeterian: boolean
  spiciness: number
  categoryId: number
}

export type BasketItem = {
  id: number
  quantity: number
  price: number
  productId: number
  product?: ProductDto
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient)

  getProducts() {
    return this.http
      .get<ProductDto[]>('https://restaurant.stepprojects.ge/api/Products/GetAll')
      .pipe(catchError(() => throwError(() => new Error('Failed to Load Products'))))
  }

  getFilteredProducts(params: { vegetarian: string; nuts: string; spiciness: string }) {
    let queryParams = new URLSearchParams()

    if (params.vegetarian !== '') queryParams.append('vegeterian', params.vegetarian)
    if (params.nuts !== '') queryParams.append('nuts', params.nuts)
    if (params.spiciness !== '') queryParams.append('spiciness', params.spiciness)

    return this.http
      .get<ProductDto[]>(
        `https://restaurant.stepprojects.ge/api/Products/GetFiltered?${queryParams.toString()}`
      )
      .pipe(catchError(() => throwError(() => new Error('Failed to Filter Products'))))
  }

  getBasket() {
    return this.http
      .get<BasketItem[]>('https://restaurant.stepprojects.ge/api/Baskets/GetAll')
      .pipe(catchError(() => throwError(() => new Error('Failed to Load Basket'))))
  }

  putBasket(objectToUpdate: { quantity: number; price: number; productId: number }) {
    return this.http
      .put('https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket', objectToUpdate)
      .pipe(catchError(() => throwError(() => new Error('Failed to Update Basket'))))
  }

  addToBasket(objectToPost: { quantity: number; price: number; productId: number }) {
    return this.http
      .post('https://restaurant.stepprojects.ge/api/Baskets/AddToBasket', objectToPost)
      .pipe(catchError(() => throwError(() => new Error('Failed to Add to Basket'))))
  }

  deleteBasketItem(basketItemId: number) {
    return this.http
      .delete(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${basketItemId}`)
      .pipe(catchError(() => throwError(() => new Error('Failed to Delete Product From Basket'))))
  }
}

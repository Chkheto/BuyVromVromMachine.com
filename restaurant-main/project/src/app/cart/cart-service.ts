import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  getBasket() {
    return this.http
      .get('https://restaurant.stepprojects.ge/api/Baskets/GetAll')
      .pipe(
        catchError(() => throwError(() => new Error('Failed to Load Basket')))
      );
  }

  deleteBasket(productId: number) {
    return this.http
      .delete(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`)
      .pipe(
        catchError(() => throwError(() => new Error('Failed to Delete Product')))
      );
  }

  putBasket(objectToUpdate: any) {
    return this.http
      .put('https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket', objectToUpdate)
      .pipe(
        catchError(() => throwError(() => new Error('Failed to Update Basket')))
      );
  }
}

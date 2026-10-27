import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadCarService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7083/api/cars'; // Adjust your endpoint as needed

  uploadCar(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
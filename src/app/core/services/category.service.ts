import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  description: string;
  subcategories: { id: number; name: string; categoryId: number; }[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCategoriesWithSubcategories(): Observable<CategoryWithSubcategories[]> {
    return this.http.get<CategoryWithSubcategories[]>(`${this.apiUrl}/categories/with-subcategories`);
  }

  createCategory(dto: { name: string; description: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, dto);
  }

  createSubcategory(dto: { name: string; categoryId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories/subcategories`, dto);
  }
}

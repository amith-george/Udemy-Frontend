import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  courseId: number;
  title: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  get itemCount(): number {
    return this.cartItemsSubject.value.length;
  }

  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart`).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  addToCart(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { courseId }).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  removeFromCart(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${courseId}`).pipe(
      tap(() => this.loadCart().subscribe())
    );
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/checkout`, {});
  }

  verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/verify`, {
      razorpayOrderId, razorpayPaymentId, razorpaySignature
    }).pipe(tap(() => this.cartItemsSubject.next([])));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  systemRole: number;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  systemRole: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem('udemy_user');
    return stored ? JSON.parse(stored) : null;
  }

  get currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get isInstructor(): boolean {
    return this.currentUser?.systemRole === 1;
  }

  get isStudent(): boolean {
    return this.currentUser?.systemRole === 2;
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, dto);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('udemy_user', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  verifyOtp(email: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/verify-otp`, { email, otp }).pipe(
      tap(res => {
        localStorage.setItem('udemy_user', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-otp`, { email });
  }

  logout(): void {
    localStorage.removeItem('udemy_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}

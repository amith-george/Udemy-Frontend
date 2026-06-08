import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  systemRole: number;
  createdAt: string;
  instructorDetails?: { instructorId: number; headline: string; biography: string; profilePictureUrl: string; } | null;
  studentDetails?: { studentId: number; } | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`);
  }

  updateProfile(fullName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/profile`, { fullName });
  }
}

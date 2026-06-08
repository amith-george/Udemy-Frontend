import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: string;
  progressPercentage: number;
  course: any;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMyEnrollments(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments/student/${studentId}`);
  }

  updateProgress(enrollmentId: number, newProgressPercentage: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollments/update-progress`, { enrollmentId, newProgressPercentage });
  }
}

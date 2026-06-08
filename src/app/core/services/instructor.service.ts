import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CourseDto, CourseDetailDto } from './course.service';
import { AuthService } from './auth.service';

export interface SectionCreateDto {
  title: string;
  sequenceOrder: number;
  courseId: number;
}

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Retrieves all courses and filters them client-side by the instructor's name
  getMyCourses(): Observable<CourseDto[]> {
    return this.http.get<CourseDto[]>(`${this.apiUrl}/courses`).pipe(
      map(courses => {
        const currentUser = this.auth.currentUser;
        if (!currentUser) return [];
        return courses.filter(c => c.instructorName === currentUser.fullName);
      })
    );
  }

  // Uses FormData because the backend expects [FromForm] with an IFormFile
  createCourse(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, formData);
  }

  updateCourse(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${id}`, formData);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  createSection(dto: SectionCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/sections`, dto);
  }

  updateSection(id: number, dto: { title: string; sequenceOrder: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/sections/${id}`, dto);
  }

  deleteSection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sections/${id}`);
  }

  // Uses FormData because the backend expects [FromForm] with IFormFile(s)
  createContent(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/contents`, formData);
  }

  updateContent(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/contents/${id}`, formData);
  }

  deleteContent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contents/${id}`);
  }

  updateProfile(bio: string, profilePictureUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/instructor/profile/details`, { biography: bio, profilePictureUrl });
  }
}

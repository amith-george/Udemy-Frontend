import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CourseDto {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  status: string;
  isQuiz: boolean;
  instructorName: string;
  subcategoryName: string;
}

export interface ContentDto {
  id: number;
  title: string;
  description: string;
  filePath: string;
  videoUrl: string;
  sectionId: number;
  courseId: number;
}

export interface SectionWithContentsDto {
  id: number;
  title: string;
  sequenceOrder: number;
  contents: ContentDto[];
}

export interface CourseDetailDto extends CourseDto {
  instructorId: number;
  instructorBio: string;
  sections: SectionWithContentsDto[];
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<CourseDto[]> {
    return this.http.get<CourseDto[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: number): Observable<CourseDetailDto> {
    return this.http.get<CourseDetailDto>(`${this.apiUrl}/courses/${id}`);
  }
}

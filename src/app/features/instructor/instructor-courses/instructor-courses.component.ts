import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstructorService } from '../../../core/services/instructor.service';
import { CourseDto } from '../../../core/services/course.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="courses-header">
      <h1 class="serif-heading">Courses</h1>
      <a routerLink="/instructor/course/create" class="btn btn-primary">New course</a>
    </div>

    <div class="search-filter">
      <input type="text" class="form-input search-box" placeholder="Search your courses" [(ngModel)]="searchQuery" (input)="filterCourses()" />
    </div>

    <div class="courses-list" *ngIf="!loading && filteredCourses.length > 0">
      <div class="course-row" *ngFor="let course of filteredCourses">
        <div class="course-thumb">
          <img [src]="getThumbnail(course)" [alt]="course.title" />
        </div>
        <div class="course-info">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-status" [class.draft]="course.status === 'Draft'">{{ course.status }}</p>
        </div>
        <div class="course-actions">
          <a [routerLink]="['/instructor/course', course.id, 'manage']" class="manage-btn">Manage / Edit</a>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="!loading && filteredCourses.length === 0">
      <p>Jump into course creation.</p>
      <a routerLink="/instructor/course/create" class="btn btn-primary">Create your course</a>
    </div>

    <div class="loading" *ngIf="loading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .courses-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
    h1 { font-size: 2.4rem; }
    .search-filter { margin-bottom: 24px; }
    .search-box { max-width: 400px; }
    .courses-list { display: flex; flex-direction: column; gap: 16px; }
    .course-row { display: flex; border: 1px solid var(--border-color); background: var(--bg-white); transition: box-shadow var(--transition-fast); }
    .course-row:hover { box-shadow: var(--shadow-sm); }
    .course-thumb { width: 120px; aspect-ratio: 16/9; background: var(--bg-light); flex-shrink: 0; }
    .course-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .course-info { flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: center; }
    .course-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
    .course-status { font-size: 0.85rem; font-weight: 700; color: #1e824c; } /* green for published */
    .course-status.draft { color: var(--text-secondary); font-weight: 400; }
    .course-actions { display: flex; align-items: center; padding: 16px; border-left: 1px solid var(--border-color); }
    .manage-btn { color: var(--text-primary); font-weight: 700; font-size: 1rem; text-decoration: none; padding: 8px 16px; }
    .manage-btn:hover { color: var(--udemy-purple); }
    .empty-state { text-align: center; padding: 64px 0; border: 1px dashed var(--border-color); }
    .empty-state p { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 16px; font-family: var(--font-serif); }
    .loading { display: flex; justify-content: center; padding: 64px; }
  `]
})
export class InstructorCoursesComponent implements OnInit {
  courses: CourseDto[] = [];
  filteredCourses: CourseDto[] = [];
  loading = true;
  searchQuery = '';
  baseUrl = environment.apiUrl.replace('/api', '');

  constructor(private instructorService: InstructorService) {}

  ngOnInit() {
    this.instructorService.getMyCourses().subscribe(res => {
      this.courses = res;
      this.filteredCourses = res;
      this.loading = false;
    });
  }

  filterCourses() {
    const q = this.searchQuery.toLowerCase();
    this.filteredCourses = this.courses.filter(c => c.title.toLowerCase().includes(q));
  }

  getThumbnail(course: CourseDto): string {
    if (!course.thumbnailUrl) return 'https://picsum.photos/seed/' + course.id + '/400/225';
    if (course.thumbnailUrl.startsWith('http')) return course.thumbnailUrl;
    return this.baseUrl + course.thumbnailUrl;
  }
}

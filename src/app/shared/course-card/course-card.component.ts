import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseDto } from '../../core/services/course.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="course-card" [routerLink]="['/courses', course.id]">
      <div class="card-thumb">
        <img [src]="getThumbnail()" [alt]="course.title" loading="lazy" />
        <div class="card-overlay"></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ course.title }}</h3>
        <p class="card-instructor">{{ course.instructorName }}</p>
        <div class="card-rating">
          <span class="rating-num">4.7</span>
          <div class="stars">
            <span class="star" *ngFor="let s of [1,2,3,4,5]">★</span>
          </div>
          <span class="rating-count">(1,204)</span>
        </div>
        <div class="card-price-row">
          <span class="card-price" *ngIf="course.price > 0">₹{{ course.price | number:'1.0-0' }}</span>
          <span class="card-price" *ngIf="course.price === 0">Free</span>
        </div>
        <div class="card-badges">
          <span class="badge" *ngIf="course.status === 'Bestseller'">Bestseller</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-card {
      display: flex; flex-direction: column; cursor: pointer; text-decoration: none;
      color: var(--text-primary); transition: opacity var(--transition-fast);
      width: 100%;
    }
    .card-thumb { position: relative; overflow: hidden; aspect-ratio: 16/9; margin-bottom: 8px; border: 1px solid var(--border-color); }
    .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .card-overlay { position: absolute; inset: 0; background: rgba(28,29,31,0.2); opacity: 0; transition: opacity var(--transition-fast); }
    .course-card:hover .card-overlay { opacity: 1; }
    .card-body { display: flex; flex-direction: column; gap: 4px; }
    .card-title { font-size: 1rem; font-weight: 700; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-instructor { font-size: 0.75rem; color: var(--text-secondary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }
    .card-rating { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; }
    .rating-num { font-weight: 700; color: var(--rating-color); }
    .stars { display: flex; color: var(--rating-color); }
    .star { font-size: 0.75rem; }
    .rating-count { color: var(--text-secondary); }
    .card-price-row { display: flex; align-items: center; margin-top: 4px; }
    .card-price { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
    .card-badges { margin-top: 4px; }
    .badge { background: #eceb98; color: #3d3c0a; padding: 4px 8px; font-size: 0.75rem; font-weight: 700; }
  `]
})
export class CourseCardComponent {
  @Input() course!: CourseDto;
  baseUrl = environment.apiUrl.replace('/api', '');

  getThumbnail(): string {
    if (!this.course.thumbnailUrl) return 'https://picsum.photos/seed/' + this.course.id + '/400/225';
    if (this.course.thumbnailUrl.startsWith('http')) return this.course.thumbnailUrl;
    return this.baseUrl + this.course.thumbnailUrl;
  }
}

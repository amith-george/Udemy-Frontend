import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService, CourseDto } from '../../core/services/course.service';
import { CategoryService, CategoryWithSubcategories } from '../../core/services/category.service';
import { CourseCardComponent } from '../../shared/course-card/course-card.component';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseCardComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <main>
      <!-- Authentic Udemy Billboard Hero -->
      <section class="hero-container">
        <div class="hero-image-wrapper">
          <img src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg" style="display:none" alt="preload"/>
          <!-- Placeholder image matching Udemy hero style -->
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Students learning" class="hero-img" />
        </div>
        <div class="hero-billboard">
          <h1 class="serif-heading">Learning that gets you</h1>
          <p>Skills for your present (and your future). Get started with us.</p>
        </div>
      </section>

      <!-- Trusted by Section -->
      <section class="trusted-section">
        <div class="container">
          <h2>Trusted by over 15,000 companies and millions of learners around the world</h2>
          <div class="trusted-logos">
            <span>Volkswagen</span>
            <span>Samsung</span>
            <span>Cisco</span>
            <span>Vimeo</span>
            <span>P&G</span>
            <span>Hewlett Packard</span>
          </div>
        </div>
      </section>

      <!-- Featured Courses -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">A broad selection of courses</h2>
          <p class="section-subtitle">Choose from over 210,000 online video courses with new additions published every month</p>
          
          <div class="course-grid" *ngIf="featuredCourses.length > 0">
            <app-course-card *ngFor="let course of featuredCourses.slice(0, 5)" [course]="course"></app-course-card>
          </div>
          <div class="course-grid" *ngIf="loading">
            <div class="skeleton-card" *ngFor="let p of [1,2,3,4,5]">
              <div class="skeleton-thumb skeleton"></div>
              <div class="skeleton-line skeleton" style="width: 90%; height: 16px; margin-top: 12px;"></div>
              <div class="skeleton-line skeleton" style="width: 60%; height: 12px; margin-top: 8px;"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="section bg-light">
        <div class="container">
          <h2 class="section-title">Top categories</h2>
          <div class="categories-grid" *ngIf="categories.length > 0">
            <a [routerLink]="['/courses']" [queryParams]="{category: cat.id}" class="category-card" *ngFor="let cat of categories">
              <div class="cat-img">
                <img [src]="'https://picsum.photos/seed/' + cat.id + '/300/300'" [alt]="cat.name" />
              </div>
              <div class="cat-title">{{ cat.name }}</div>
            </a>
          </div>
          <div class="categories-grid" *ngIf="categories.length === 0">
            <div class="category-card skeleton" *ngFor="let p of [1,2,3,4,5,6,7,8]" style="height: 340px;"></div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    /* HERO */
    .hero-container {
      position: relative; max-width: 1340px; margin: 0 auto;
      padding: 0 2.4rem; margin-top: 24px; margin-bottom: 64px;
    }
    .hero-image-wrapper { height: 400px; width: 100%; position: relative; }
    .hero-img { width: 100%; height: 100%; object-fit: cover; }
    .hero-billboard {
      position: absolute; top: 48px; left: 4.8rem;
      background: var(--bg-white); padding: 32px; max-width: 440px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08);
    }
    .hero-billboard h1 { font-size: 2.8rem; line-height: 1.1; margin-bottom: 12px; letter-spacing: -0.5px; }
    .hero-billboard p { font-size: 1.1rem; color: var(--text-primary); line-height: 1.4; }

    /* TRUSTED */
    .trusted-section { background: var(--bg-light); padding: 64px 0; text-align: center; }
    .trusted-section h2 { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 24px; font-weight: 400; }
    .trusted-logos { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; color: var(--text-secondary); font-weight: 700; font-size: 1.5rem; opacity: 0.7; }

    /* SECTIONS */
    .section { padding: 64px 0; }
    .bg-light { background: var(--bg-light); }
    .section-title { margin-bottom: 8px; }
    .section-subtitle { font-size: 1.1rem; margin-bottom: 24px; color: var(--text-primary); }

    /* CATEGORIES */
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px 16px; }
    .category-card { display: block; text-decoration: none; color: var(--text-primary); transition: transform var(--transition-fast); }
    .category-card:hover { transform: scale(1.02); }
    .cat-img { overflow: hidden; background: #f7f9fa; margin-bottom: 8px; aspect-ratio: 1; }
    .cat-img img { width: 100%; height: 100%; object-fit: cover; }
    .cat-title { font-weight: 700; font-size: 1rem; }

    /* SKELETONS */
    .skeleton-thumb { width: 100%; aspect-ratio: 16/9; margin-bottom: 8px; }
    .skeleton-line { border-radius: 2px; }

    @media (max-width: 900px) {
      .hero-container { padding: 0; margin-top: 0; }
      .hero-billboard { position: relative; top: 0; left: 0; max-width: 100%; box-shadow: none; }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredCourses: CourseDto[] = [];
  categories: CategoryWithSubcategories[] = [];
  loading = true;

  constructor(private courseService: CourseService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({ next: c => { this.featuredCourses = c; this.loading = false; }, error: () => this.loading = false });
    this.categoryService.getCategoriesWithSubcategories().subscribe({ next: c => this.categories = c, error: () => {} });
  }
}

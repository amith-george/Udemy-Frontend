import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CourseService, CourseDetailDto } from '../../../core/services/course.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="detail-page page-enter" *ngIf="course; else loading">
      <!-- Hero Banner -->
      <div class="detail-hero">
        <div class="hero-overlay"></div>
        <img [src]="getThumbnail()" class="hero-bg-img" [alt]="course.title" />
        <div class="container">
          <div class="hero-content-row">
            <div class="hero-info">
              <div class="breadcrumb">
                <a routerLink="/courses">Courses</a> / {{ course.subcategoryName }}
              </div>
              <h1 class="course-title">{{ course.title }}</h1>
              <p class="course-desc">{{ course.description }}</p>
              <div class="course-meta">
                <span class="badge badge-purple">{{ course.subcategoryName }}</span>
                <span *ngIf="course.isQuiz" class="badge badge-orange">📝 Includes Quiz</span>
                <span class="badge" [class]="course.status === 'Free' ? 'badge-free' : 'badge-purple'">{{ course.status }}</span>
              </div>
              <div class="instructor-row">
                <div class="inst-avatar">{{ course.instructorName?.charAt(0) }}</div>
                <div>
                  <p class="inst-label">Instructor</p>
                  <p class="inst-name">{{ course.instructorName }}</p>
                </div>
              </div>
            </div>
            <!-- Sticky Purchase Card -->
            <div class="purchase-card">
              <div class="purchase-thumb">
                <img [src]="getThumbnail()" [alt]="course.title" />
              </div>
              <div class="purchase-body">
                <div class="purchase-price">
                  <span *ngIf="course.price > 0">₹{{ course.price | number:'1.0-0' }}</span>
                  <span *ngIf="course.price === 0" class="free-price">Free</span>
                </div>
                <button class="btn btn-primary" style="width:100%;margin-bottom:10px" (click)="addToCart()" [disabled]="addingToCart || isEnrolled">
                  <span *ngIf="!addingToCart && !isEnrolled">🛒 Add to Cart</span>
                  <span *ngIf="addingToCart">Adding...</span>
                  <span *ngIf="isEnrolled">✅ Already Enrolled</span>
                </button>
                <button class="btn btn-secondary" style="width:100%" (click)="goToPlayer()" *ngIf="isEnrolled">
                  ▶ Continue Learning
                </button>
                <button class="btn btn-outline" style="width:100%" (click)="goToLogin()" *ngIf="!isLoggedIn">
                  Log in to Enroll
                </button>
                <div class="purchase-info">
                  <div class="info-item"><span>📚</span> {{ totalLessons }} lessons</div>
                  <div class="info-item"><span>🗂️</span> {{ course.sections?.length || 0 }} sections</div>
                  <div class="info-item" *ngIf="course.isQuiz"><span>📝</span> Final quiz included</div>
                  <div class="info-item"><span>🏆</span> Certificate of completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="container detail-body">
        <div class="detail-grid">
          <div class="detail-main">
            <!-- About Instructor -->
            <div class="content-section" *ngIf="course.instructorBio">
              <h2>About the Instructor</h2>
              <div class="instructor-bio-card">
                <div class="bio-avatar">{{ course.instructorName?.charAt(0) }}</div>
                <div>
                  <p class="bio-name">{{ course.instructorName }}</p>
                  <p class="bio-text">{{ course.instructorBio }}</p>
                </div>
              </div>
            </div>

            <!-- Curriculum -->
            <div class="content-section">
              <h2>Course Content</h2>
              <p class="curriculum-summary">{{ course.sections?.length }} sections • {{ totalLessons }} lectures</p>
              <div class="accordion" *ngFor="let section of course.sections; let i = index">
                <div class="acc-header" (click)="toggleSection(i)" [class.open]="openSections[i]">
                  <div class="acc-left">
                    <span class="acc-arrow">{{ openSections[i] ? '▼' : '▶' }}</span>
                    <span class="acc-title">{{ section.title }}</span>
                  </div>
                  <span class="acc-count">{{ section.contents?.length }} lectures</span>
                </div>
                <div class="acc-body" *ngIf="openSections[i]">
                  <div class="lesson-item" *ngFor="let content of section.contents">
                    <span class="lesson-icon">{{ content.videoUrl ? '▶️' : '📄' }}</span>
                    <span class="lesson-title">{{ content.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-overlay" style="min-height:100dvh;padding-top:64px">
        <div class="spinner"></div>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-hero {
      position: relative; overflow: hidden; padding-top: 64px;
      min-height: 420px; display: flex; align-items: flex-end; padding-bottom: 0;
      background: var(--bg-primary);
    }
    .hero-bg-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.12; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(15,15,15,0.98) 0%, rgba(15,15,15,0.8) 60%, rgba(15,15,15,0.3) 100%); }
    .container { position: relative; z-index: 1; }
    .hero-content-row { display: grid; grid-template-columns: 1fr 340px; gap: 60px; align-items: start; padding: 40px 0; }
    .breadcrumb { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px; }
    .breadcrumb a { color: var(--brand-purple-light); text-decoration: none; }
    .course-title { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; margin-bottom: 16px; line-height: 1.2; }
    .course-desc { color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7; max-width: 600px; }
    .course-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .instructor-row { display: flex; align-items: center; gap: 12px; }
    .inst-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--gradient-brand); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; color: #fff; }
    .inst-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .inst-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
    .purchase-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-card); position: sticky; top: 80px; }
    .purchase-thumb { aspect-ratio: 16/9; overflow: hidden; }
    .purchase-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .purchase-body { padding: 20px; }
    .purchase-price { font-size: 2rem; font-weight: 900; margin-bottom: 16px; }
    .free-price { color: #22c55e; }
    .purchase-info { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--border-color); padding-top: 16px; }
    .info-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-secondary); }
    .detail-body { padding: 48px 0; }
    .detail-grid { max-width: 800px; }
    .content-section { margin-bottom: 48px; }
    .content-section h2 { font-size: 1.4rem; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
    .instructor-bio-card { display: flex; gap: 20px; align-items: flex-start; }
    .bio-avatar { width: 60px; height: 60px; border-radius: 50%; background: var(--gradient-brand); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: #fff; flex-shrink: 0; }
    .bio-name { font-weight: 700; margin-bottom: 8px; }
    .bio-text { color: var(--text-secondary); line-height: 1.7; font-size: 0.92rem; }
    .curriculum-summary { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px; }
    .accordion { border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: 8px; overflow: hidden; }
    .acc-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; background: var(--bg-card); transition: background var(--transition-fast); }
    .acc-header:hover { background: var(--bg-card-hover); }
    .acc-header.open { background: rgba(164,53,240,0.06); }
    .acc-left { display: flex; align-items: center; gap: 12px; }
    .acc-arrow { font-size: 0.7rem; color: var(--text-muted); }
    .acc-title { font-weight: 600; font-size: 0.95rem; }
    .acc-count { font-size: 0.78rem; color: var(--text-muted); }
    .acc-body { background: var(--bg-secondary); border-top: 1px solid var(--border-color); }
    .lesson-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px 12px 52px; font-size: 0.88rem; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); }
    .lesson-item:last-child { border-bottom: none; }
    .lesson-icon { font-size: 0.9rem; }
    @media (max-width: 900px) { .hero-content-row { grid-template-columns: 1fr; } .purchase-card { position: static; } }
  `]
})
export class DetailComponent implements OnInit {
  course: CourseDetailDto | null = null;
  openSections: { [key: number]: boolean } = {};
  addingToCart = false;
  isEnrolled = false;
  baseUrl = environment.apiUrl.replace('/api', '');

  constructor(
    private route: ActivatedRoute, private router: Router,
    private courseService: CourseService, private cartService: CartService,
    public auth: AuthService, private toast: ToastService
  ) {}

  get isLoggedIn(): boolean { return this.auth.isLoggedIn; }
  get totalLessons(): number { return this.course?.sections?.reduce((acc, s) => acc + (s.contents?.length || 0), 0) || 0; }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(id).subscribe({ next: c => { this.course = c; if (c.sections?.length > 0) this.openSections[0] = true; } });
  }

  toggleSection(i: number): void { this.openSections[i] = !this.openSections[i]; }

  getThumbnail(): string {
    if (!this.course?.thumbnailUrl) return 'https://picsum.photos/seed/' + this.course?.id + '/800/450';
    if (this.course.thumbnailUrl.startsWith('http')) return this.course.thumbnailUrl;
    return this.baseUrl + this.course.thumbnailUrl;
  }

  addToCart(): void {
    if (!this.auth.isLoggedIn) { this.router.navigate(['/login']); return; }
    this.addingToCart = true;
    this.cartService.addToCart(this.course!.id).subscribe({
      next: () => { this.toast.success('Course added to cart!'); this.addingToCart = false; },
      error: (e) => { this.toast.error(e.error?.message || 'Could not add to cart'); this.addingToCart = false; }
    });
  }

  goToLogin(): void { this.router.navigate(['/login']); }
  goToPlayer(): void { this.router.navigate(['/player', this.course?.id]); }
}

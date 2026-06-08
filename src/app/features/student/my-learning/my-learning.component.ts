import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnrollmentService, Enrollment } from '../../../core/services/enrollment.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="my-learning-page page-enter">
      <div class="container">
        <div class="page-header">
          <h1>My Learning</h1>
          <p class="header-sub">{{ enrollments.length }} course{{ enrollments.length !== 1 ? 's' : '' }} enrolled</p>
        </div>

        <div class="learning-grid" *ngIf="!loading && enrollments.length > 0">
          <div class="learning-card" *ngFor="let e of enrollments" [routerLink]="['/player', e.courseId]">
            <div class="lc-thumb">
              <img [src]="getThumb(e)" [alt]="e.course?.title" />
              <div class="lc-overlay">
                <div class="play-btn">▶</div>
              </div>
            </div>
            <div class="lc-body">
              <p class="lc-title">{{ e.course?.title || 'Course #' + e.courseId }}</p>
              <p class="lc-instructor">{{ e.course?.instructor?.user?.fullName || 'Instructor' }}</p>
              <div class="progress-section">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" [style.width.%]="e.progressPercentage"></div>
                </div>
                <p class="progress-label">{{ e.progressPercentage | number:'1.0-0' }}% complete</p>
              </div>
              <span class="badge badge-green" *ngIf="e.progressPercentage >= 100">✓ Completed</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading && enrollments.length === 0">
          <div class="empty-icon">📚</div>
          <h2>No courses yet</h2>
          <p>Start learning by enrolling in a course</p>
          <a routerLink="/courses" class="btn btn-primary">Explore Courses</a>
        </div>

        <div class="loading-overlay" *ngIf="loading"><div class="spinner"></div></div>
      </div>
    </div>
  `,
  styles: [`
    .my-learning-page { padding: 80px 0 40px; min-height: 100dvh; }
    .page-header { margin-bottom: 40px; }
    .page-header h1 { font-size: 2.2rem; }
    .header-sub { color: var(--text-muted); margin-top: 8px; }
    .learning-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .learning-card {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); overflow: hidden; cursor: pointer;
      transition: all var(--transition-smooth);
    }
    .learning-card:hover { transform: translateY(-4px); border-color: var(--border-hover); box-shadow: var(--shadow-hover); }
    .lc-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; }
    .lc-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-smooth); }
    .learning-card:hover .lc-thumb img { transform: scale(1.05); }
    .lc-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity var(--transition-smooth); }
    .learning-card:hover .lc-overlay { opacity: 1; }
    .play-btn { width: 50px; height: 50px; border-radius: 50%; background: var(--brand-purple); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #fff; }
    .lc-body { padding: 16px; }
    .lc-title { font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .lc-instructor { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
    .progress-section { margin-bottom: 8px; }
    .progress-bar-bg { height: 6px; background: var(--bg-secondary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 6px; }
    .progress-bar-fill { height: 100%; background: var(--gradient-brand); border-radius: var(--radius-full); transition: width 0.5s ease; }
    .progress-label { font-size: 0.75rem; color: var(--text-muted); }
    .empty-state { text-align: center; padding: 80px 0; }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; }
    .empty-state h2 { font-size: 1.5rem; margin-bottom: 10px; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 28px; }
  `]
})
export class MyLearningComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = true;
  baseUrl = environment.apiUrl.replace('/api', '');

  constructor(private enrollService: EnrollmentService, private auth: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: profile => {
        const studentId = profile.studentDetails?.studentId;
        if (studentId) {
          this.enrollService.getMyEnrollments(studentId).subscribe({
            next: e => { this.enrollments = e; this.loading = false; },
            error: () => this.loading = false
          });
        } else { this.loading = false; }
      },
      error: () => this.loading = false
    });
  }

  getThumb(e: Enrollment): string {
    const thumb = e.course?.thumbnailUrl;
    if (!thumb) return 'https://picsum.photos/seed/' + e.courseId + '/400/225';
    if (thumb.startsWith('http')) return thumb;
    return this.baseUrl + thumb;
  }
}

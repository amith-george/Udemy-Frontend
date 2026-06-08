import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService, CourseDetailDto, ContentDto } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="player-layout" *ngIf="course; else loading">
      <!-- Top Bar -->
      <div class="player-topbar">
        <a routerLink="/my-learning" class="back-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          My Learning
        </a>
        <h2 class="player-course-title">{{ course.title }}</h2>
        <div class="progress-pill">{{ progressPercentage | number:'1.0-0' }}% complete</div>
      </div>

      <div class="player-body">
        <!-- Video + Content -->
        <div class="player-main">
          <!-- Video Player -->
          <div class="video-container">
            <ng-container *ngIf="currentContent?.videoUrl; else noVideo">
              <video *ngIf="!isYouTube(currentContent!.videoUrl)" controls class="video-el" [src]="getVideoSrc(currentContent!.videoUrl)"></video>
              <iframe *ngIf="isYouTube(currentContent!.videoUrl)" class="video-el" [src]="getYouTubeEmbed(currentContent!.videoUrl)" frameborder="0" allowfullscreen></iframe>
            </ng-container>
            <ng-template #noVideo>
              <div class="no-video">
                <span>📄</span>
                <p>{{ currentContent?.title || 'Select a lesson from the sidebar' }}</p>
              </div>
            </ng-template>
          </div>

          <!-- Lesson Info -->
          <div class="lesson-info" *ngIf="currentContent">
            <h2>{{ currentContent.title }}</h2>
            <p class="lesson-desc" *ngIf="currentContent.description">{{ currentContent.description }}</p>
            <div class="lesson-actions">
              <button class="btn btn-secondary btn-sm" (click)="prevLesson()" [disabled]="isFirst">← Previous</button>
              <button class="btn btn-primary btn-sm" (click)="nextLesson()" [disabled]="isLast">Next →</button>
              <a *ngIf="currentContent.filePath" [href]="baseUrl + currentContent.filePath" target="_blank" class="btn btn-outline btn-sm">⬇ Download Resource</a>
            </div>
          </div>
        </div>

        <!-- Curriculum Sidebar -->
        <aside class="player-sidebar">
          <div class="sidebar-header">
            <h3>Course Content</h3>
            <div class="mini-progress">
              <div class="mini-bar" [style.width.%]="progressPercentage"></div>
            </div>
          </div>
          <div class="sidebar-accordion" *ngFor="let section of course.sections; let si = index">
            <div class="sa-header" (click)="toggleSection(si)" [class.open]="openSections[si]">
              <span class="sa-arrow">{{ openSections[si] ? '▼' : '▶' }}</span>
              <span class="sa-title">{{ section.title }}</span>
              <span class="sa-count">{{ section.contents?.length }}</span>
            </div>
            <div class="sa-body" *ngIf="openSections[si]">
              <div class="sa-lesson"
                   *ngFor="let content of section.contents; let li = index"
                   [class.active]="currentContent?.id === content.id"
                   (click)="selectContent(content)">
                <span class="lesson-icon-sm">{{ content.videoUrl ? '▶' : '📄' }}</span>
                <span class="lesson-name">{{ content.title }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-overlay" style="height:100dvh"><div class="spinner"></div></div>
    </ng-template>
  `,
  styles: [`
    .player-layout { display: flex; flex-direction: column; height: 100dvh; padding-top: 0; background: var(--bg-primary); }
    .player-topbar {
      height: 56px; background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      display: flex; align-items: center; gap: 20px; padding: 0 24px;
      flex-shrink: 0; position: sticky; top: 0; z-index: 100;
    }
    .back-btn { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 0.85rem; text-decoration: none; transition: color var(--transition-fast); flex-shrink: 0; }
    .back-btn:hover { color: var(--brand-purple-light); }
    .player-course-title { font-size: 0.95rem; font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .progress-pill { background: rgba(164,53,240,0.15); color: var(--brand-purple-light); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700; flex-shrink: 0; }
    .player-body { display: flex; flex: 1; overflow: hidden; }
    .player-main { flex: 1; overflow-y: auto; }
    .video-container { background: #000; aspect-ratio: 16/9; max-height: 60dvh; display: flex; align-items: center; justify-content: center; }
    .video-el { width: 100%; height: 100%; }
    .no-video { display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-muted); }
    .no-video span { font-size: 3rem; }
    .lesson-info { padding: 24px 32px; border-bottom: 1px solid var(--border-color); }
    .lesson-info h2 { font-size: 1.4rem; margin-bottom: 10px; }
    .lesson-desc { color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7; }
    .lesson-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .player-sidebar { width: 340px; flex-shrink: 0; background: var(--bg-secondary); border-left: 1px solid var(--border-color); overflow-y: auto; }
    .sidebar-header { padding: 16px 20px; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; background: var(--bg-secondary); z-index: 1; }
    .sidebar-header h3 { font-size: 0.9rem; margin-bottom: 10px; }
    .mini-progress { height: 4px; background: var(--bg-card); border-radius: var(--radius-full); overflow: hidden; }
    .mini-bar { height: 100%; background: var(--gradient-brand); transition: width 0.5s ease; }
    .sa-header { display: flex; align-items: center; gap: 8px; padding: 12px 20px; cursor: pointer; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); background: var(--bg-secondary); transition: background var(--transition-fast); }
    .sa-header:hover { background: var(--bg-card); }
    .sa-header.open { background: var(--bg-card); color: var(--text-primary); }
    .sa-arrow { font-size: 0.65rem; color: var(--text-muted); }
    .sa-title { flex: 1; font-weight: 600; }
    .sa-count { font-size: 0.72rem; color: var(--text-muted); background: var(--bg-primary); padding: 2px 7px; border-radius: var(--radius-full); }
    .sa-body { background: var(--bg-primary); }
    .sa-lesson { display: flex; align-items: center; gap: 10px; padding: 10px 20px 10px 32px; cursor: pointer; font-size: 0.82rem; color: var(--text-secondary); border-bottom: 1px solid rgba(255,255,255,0.04); transition: all var(--transition-fast); }
    .sa-lesson:hover { background: var(--bg-card); color: var(--text-primary); }
    .sa-lesson.active { background: rgba(164,53,240,0.1); color: var(--brand-purple-light); font-weight: 600; }
    .lesson-icon-sm { font-size: 0.75rem; flex-shrink: 0; }
    @media (max-width: 900px) { .player-sidebar { display: none; } }
  `]
})
export class PlayerComponent implements OnInit {
  course: CourseDetailDto | null = null;
  currentContent: ContentDto | null = null;
  allContents: ContentDto[] = [];
  openSections: { [key: number]: boolean } = {};
  enrollmentId: number | null = null;
  progressPercentage = 0;
  baseUrl = environment.apiUrl.replace('/api', '');

  constructor(private route: ActivatedRoute, private courseService: CourseService, private enrollService: EnrollmentService, private toast: ToastService) {}

  get isFirst(): boolean { return this.allContents.indexOf(this.currentContent!) === 0; }
  get isLast(): boolean { return this.allContents.indexOf(this.currentContent!) === this.allContents.length - 1; }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(id).subscribe({ next: c => {
      this.course = c;
      this.allContents = c.sections?.flatMap(s => s.contents) || [];
      if (this.allContents.length > 0) { this.currentContent = this.allContents[0]; this.openSections[0] = true; }
    }});
  }

  selectContent(c: ContentDto): void { this.currentContent = c; }
  toggleSection(i: number): void { this.openSections[i] = !this.openSections[i]; }
  isYouTube(url: string): boolean { return url?.includes('youtube') || url?.includes('youtu.be'); }
  getVideoSrc(url: string): string { return url.startsWith('http') ? url : this.baseUrl + url; }
  getYouTubeEmbed(url: string): string {
    const id = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  nextLesson(): void {
    const idx = this.allContents.indexOf(this.currentContent!);
    if (idx < this.allContents.length - 1) { this.currentContent = this.allContents[idx + 1]; }
  }
  prevLesson(): void {
    const idx = this.allContents.indexOf(this.currentContent!);
    if (idx > 0) { this.currentContent = this.allContents[idx - 1]; }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InstructorService } from '../../../core/services/instructor.service';
import { CourseService, CourseDetailDto, SectionWithContentsDto } from '../../../core/services/course.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-course-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="manage-container" *ngIf="course">
      <div class="manage-header">
        <a routerLink="/instructor/courses" class="back-link">&larr; Back to courses</a>
        <h1 class="serif-heading">{{ course.title }}</h1>
        <div class="tabs">
          <button class="tab" [class.active]="activeTab === 'curriculum'" (click)="activeTab = 'curriculum'">Curriculum</button>
          <button class="tab" [class.active]="activeTab === 'basics'" (click)="activeTab = 'basics'">Course landing page</button>
        </div>
      </div>

      <!-- CURRICULUM TAB -->
      <div class="tab-content" *ngIf="activeTab === 'curriculum'">
        <div class="tab-header">
          <h2>Curriculum</h2>
          <p>Start putting together your course by creating sections, lectures and practice (quizzes, coding exercises and assignments).</p>
        </div>

        <div class="curriculum-list">
          <div class="section-box" *ngFor="let section of course.sections; let si = index">
            <div class="section-header">
              <span class="section-title"><strong>Section {{ si + 1 }}:</strong> {{ section.title }}</span>
            </div>
            
            <div class="contents-list">
              <div class="content-box" *ngFor="let content of section.contents; let ci = index">
                <span class="content-icon">▶</span>
                <span class="content-title">Lecture {{ ci + 1 }}: {{ content.title }}</span>
                <button class="btn-icon" (click)="deleteContent(content.id)" title="Delete Lecture">🗑️</button>
              </div>

              <!-- Add Content Form -->
              <div class="add-content-area">
                <button class="btn btn-outline btn-sm" *ngIf="!showContentForm[section.id]" (click)="showContentForm[section.id] = true">
                  + Curriculum item
                </button>
                
                <div class="inline-form" *ngIf="showContentForm[section.id]">
                  <input type="text" class="form-input" placeholder="New Lecture Title" [(ngModel)]="newContentTitle[section.id]" />
                  <input type="file" class="form-input" (change)="onVideoSelected($event, section.id)" accept="video/mp4,video/x-m4v,video/*" />
                  <div class="inline-actions">
                    <button class="btn btn-ghost btn-sm" (click)="showContentForm[section.id] = false">Cancel</button>
                    <button class="btn btn-primary btn-sm" [disabled]="!newContentTitle[section.id] || uploadingContent" (click)="addContent(section.id)">
                      {{ uploadingContent ? 'Uploading...' : 'Add Lecture' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Section Form -->
        <div class="add-section-area">
          <button class="btn btn-outline" *ngIf="!showSectionForm" (click)="showSectionForm = true">+ Section</button>
          
          <div class="inline-form border-box" *ngIf="showSectionForm">
            <input type="text" class="form-input" placeholder="New Section Title" [(ngModel)]="newSectionTitle" />
            <div class="inline-actions mt-2">
              <button class="btn btn-ghost btn-sm" (click)="showSectionForm = false">Cancel</button>
              <button class="btn btn-primary btn-sm" [disabled]="!newSectionTitle" (click)="addSection()">Add Section</button>
            </div>
          </div>
        </div>
      </div>

      <!-- BASICS TAB -->
      <div class="tab-content" *ngIf="activeTab === 'basics'">
        <div class="tab-header">
          <h2>Course landing page</h2>
          <p>Your course landing page is crucial to your success on Udemy.</p>
        </div>
        
        <div class="inline-form border-box" style="max-width: 600px;">
          <div class="form-group">
            <label class="form-label">Course title</label>
            <input type="text" class="form-input" [(ngModel)]="course.title" />
          </div>
          <div class="form-group">
            <label class="form-label">Course subtitle/description</label>
            <textarea class="form-input" rows="4" [(ngModel)]="course.description"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Price (₹)</label>
            <input type="number" class="form-input" [(ngModel)]="course.price" />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-input" [(ngModel)]="course.status">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="saveBasics()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-container { background: #fff; min-height: 100%; }
    .manage-header { padding-bottom: 0; border-bottom: 1px solid var(--border-color); margin-bottom: 32px; }
    .back-link { font-size: 0.9rem; color: var(--text-link); text-decoration: none; display: inline-block; margin-bottom: 16px; font-weight: 700; }
    h1 { font-size: 2rem; margin-bottom: 24px; }
    .tabs { display: flex; gap: 24px; }
    .tab { background: none; border: none; border-bottom: 4px solid transparent; padding: 0 0 12px 0; font-size: 1rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; }
    .tab.active { border-bottom-color: var(--text-primary); color: var(--text-primary); }
    .tab:hover { color: var(--text-primary); }
    
    .tab-header { margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
    .tab-header h2 { font-size: 1.5rem; margin-bottom: 8px; }
    
    .section-box { border: 1px solid var(--text-primary); background: #f7f9fa; margin-bottom: 24px; padding: 16px; }
    .section-header { display: flex; align-items: center; margin-bottom: 16px; }
    .contents-list { padding-left: 24px; display: flex; flex-direction: column; gap: 8px; }
    .content-box { display: flex; align-items: center; background: #fff; border: 1px solid var(--border-color); padding: 12px 16px; }
    .content-icon { margin-right: 12px; font-size: 0.8rem; }
    .content-title { flex: 1; font-size: 0.95rem; }
    
    .add-content-area { margin-top: 8px; }
    .add-section-area { margin-top: 32px; }
    
    .inline-form { background: #fff; border: 1px dashed var(--text-primary); padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .border-box { border: 1px solid var(--border-color); border-top: 4px solid var(--text-primary); }
    .inline-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .mt-2 { margin-top: 16px; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
  `]
})
export class CourseManageComponent implements OnInit {
  courseId!: number;
  course: CourseDetailDto | null = null;
  activeTab: 'curriculum' | 'basics' = 'curriculum';
  
  // Section State
  showSectionForm = false;
  newSectionTitle = '';
  
  // Content State
  showContentForm: { [key: number]: boolean } = {};
  newContentTitle: { [key: number]: string } = {};
  newContentVideo: { [key: number]: File } = {};
  uploadingContent = false;

  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId = Number(params.get('id'));
      this.loadCourse();
    });
  }

  loadCourse() {
    this.courseService.getCourseById(this.courseId).subscribe((res: any) => {
      this.course = res;
    });
  }

  addSection() {
    if (!this.newSectionTitle || !this.course) return;
    const order = this.course.sections.length + 1;
    this.instructorService.createSection({
      title: this.newSectionTitle,
      sequenceOrder: order,
      courseId: this.courseId
    }).subscribe({
      next: () => {
        this.toast.success('Section added');
        this.newSectionTitle = '';
        this.showSectionForm = false;
        this.loadCourse();
      },
      error: () => this.toast.error('Failed to add section')
    });
  }

  onVideoSelected(event: any, sectionId: number) {
    const file = event.target.files[0];
    if (file) {
      this.newContentVideo[sectionId] = file;
    }
  }

  addContent(sectionId: number) {
    const title = this.newContentTitle[sectionId];
    const video = this.newContentVideo[sectionId];
    if (!title) return;

    this.uploadingContent = true;
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Description', '');
    formData.append('SectionId', sectionId.toString());
    formData.append('CourseId', this.courseId.toString());
    if (video) formData.append('VideoUpload', video);

    this.instructorService.createContent(formData).subscribe({
      next: () => {
        this.toast.success('Lecture added');
        this.newContentTitle[sectionId] = '';
        delete this.newContentVideo[sectionId];
        this.showContentForm[sectionId] = false;
        this.uploadingContent = false;
        this.loadCourse();
      },
      error: () => {
        this.toast.error('Failed to add lecture');
        this.uploadingContent = false;
      }
    });
  }

  deleteContent(id: number) {
    if (confirm('Are you sure you want to delete this lecture?')) {
      this.instructorService.deleteContent(id).subscribe({
        next: () => {
          this.toast.success('Lecture deleted');
          this.loadCourse();
        }
      });
    }
  }

  saveBasics() {
    if (!this.course) return;
    const formData = new FormData();
    formData.append('Title', this.course.title);
    formData.append('Description', this.course.description);
    formData.append('Price', this.course.price.toString());
    formData.append('Status', this.course.status);
    formData.append('SubcategoryId', '1'); // Fallback placeholder since we aren't editing categories here
    formData.append('IsQuiz', this.course.isQuiz ? 'true' : 'false');
    
    this.instructorService.updateCourse(this.course.id, formData).subscribe({
      next: () => this.toast.success('Course updated successfully'),
      error: () => this.toast.error('Failed to update course')
    });
  }
}

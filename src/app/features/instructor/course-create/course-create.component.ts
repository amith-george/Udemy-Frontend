import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InstructorService } from '../../../core/services/instructor.service';
import { CategoryService, CategoryWithSubcategories } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="header">
      <a routerLink="/instructor/courses" class="btn btn-ghost">&larr; Back to courses</a>
      <h1 class="serif-heading">Create a new course</h1>
    </div>

    <form class="create-form" (ngSubmit)="onSubmit()" #form="ngForm">
      <div class="form-group">
        <label class="form-label">Course Title</label>
        <input type="text" class="form-input" name="title" [(ngModel)]="title" required maxlength="60" placeholder="e.g. Learn Python from Scratch" />
      </div>

      <div class="form-group">
        <label class="form-label">Course Description</label>
        <textarea class="form-input" name="description" [(ngModel)]="description" required rows="4" placeholder="What will students learn?"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label class="form-label">Price (₹)</label>
          <input type="number" class="form-input" name="price" [(ngModel)]="price" required min="0" />
        </div>
        
        <div class="form-group half">
          <label class="form-label">Category</label>
          <select class="form-input" name="subcategoryId" [(ngModel)]="subcategoryId" required>
            <option value="0" disabled>Select a category</option>
            <optgroup *ngFor="let cat of categories" [label]="cat.name">
              <option *ngFor="let sub of cat.subcategories" [value]="sub.id">{{ sub.name }}</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Course Thumbnail Image</label>
        <input type="file" class="form-input file-input" (change)="onFileSelected($event)" accept="image/*" required />
        <p class="help-text">Upload your course image here. Important guidelines: 750x422 pixels; .jpg, .jpeg, .gif, or .png.</p>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary btn-lg" [disabled]="!form.valid || !thumbnailImage || loading">
          {{ loading ? 'Creating...' : 'Create Course' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .header { margin-bottom: 32px; }
    h1 { margin-top: 16px; font-size: 2.4rem; }
    .create-form { max-width: 600px; background: #fff; padding: 24px; border: 1px solid var(--border-color); }
    .form-row { display: flex; gap: 16px; }
    .half { flex: 1; }
    textarea.form-input { height: auto; padding: 12px 16px; resize: vertical; }
    .file-input { padding: 10px; }
    .help-text { font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; }
    .actions { margin-top: 32px; border-top: 1px solid var(--border-color); padding-top: 24px; display: flex; justify-content: flex-end; }
  `]
})
export class CourseCreateComponent implements OnInit {
  categories: CategoryWithSubcategories[] = [];
  
  title = '';
  description = '';
  price = 0;
  subcategoryId = 0;
  thumbnailImage: File | null = null;
  loading = false;

  constructor(
    private instructorService: InstructorService,
    private categoryService: CategoryService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getCategoriesWithSubcategories().subscribe(res => {
      this.categories = res;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.thumbnailImage = file;
    }
  }

  onSubmit() {
    if (!this.title || !this.description || !this.subcategoryId || !this.thumbnailImage) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('Price', this.price.toString());
    formData.append('Status', 'Draft');
    formData.append('SubcategoryId', this.subcategoryId.toString());
    formData.append('ThumbnailImage', this.thumbnailImage); // backend expects ThumbnailImage

    this.instructorService.createCourse(formData).subscribe({
      next: (res) => {
        this.toast.success('Course created successfully! Now add some content.');
        this.router.navigate(['/instructor/course', res.courseId, 'manage']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to create course');
        this.loading = false;
      }
    });
  }
}

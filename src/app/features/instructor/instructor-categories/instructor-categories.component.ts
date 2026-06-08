import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryWithSubcategories } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-instructor-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-header">
      <h1 class="serif-heading">Category Management</h1>
      <p>Add new categories and subcategories to classify courses properly.</p>
    </div>

    <div class="forms-grid">
      <!-- Create Parent Category -->
      <div class="card">
        <h3>Create Parent Category</h3>
        <form (ngSubmit)="addCategory()" #catForm="ngForm">
          <div class="form-group">
            <label class="form-label">Category Name</label>
            <input type="text" class="form-input" [(ngModel)]="newCategoryName" name="catName" required placeholder="e.g. Development">
          </div>
          <div class="form-group">
            <label class="form-label">Description (Optional)</label>
            <textarea class="form-input" [(ngModel)]="newCategoryDesc" name="catDesc" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!catForm.valid">Add Category</button>
        </form>
      </div>

      <!-- Create Subcategory -->
      <div class="card">
        <h3>Create Subcategory</h3>
        <form (ngSubmit)="addSubcategory()" #subForm="ngForm">
          <div class="form-group">
            <label class="form-label">Parent Category</label>
            <select class="form-input" [(ngModel)]="selectedParentId" name="parentId" required>
              <option value="0" disabled>Select Parent...</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Subcategory Name</label>
            <input type="text" class="form-input" [(ngModel)]="newSubName" name="subName" required placeholder="e.g. Web Development">
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!subForm.valid || selectedParentId === 0">Add Subcategory</button>
        </form>
      </div>
    </div>

    <!-- Existing Categories List -->
    <div class="categories-list">
      <h3>Existing Classification Tree</h3>
      <div class="category-item" *ngFor="let cat of categories">
        <div class="cat-title">
          <strong>{{ cat.name }}</strong>
        </div>
        <div class="subcat-list">
          <span class="badge badge-purple" *ngFor="let sub of cat.subcategories">{{ sub.name }}</span>
          <span class="badge badge-free" *ngIf="cat.subcategories.length === 0">No subcategories yet</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-header { margin-bottom: 32px; }
    h1 { font-size: 2.4rem; margin-bottom: 8px; }
    .forms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 48px; }
    .card { background: var(--bg-white); border: 1px solid var(--border-color); padding: 24px; }
    .card h3 { margin-bottom: 16px; font-family: var(--font-serif); }
    .categories-list h3 { margin-bottom: 16px; font-family: var(--font-serif); }
    .category-item { background: var(--bg-light); border: 1px solid var(--border-color); padding: 16px; margin-bottom: 12px; }
    .cat-title { font-size: 1.1rem; margin-bottom: 12px; }
    .subcat-list { display: flex; flex-wrap: wrap; gap: 8px; }
    @media (max-width: 768px) { .forms-grid { grid-template-columns: 1fr; } }
  `]
})
export class InstructorCategoriesComponent implements OnInit {
  categories: CategoryWithSubcategories[] = [];

  newCategoryName = '';
  newCategoryDesc = '';

  selectedParentId = 0;
  newSubName = '';

  constructor(private categoryService: CategoryService, private toast: ToastService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getCategoriesWithSubcategories().subscribe(res => {
      this.categories = res;
    });
  }

  addCategory() {
    if (!this.newCategoryName) return;
    this.categoryService.createCategory({ name: this.newCategoryName, description: this.newCategoryDesc })
      .subscribe({
        next: () => {
          this.toast.success('Category created successfully');
          this.newCategoryName = '';
          this.newCategoryDesc = '';
          this.loadData();
        },
        error: () => this.toast.error('Failed to create category')
      });
  }

  addSubcategory() {
    if (!this.newSubName || this.selectedParentId === 0) return;
    this.categoryService.createSubcategory({ name: this.newSubName, categoryId: Number(this.selectedParentId) })
      .subscribe({
        next: () => {
          this.toast.success('Subcategory created successfully');
          this.newSubName = '';
          this.loadData();
        },
        error: () => this.toast.error('Failed to create subcategory')
      });
  }
}

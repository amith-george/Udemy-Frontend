import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseService, CourseDto } from '../../../core/services/course.service';
import { CategoryService, CategoryWithSubcategories } from '../../../core/services/category.service';
import { CourseCardComponent } from '../../../shared/course-card/course-card.component';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CourseCardComponent, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="browse-layout page-enter">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3>Categories</h3>
          <div class="filter-list">
            <button class="filter-item" [class.active]="!selectedCategory" (click)="filterByCategory(null)">All Courses</button>
            <button class="filter-item" *ngFor="let cat of categories"
                    [class.active]="selectedCategory === cat.id"
                    (click)="filterByCategory(cat.id)">
              {{ cat.name }}
              <span class="filter-count">{{ cat.subcategories.length }}</span>
            </button>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>Price</h3>
          <div class="filter-list">
            <button class="filter-item" [class.active]="priceFilter === 'all'" (click)="priceFilter='all'; applyFilters()">All</button>
            <button class="filter-item" [class.active]="priceFilter === 'free'" (click)="priceFilter='free'; applyFilters()">Free</button>
            <button class="filter-item" [class.active]="priceFilter === 'paid'" (click)="priceFilter='paid'; applyFilters()">Paid</button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="browse-main">
        <div class="browse-header">
          <h1>
            <span *ngIf="searchQuery">Results for "<em>{{ searchQuery }}</em>"</span>
            <span *ngIf="!searchQuery">Explore All Courses</span>
          </h1>
          <p class="result-count">{{ filteredCourses.length }} courses found</p>
        </div>

        <!-- Search Bar -->
        <div class="search-row">
          <div class="search-field">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder="Search courses..." [(ngModel)]="searchQuery" (input)="applyFilters()" />
          </div>
          <select class="sort-select" [(ngModel)]="sortBy" (change)="applyFilters()">
            <option value="default">Sort: Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        <!-- Loading / Results -->
        <div class="course-grid" *ngIf="!loading && filteredCourses.length > 0">
          <app-course-card *ngFor="let course of filteredCourses" [course]="course"></app-course-card>
        </div>

        <div class="course-grid" *ngIf="loading">
          <div class="skeleton-card" *ngFor="let p of [1,2,3,4,5,6]"></div>
        </div>

        <div class="empty-state" *ngIf="!loading && filteredCourses.length === 0">
          <div class="empty-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your filters or search query</p>
          <button class="btn btn-outline" (click)="clearFilters()">Clear Filters</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-layout {
      display: flex; gap: 0; min-height: 100dvh;
      padding-top: 64px;
    }
    .sidebar {
      width: 260px; flex-shrink: 0;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      padding: 32px 20px; position: sticky;
      top: 64px; height: calc(100dvh - 64px); overflow-y: auto;
    }
    .sidebar-section { margin-bottom: 32px; }
    .sidebar-section h3 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 12px; font-weight: 700; }
    .filter-list { display: flex; flex-direction: column; gap: 4px; }
    .filter-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; border-radius: var(--radius-md);
      font-size: 0.875rem; color: var(--text-secondary);
      cursor: pointer; border: none; background: none;
      text-align: left; font-family: 'Inter', sans-serif;
      transition: all var(--transition-fast);
    }
    .filter-item:hover { background: var(--bg-glass); color: var(--text-primary); }
    .filter-item.active { background: rgba(164,53,240,0.12); color: var(--brand-purple-light); font-weight: 600; }
    .filter-count { font-size: 0.7rem; color: var(--text-muted); background: var(--bg-card); padding: 2px 7px; border-radius: var(--radius-full); }
    .browse-main { flex: 1; padding: 32px 40px; }
    .browse-header { margin-bottom: 24px; }
    .browse-header h1 { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); }
    .browse-header h1 em { color: var(--brand-purple-light); font-style: normal; }
    .result-count { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }
    .search-row { display: flex; gap: 12px; margin-bottom: 28px; }
    .search-field {
      flex: 1; display: flex; align-items: center; gap: 10px;
      background: var(--bg-secondary); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); padding: 0 16px; height: 44px;
    }
    .search-field svg { color: var(--text-muted); flex-shrink: 0; }
    .search-field input { background: none; border: none; outline: none; color: var(--text-primary); font-family: 'Inter', sans-serif; width: 100%; font-size: 0.9rem; }
    .sort-select {
      background: var(--bg-secondary); border: 1px solid var(--border-color);
      border-radius: var(--radius-md); padding: 0 16px; height: 44px;
      color: var(--text-primary); font-family: 'Inter', sans-serif; font-size: 0.88rem;
      cursor: pointer; outline: none;
    }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 3rem; margin-bottom: 16px; }
    .empty-state h3 { font-size: 1.3rem; margin-bottom: 8px; }
    .empty-state p { color: var(--text-muted); margin-bottom: 24px; }
    .skeleton-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); height: 310px; animation: shimmer 1.5s infinite; background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%); background-size: 200% 100%; }
    @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
    @media (max-width: 900px) { .sidebar { display: none; } .browse-main { padding: 24px 16px; } }
  `]
})
export class BrowseComponent implements OnInit {
  allCourses: CourseDto[] = [];
  filteredCourses: CourseDto[] = [];
  categories: CategoryWithSubcategories[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory: number | null = null;
  priceFilter = 'all';
  sortBy = 'default';

  constructor(private courseService: CourseService, private categoryService: CategoryService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (params['category']) this.selectedCategory = +params['category'];
    });
    this.courseService.getAllCourses().subscribe({ next: c => { this.allCourses = c; this.applyFilters(); this.loading = false; } });
    this.categoryService.getCategoriesWithSubcategories().subscribe({ next: c => this.categories = c });
  }

  filterByCategory(id: number | null): void { this.selectedCategory = id; this.applyFilters(); }

  applyFilters(): void {
    let result = [...this.allCourses];
    if (this.searchQuery.trim()) result = result.filter(c => c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.instructorName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    if (this.selectedCategory) result = result.filter(c => c.subcategoryName !== null); // category filter placeholder
    if (this.priceFilter === 'free') result = result.filter(c => c.price === 0);
    if (this.priceFilter === 'paid') result = result.filter(c => c.price > 0);
    if (this.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (this.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (this.sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
    this.filteredCourses = result;
  }

  clearFilters(): void { this.searchQuery = ''; this.selectedCategory = null; this.priceFilter = 'all'; this.sortBy = 'default'; this.applyFilters(); }
}

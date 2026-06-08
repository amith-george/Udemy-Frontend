import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { instructorGuard } from './core/guards/instructor.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'verify-otp', loadComponent: () => import('./features/auth/otp/otp.component').then(m => m.OtpComponent) },
  { path: 'courses', loadComponent: () => import('./features/courses/browse/browse.component').then(m => m.BrowseComponent) },
  { path: 'courses/:id', loadComponent: () => import('./features/courses/detail/detail.component').then(m => m.DetailComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'checkout/success', loadComponent: () => import('./features/checkout/success/success.component').then(m => m.SuccessComponent), canActivate: [authGuard] },
  { path: 'my-learning', loadComponent: () => import('./features/student/my-learning/my-learning.component').then(m => m.MyLearningComponent), canActivate: [authGuard] },
  { path: 'player/:id', loadComponent: () => import('./features/student/player/player.component').then(m => m.PlayerComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./features/student/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  
  // Instructor Routes
  { 
    path: 'instructor', 
    loadComponent: () => import('./features/instructor/instructor-layout/instructor-layout.component').then(m => m.InstructorLayoutComponent),
    canActivate: [instructorGuard],
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', loadComponent: () => import('./features/instructor/instructor-courses/instructor-courses.component').then(m => m.InstructorCoursesComponent) },
      { path: 'course/create', loadComponent: () => import('./features/instructor/course-create/course-create.component').then(m => m.CourseCreateComponent) },
      { path: 'course/:id/manage', loadComponent: () => import('./features/instructor/course-manage/course-manage.component').then(m => m.CourseManageComponent) },
      { path: 'categories', loadComponent: () => import('./features/instructor/instructor-categories/instructor-categories.component').then(m => m.InstructorCategoriesComponent) },
      // Optional profile path later
      { path: 'profile', loadComponent: () => import('./features/student/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },

  { path: '**', redirectTo: '' }
];

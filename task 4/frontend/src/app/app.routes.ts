import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
      { path: 'blogs', loadComponent: () => import('./pages/blogs/blogs.component').then((m) => m.BlogsComponent) },
      { path: 'blog/:slug', loadComponent: () => import('./pages/blog-detail/blog-detail.component').then((m) => m.BlogDetailComponent) },
      { path: 'search', loadComponent: () => import('./pages/search/search.component').then((m) => m.SearchComponent) },
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then((m) => m.RegisterComponent) },
      { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'blogs', loadComponent: () => import('./pages/admin/blogs-admin/blogs-admin.component').then((m) => m.BlogsAdminComponent) },
      { path: 'blogs/new', loadComponent: () => import('./pages/admin/blog-form/blog-form.component').then((m) => m.BlogFormComponent) },
      { path: 'blogs/edit/:id', loadComponent: () => import('./pages/admin/blog-form/blog-form.component').then((m) => m.BlogFormComponent) },
      { path: 'comments', loadComponent: () => import('./pages/admin/comments-admin/comments-admin.component').then((m) => m.CommentsAdminComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users-admin/users-admin.component').then((m) => m.UsersAdminComponent) },
      { path: 'taxonomy', loadComponent: () => import('./pages/admin/taxonomy-admin/taxonomy-admin.component').then((m) => m.TaxonomyAdminComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];

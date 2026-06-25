import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'finance', loadComponent: () => import('./features/finance/finance.component').then(m => m.FinanceComponent) },
      { path: 'projects', loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'complaints', loadComponent: () => import('./features/complaints/complaints.component').then(m => m.ComplaintsComponent) },
      { path: 'maintenance', loadComponent: () => import('./features/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'polls', loadComponent: () => import('./features/polls/polls.component').then(m => m.PollsComponent) },
      { path: 'notices', loadComponent: () => import('./features/notices/notices.component').then(m => m.NoticesComponent) },
      { path: 'documents', loadComponent: () => import('./features/documents/documents.component').then(m => m.DocumentsComponent) },
      { path: 'vendors', loadComponent: () => import('./features/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: 'meetings', loadComponent: () => import('./features/meetings/meetings.component').then(m => m.MeetingsComponent) },
      { path: 'residents', loadComponent: () => import('./features/residents/residents.component').then(m => m.ResidentsComponent) },
      { path: 'analytics', loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];

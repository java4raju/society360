import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent)
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
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'settings/billing', loadComponent: () => import('./features/settings/billing.component').then(m => m.BillingComponent) },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-shell.component').then(m => m.AdminShellComponent),
        canActivate: [adminGuard],
        children: [
          { path: '', redirectTo: 'residents', pathMatch: 'full' },
          { path: 'residents', loadComponent: () => import('./features/admin/admin-residents/admin-residents.component').then(m => m.AdminResidentsComponent) },
          { path: 'transactions', loadComponent: () => import('./features/admin/admin-transactions/admin-transactions.component').then(m => m.AdminTransactionsComponent) },
          { path: 'complaints', loadComponent: () => import('./features/admin/admin-complaints/admin-complaints.component').then(m => m.AdminComplaintsComponent) },
          { path: 'projects', loadComponent: () => import('./features/admin/admin-projects/admin-projects.component').then(m => m.AdminProjectsComponent) },
          { path: 'notices', loadComponent: () => import('./features/admin/admin-notices/admin-notices.component').then(m => m.AdminNoticesComponent) },
          { path: 'vendors', loadComponent: () => import('./features/admin/admin-vendors/admin-vendors.component').then(m => m.AdminVendorsComponent) },
          { path: 'meetings', loadComponent: () => import('./features/admin/admin-meetings/admin-meetings.component').then(m => m.AdminMeetingsComponent) },
          { path: 'polls', loadComponent: () => import('./features/admin/admin-polls/admin-polls.component').then(m => m.AdminPollsComponent) },
          { path: 'import', loadComponent: () => import('./features/admin/admin-import/admin-import.component').then(m => m.AdminImportComponent) },
        ]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

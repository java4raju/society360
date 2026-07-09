import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface AdminNav { label: string; icon: string; route: string; }

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  template: `
    <div class="admin-layout fade-in">
      <aside class="admin-sidebar glass-card">
        <div class="admin-title">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>Admin Panel</span>
        </div>
        <nav>
          @for (item of nav; track item.route) {
            <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.route === '/admin'}">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>
      <div class="admin-content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; gap: 1.5rem; padding: 1.5rem; min-height: calc(100vh - 64px); align-items: flex-start; }
    .admin-sidebar { width: 220px; flex-shrink: 0; padding: 1rem; border-radius: 16px; position: sticky; top: 80px; }
    .admin-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1rem; padding: .5rem .75rem 1rem; color: var(--primary); border-bottom: 1px solid var(--border); margin-bottom: .5rem; }
    nav { display: flex; flex-direction: column; gap: 2px; }
    nav a { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; text-decoration: none; font-size: .875rem; font-weight: 500; color: var(--text-secondary); transition: all .2s; cursor: pointer; }
    nav a:hover { background: var(--hover); color: var(--text-primary); }
    nav a.active { background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); font-weight: 600; }
    nav a mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .admin-content { flex: 1; min-width: 0; }
    @media (max-width: 768px) {
      .admin-layout { flex-direction: column; padding: 1rem; }
      .admin-sidebar { width: 100%; position: static; }
    }
  `]
})
export class AdminShellComponent {
  nav: AdminNav[] = [
    { label: 'Residents', icon: 'diversity_3', route: '/admin/residents' },
    { label: 'Transactions', icon: 'account_balance_wallet', route: '/admin/transactions' },
    { label: 'Complaints', icon: 'report_problem', route: '/admin/complaints' },
    { label: 'Projects', icon: 'view_kanban', route: '/admin/projects' },
    { label: 'Notices', icon: 'campaign', route: '/admin/notices' },
    { label: 'Vendors', icon: 'handshake', route: '/admin/vendors' },
    { label: 'Meetings', icon: 'groups', route: '/admin/meetings' },
    { label: 'Polls', icon: 'how_to_vote', route: '/admin/polls' },
    { label: 'Bulk Import', icon: 'upload_file', route: '/admin/import' },
  ];
}

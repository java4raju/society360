import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/services/theme.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  template: `
    <div class="shell" [class.collapsed]="collapsed()" [class.mobile-open]="mobileOpen()">
      <aside class="sidebar">
        <div class="brand">
          <span class="logo"><mat-icon>holiday_village</mat-icon></span>
          <span class="name">Society<b>360</b></span>
        </div>
        <nav>
          @for (item of nav; track item.route) {
            <a [routerLink]="item.route" routerLinkActive="active" (click)="closeMobile()"
               [matTooltip]="collapsed() ? item.label : ''" matTooltipPosition="right">
              <mat-icon>{{ item.icon }}</mat-icon>
              <span class="lbl">{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="side-foot">
          <a (click)="logout()" class="logout">
            <mat-icon>logout</mat-icon><span class="lbl">Logout</span>
          </a>
        </div>
      </aside>

      <div class="backdrop" (click)="closeMobile()"></div>

      <div class="main">
        <header class="topbar glass-card">
          <button mat-icon-button class="hamburger" (click)="toggleMobile()"><mat-icon>menu</mat-icon></button>
          <button mat-icon-button class="collapse-btn" (click)="toggleCollapse()">
            <mat-icon>{{ collapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
          <div class="search">
            <mat-icon>search</mat-icon>
            <input placeholder="Search residents, complaints, transactions…" />
          </div>
          <div class="spacer"></div>
          <button mat-icon-button (click)="theme.toggle()" [matTooltip]="isDark() ? 'Light mode' : 'Dark mode'">
            <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Notifications"><mat-icon>notifications</mat-icon></button>
          <button class="profile" [matMenuTriggerFor]="menu">
            <span class="avatar">{{ initials() }}</span>
            <span class="who">
              <span class="n">{{ user()?.name }}</span>
              <span class="r">{{ user()?.role }}</span>
            </span>
            <mat-icon>expand_more</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item routerLink="/settings"><mat-icon>settings</mat-icon> Settings</button>
            <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon> Logout</button>
          </mat-menu>
        </header>

        <main class="content"><router-outlet></router-outlet></main>
      </div>
    </div>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  theme = inject(ThemeService);

  collapsed = signal(false);
  mobileOpen = signal(false);
  user = this.auth.user;
  isDark = computed(() => this.theme.theme() === 'dark');
  initials = computed(() => (this.user()?.name ?? 'A').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase());

  nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Finance', icon: 'account_balance_wallet', route: '/finance' },
    { label: 'Projects', icon: 'view_kanban', route: '/projects' },
    { label: 'Complaints', icon: 'report_problem', route: '/complaints' },
    { label: 'Maintenance', icon: 'home_repair_service', route: '/maintenance' },
    { label: 'Polls', icon: 'how_to_vote', route: '/polls' },
    { label: 'Notices', icon: 'campaign', route: '/notices' },
    { label: 'Documents', icon: 'folder', route: '/documents' },
    { label: 'Vendors', icon: 'handshake', route: '/vendors' },
    { label: 'Meetings', icon: 'groups', route: '/meetings' },
    { label: 'Residents', icon: 'diversity_3', route: '/residents' },
    { label: 'Analytics', icon: 'monitoring', route: '/analytics' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  toggleCollapse() { this.collapsed.update(c => !c); }
  toggleMobile() { this.mobileOpen.update(c => !c); }
  closeMobile() { this.mobileOpen.set(false); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}

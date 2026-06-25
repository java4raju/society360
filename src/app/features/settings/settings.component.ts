import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/auth/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, PageHeaderComponent],
  template: `
    <app-page-header icon="settings" title="Settings" subtitle="Appearance, profile and environment configuration."></app-page-header>

    <div class="grid fade-in">
      <div class="glass-card sect">
        <h3><mat-icon>palette</mat-icon> Appearance</h3>
        <p>Choose how Society360 looks for you.</p>
        <div class="themes">
          <button class="theme-opt" [class.on]="theme.theme()==='light'" (click)="theme.set('light')">
            <div class="prev light"><span></span><span></span><span></span></div>
            <div class="t-label"><mat-icon>light_mode</mat-icon> Light</div>
          </button>
          <button class="theme-opt" [class.on]="theme.theme()==='dark'" (click)="theme.set('dark')">
            <div class="prev dark"><span></span><span></span><span></span></div>
            <div class="t-label"><mat-icon>dark_mode</mat-icon> Dark</div>
          </button>
        </div>
      </div>

      <div class="glass-card sect">
        <h3><mat-icon>account_circle</mat-icon> Profile</h3>
        <div class="profile">
          <span class="avatar">{{ initials() }}</span>
          <div><b>{{ user()?.name }}</b><span>{{ user()?.role }}</span></div>
        </div>
        <mat-form-field appearance="outline"><mat-label>Full Name</mat-label><input matInput [(ngModel)]="name" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput [(ngModel)]="email" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Role</mat-label><input matInput [value]="user()?.role" disabled /></mat-form-field>
        <button mat-flat-button color="primary" (click)="saved.set(true)">
          <mat-icon>save</mat-icon> Save Changes
        </button>
        @if (saved()) { <span class="ok"><mat-icon>check_circle</mat-icon> Profile saved</span> }
      </div>

      <div class="glass-card sect">
        <h3><mat-icon>dns</mat-icon> Data Source</h3>
        <p>Toggle between mock data and the live backend API.</p>
        <div class="toggle-row">
          <div>
            <b>Use Backend API</b>
            <span>When off, the app serves realistic mock data.</span>
          </div>
          <mat-slide-toggle [(ngModel)]="useBackend"></mat-slide-toggle>
        </div>
        <div class="note">
          <mat-icon>info</mat-icon>
          This is a demo toggle. Backend mode requires a running API at the configured URL.
        </div>
      </div>

      <div class="glass-card sect">
        <h3><mat-icon>terminal</mat-icon> Environment</h3>
        <div class="env">
          <div class="env-row"><span>Mode</span><b>{{ env.production ? 'Production' : 'Development' }}</b></div>
          <div class="env-row"><span>Backend Enabled</span><b>{{ env.useBackend ? 'Yes' : 'No (mock)' }}</b></div>
          <div class="env-row"><span>API URL</span><b class="mono">{{ env.apiUrl }}</b></div>
          <div class="env-row"><span>App Version</span><b>1.0.0</b></div>
          <div class="env-row"><span>Framework</span><b>Angular 20 · Standalone · Signals</b></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(2,1fr); gap:18px; }
    .sect { padding:22px; display:flex; flex-direction:column; gap:6px; }
    .sect h3 { display:flex; align-items:center; gap:8px; font-size:1.05rem; }
    .sect h3 mat-icon { color: var(--s-primary); }
    .sect > p { font-size:.84rem; margin:0 0 8px; }
    .themes { display:flex; gap:14px; margin-top:8px; }
    .theme-opt { flex:1; border:2px solid var(--s-border); border-radius:14px; padding:12px; background:transparent; cursor:pointer; transition: all .2s; font-family:inherit; }
    .theme-opt.on { border-color: var(--s-primary); }
    .prev { height:64px; border-radius:10px; padding:10px; display:flex; flex-direction:column; gap:5px; }
    .prev.light { background:#f5f6fb; } .prev.dark { background:#15151f; }
    .prev span { height:8px; border-radius:4px; }
    .prev.light span { background:#d6d8e8; } .prev.light span:first-child { background:#6366f1; width:50%; }
    .prev.dark span { background:#2a2a3a; } .prev.dark span:first-child { background:#8b5cf6; width:50%; }
    .t-label { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:10px; font-weight:600; font-size:.86rem; color: var(--s-text); }
    .t-label mat-icon { font-size:18px; width:18px; height:18px; }
    .profile { display:flex; align-items:center; gap:13px; margin:6px 0 14px; }
    .avatar { width:54px; height:54px; border-radius:15px; display:grid; place-items:center; font-weight:800; color:#fff; font-size:1.1rem;
      background: linear-gradient(135deg, var(--s-primary), var(--s-violet)); }
    .profile b { display:block; } .profile span { font-size:.8rem; color: var(--s-text-faint); }
    .ok { display:inline-flex; align-items:center; gap:5px; color: var(--s-success); font-size:.82rem; font-weight:600; margin-top:6px; }
    .ok mat-icon { font-size:17px; width:17px; height:17px; }
    .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px; border:1px solid var(--s-border); border-radius:12px; background: var(--s-surface-2); }
    .toggle-row b { display:block; font-size:.9rem; } .toggle-row span { font-size:.78rem; color: var(--s-text-faint); }
    .note { display:flex; align-items:center; gap:8px; font-size:.78rem; color: var(--s-text-faint); margin-top:12px; }
    .note mat-icon { font-size:17px; width:17px; height:17px; color: var(--s-accent); }
    .env { display:flex; flex-direction:column; gap:2px; margin-top:6px; }
    .env-row { display:flex; justify-content:space-between; gap:10px; padding:11px 0; border-bottom:1px solid var(--s-border); font-size:.86rem; }
    .env-row:last-child { border-bottom:none; }
    .env-row span { color: var(--s-text-soft); } .env-row b { text-align:right; }
    .mono { font-family: ui-monospace, monospace; font-size:.8rem; }
    @media (max-width: 820px){ .grid { grid-template-columns:1fr; } }
  `]
})
export class SettingsComponent {
  theme = inject(ThemeService);
  private auth = inject(AuthService);

  user = this.auth.user;
  env = environment;
  useBackend = environment.useBackend;
  name = this.user()?.name ?? '';
  email = this.user()?.email ?? '';
  saved = signal(false);

  initials() {
    return (this.user()?.name ?? 'A').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }
}

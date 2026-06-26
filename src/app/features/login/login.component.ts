import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="wrap">
      <div class="aside">
        <div class="brand"><span class="logo"><mat-icon>holiday_village</mat-icon></span> Society360</div>
        <h1>Run your residential community<br/>like a modern enterprise.</h1>
        <p>Finance, projects, complaints, polls, meetings and governance — all in one elegant portal.</p>
        <ul class="feats">
          <li><mat-icon>verified</mat-icon> Real-time financial visibility</li>
          <li><mat-icon>insights</mat-icon> Executive analytics & KPIs</li>
          <li><mat-icon>groups</mat-icon> Transparent resident governance</li>
        </ul>
      </div>
      <div class="panel">
        <form class="glass-card card fade-in" (ngSubmit)="submit()">
          <div class="m-logo"><mat-icon>holiday_village</mat-icon></div>
          <h2>Welcome back</h2>
          <p class="sub">Sign in to the Vilaasa RWA admin console</p>

          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput name="username" [(ngModel)]="username" autocomplete="username" required />
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput name="password" type="password" [(ngModel)]="password" autocomplete="current-password" required />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          @if (error()) { <div class="err"><mat-icon>error</mat-icon> {{ error() }}</div> }

          <button mat-flat-button color="primary" class="btn" type="submit">
            Sign In <mat-icon>arrow_forward</mat-icon>
          </button>
          <div class="hint">Demo credentials — <b>admin</b> / <b>admin</b></div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .wrap { min-height:100vh; display:grid; grid-template-columns: 1.1fr 1fr; }
    .aside {
      position:relative; padding: 64px 56px; color:#fff; display:flex; flex-direction:column; justify-content:center; gap:18px;
      background: linear-gradient(140deg, #4338ca 0%, #6d28d9 45%, #0891b2 110%);
      overflow:hidden;
    }
    .aside::after { content:''; position:absolute; inset:0;
      background: radial-gradient(600px 300px at 80% 10%, rgba(255,255,255,.18), transparent 60%); }
    .brand { display:flex; align-items:center; gap:10px; font-weight:800; font-size:1.3rem; z-index:1; }
    .logo, .m-logo { width:42px; height:42px; border-radius:12px; display:grid; place-items:center; background: rgba(255,255,255,.2); }
    .aside h1 { color:#fff; font-size:2.1rem; line-height:1.2; z-index:1; }
    .aside p { color: rgba(255,255,255,.85); max-width:440px; z-index:1; }
    .feats { list-style:none; padding:0; margin:14px 0 0; display:flex; flex-direction:column; gap:12px; z-index:1; }
    .feats li { display:flex; align-items:center; gap:10px; color:#fff; font-weight:500; }
    .feats mat-icon { color:#a5f3fc; }
    .panel { display:grid; place-items:center; padding: 32px; background: var(--s-bg-grad); }
    .card { width:100%; max-width: 400px; padding: 36px 32px; display:flex; flex-direction:column; gap:6px; }
    .m-logo { background: linear-gradient(135deg,var(--s-primary),var(--s-violet)); color:#fff; margin-bottom:8px; }
    .card h2 { font-size:1.5rem; }
    .sub { font-size:.86rem; margin:2px 0 16px; }
    .btn { height:48px; border-radius:12px; font-weight:700; margin-top:6px; display:flex; gap:6px; }
    .hint { text-align:center; font-size:.8rem; color: var(--s-text-faint); margin-top:14px; }
    .err { display:flex; align-items:center; gap:6px; color: var(--s-danger); font-size:.82rem; margin:4px 0; }
    .err mat-icon { font-size:18px; width:18px; height:18px; }
    @media (max-width: 900px){ .wrap { grid-template-columns:1fr; } .aside { display:none; } }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = 'admin';
  password = 'admin';
  error = signal('');

  submit(): void {
    if (this.auth.login(this.username.trim(), this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Invalid credentials. Use admin / admin.');
    }
  }
}

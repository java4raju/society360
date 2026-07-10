import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface RegistrationRequest {
  societyName: string;
  slug: string;
  rwaRegNumber: string;
  address: string;
  city: string;
  pincode: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  unitCount: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule, RouterLink,
    MatIconModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatStepperModule, MatSelectModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page">
      <div class="sidebar">
        <div class="brand">
          <span class="logo"><mat-icon>holiday_village</mat-icon></span>
          <span>Society360</span>
        </div>
        <div class="pitch">
          <h1>Your community deserves better software.</h1>
          <p>Join hundreds of RWAs managing finances, complaints, meetings and governance — all in one platform.</p>

          <ul class="benefits">
            <li><mat-icon>check_circle</mat-icon> 30-day free trial, no credit card</li>
            <li><mat-icon>check_circle</mat-icon> Import existing residents via CSV</li>
            <li><mat-icon>check_circle</mat-icon> Subdomain ready in under a minute</li>
            <li><mat-icon>check_circle</mat-icon> Bank transparency for residents</li>
          </ul>

          <div class="pricing-preview">
            <div class="plan">
              <div class="plan-name">Trial</div>
              <div class="plan-price">Free</div>
              <div class="plan-desc">30 days · 50 units</div>
            </div>
            <div class="plan featured">
              <div class="plan-name">Starter</div>
              <div class="plan-price">₹999<span>/mo</span></div>
              <div class="plan-desc">100 units</div>
            </div>
            <div class="plan">
              <div class="plan-name">Growth</div>
              <div class="plan-price">₹2,499<span>/mo</span></div>
              <div class="plan-desc">500 units</div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-panel">
        @if (!success()) {
          <div class="form-wrap fade-in">
            <h2>Register your society</h2>
            <p class="sub">Get started in 2 minutes</p>

            <form #f="ngForm" (ngSubmit)="submit(f)" novalidate>

              <div class="section-label">Society Details</div>

              <mat-form-field appearance="outline">
                <mat-label>Society name</mat-label>
                <input matInput name="societyName" [(ngModel)]="form.societyName" required
                       placeholder="Green Park Apartments RWA" />
              </mat-form-field>

              <div class="slug-row">
                <mat-form-field appearance="outline" class="slug-field">
                  <mat-label>Subdomain</mat-label>
                  <input matInput name="slug" [(ngModel)]="form.slug"
                         pattern="^[a-z0-9-]{3,50}$" required
                         (ngModelChange)="form.slug = $event.toLowerCase().replace(' ', '-')"
                         placeholder="greenpark" />
                  <mat-hint>.society360.in</mat-hint>
                </mat-form-field>
              </div>

              <div class="row-2">
                <mat-form-field appearance="outline">
                  <mat-label>City</mat-label>
                  <input matInput name="city" [(ngModel)]="form.city" required />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Pincode</mat-label>
                  <input matInput name="pincode" [(ngModel)]="form.pincode"
                         pattern="^[1-9][0-9]{5}$" maxlength="6" />
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>RWA Registration Number (optional)</mat-label>
                <input matInput name="rwaRegNumber" [(ngModel)]="form.rwaRegNumber" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Society Address</mat-label>
                <textarea matInput name="address" [(ngModel)]="form.address" rows="2"></textarea>
              </mat-form-field>

              <div class="section-label" style="margin-top:8px">Admin Account</div>

              <mat-form-field appearance="outline">
                <mat-label>Your name</mat-label>
                <input matInput name="adminName" [(ngModel)]="form.adminName" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" name="adminEmail" [(ngModel)]="form.adminEmail"
                       email required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput name="adminPhone" [(ngModel)]="form.adminPhone"
                       placeholder="+91 98765 43210" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput type="password" name="adminPassword"
                       [(ngModel)]="form.adminPassword" required minlength="8" />
                <mat-hint>Minimum 8 characters</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Number of units / flats</mat-label>
                <input matInput type="number" name="unitCount" [(ngModel)]="form.unitCount"
                       min="1" max="5000" required />
              </mat-form-field>

              @if (error()) {
                <div class="err"><mat-icon>error_outline</mat-icon> {{ error() }}</div>
              }

              <button mat-flat-button color="primary" class="submit-btn"
                      type="submit" [disabled]="loading()">
                @if (loading()) {
                  <mat-spinner diameter="20"></mat-spinner> Creating your society…
                } @else {
                  Start free trial <mat-icon>arrow_forward</mat-icon>
                }
              </button>

              <p class="login-link">Already registered? <a routerLink="/login">Sign in</a></p>
            </form>
          </div>
        } @else {
          <div class="success-panel fade-in">
            <div class="success-icon"><mat-icon>check_circle</mat-icon></div>
            <h2>You're all set!</h2>
            <p>Your society <strong>{{ form.societyName }}</strong> is ready.</p>
            <div class="subdomain-box">
              <span class="sub-label">Your portal URL</span>
              <span class="sub-url">{{ form.slug }}.society360.in</span>
            </div>
            <p class="verify-note">
              <mat-icon>mail</mat-icon>
              We've sent a verification email to <strong>{{ form.adminEmail }}</strong>.
              Please verify to activate your account.
            </p>
            <a routerLink="/login" mat-flat-button color="primary" class="submit-btn">
              Go to login <mat-icon>arrow_forward</mat-icon>
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    /* Sidebar */
    .sidebar {
      background: linear-gradient(150deg, #1e3a5f 0%, #0f1b2d 60%, #0a2a3c 100%);
      padding: 48px 52px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      color: #fff;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
      font-weight: 700;
    }
    .logo {
      width: 40px; height: 40px;
      border-radius: 10px;
      background: rgba(0,194,168,.25);
      display: grid;
      place-items: center;
      color: #00c2a8;
    }
    .pitch h1 {
      font-size: 1.9rem;
      line-height: 1.25;
      font-weight: 700;
      color: #fff;
      margin-bottom: 14px;
    }
    .pitch p {
      color: rgba(255,255,255,.7);
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .benefits {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 36px;
    }
    .benefits li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255,255,255,.9);
      font-size: .9rem;
    }
    .benefits mat-icon { color: #00c2a8; font-size: 18px; width: 18px; height: 18px; }

    /* Pricing preview */
    .pricing-preview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .plan {
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 10px;
      padding: 14px 12px;
      text-align: center;
    }
    .plan.featured {
      background: rgba(0,194,168,.12);
      border-color: rgba(0,194,168,.4);
    }
    .plan-name {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .8px;
      text-transform: uppercase;
      color: rgba(255,255,255,.5);
      margin-bottom: 4px;
    }
    .plan.featured .plan-name { color: #00c2a8; }
    .plan-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
    }
    .plan-price span { font-size: .75rem; font-weight: 400; color: rgba(255,255,255,.5); }
    .plan-desc { font-size: .7rem; color: rgba(255,255,255,.5); margin-top: 2px; }

    /* Form panel */
    .form-panel {
      background: var(--s-bg-grad, #f8fafc);
      display: grid;
      place-items: center;
      padding: 40px 32px;
      overflow-y: auto;
    }
    .form-wrap {
      width: 100%;
      max-width: 480px;
    }
    h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 4px; }
    .sub { color: var(--s-text-faint, #64748b); margin-bottom: 24px; font-size: .9rem; }

    .section-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .8px;
      text-transform: uppercase;
      color: var(--s-text-faint, #94a3b8);
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--s-border, #e2e8f0);
    }

    mat-form-field { width: 100%; margin-bottom: 6px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .slug-row { margin-bottom: 4px; }
    .slug-field { width: 100%; }

    .err {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--s-danger, #ef4444);
      font-size: .82rem;
      padding: 10px 14px;
      background: rgba(239,68,68,.08);
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .err mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .submit-btn {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }

    .login-link {
      text-align: center;
      font-size: .82rem;
      color: var(--s-text-faint, #64748b);
      margin-top: 16px;
    }
    .login-link a { color: var(--s-primary, #4338ca); text-decoration: none; font-weight: 600; }

    /* Success */
    .success-panel {
      width: 100%;
      max-width: 480px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .success-icon mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #00c2a8;
    }
    .subdomain-box {
      background: var(--s-surface, #fff);
      border: 2px solid #00c2a8;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }
    .sub-label { font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: var(--s-text-faint, #64748b); }
    .sub-url { font-size: 1.1rem; font-weight: 700; color: #00c2a8; }
    .verify-note {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: .85rem;
      color: var(--s-text-faint, #64748b);
    }
    .verify-note mat-icon { font-size: 18px; width: 18px; height: 18px; }

    @media (max-width: 860px) {
      .page { grid-template-columns: 1fr; }
      .sidebar { display: none; }
    }
  `]
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  success = signal(false);

  form: RegistrationRequest = {
    societyName: '',
    slug: '',
    rwaRegNumber: '',
    address: '',
    city: '',
    pincode: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    unitCount: 50
  };

  submit(f: NgForm): void {
    if (f.invalid) {
      f.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http.post<{ success: boolean; message: string; data: unknown }>(
      `${environment.apiUrl}/v1/public/register`,
      this.form
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.detail || err?.error?.message || 'Registration failed. Please try again.';
        this.error.set(msg);
      }
    });
  }
}

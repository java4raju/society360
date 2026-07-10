import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TenantService } from '../../core/services/tenant.service';

interface Plan {
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  maxUnits: number;
  maxStaff: number;
  features: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Trial',
    slug: 'trial',
    priceMonthly: 0,
    priceYearly: 0,
    maxUnits: 50,
    maxStaff: 2,
    features: ['All core features', '2 staff accounts', '500 MB storage', 'Email support']
  },
  {
    name: 'Starter',
    slug: 'starter',
    priceMonthly: 999,
    priceYearly: 9990,
    maxUnits: 100,
    maxStaff: 5,
    featured: true,
    features: ['All core features', '5 staff accounts', '5 GB storage', 'Bank transparency (read)', 'Priority support']
  },
  {
    name: 'Growth',
    slug: 'growth',
    priceMonthly: 2499,
    priceYearly: 24990,
    maxUnits: 500,
    maxStaff: 20,
    features: ['Everything in Starter', '20 staff accounts', '25 GB storage', 'Bank integration (full)', 'API access', 'Custom domain', 'Dedicated support']
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    priceMonthly: 0,
    priceYearly: 0,
    maxUnits: 9999,
    maxStaff: 100,
    features: ['Everything in Growth', 'Dedicated database', 'White-label branding', 'SSO / SAML', 'SLA guarantee', 'Custom contract']
  }
];

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [DecimalPipe, MatIconModule, MatButtonModule],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1>Subscription & Billing</h1>
          <p class="sub">Manage your Society360 plan</p>
        </div>
      </div>

      @if (tenantSvc.tenant()) {
        <div class="current-plan">
          <div class="cp-label">Current Plan</div>
          <div class="cp-name">{{ tenantSvc.tenant()?.planName ?? 'Trial' }}</div>
          <div class="cp-status" [class.trial]="tenantSvc.isTrial()" [class.active]="!tenantSvc.isTrial()">
            {{ tenantSvc.tenant()?.status }}
          </div>
          @if (tenantSvc.isTrial() && tenantSvc.trialDaysLeft() !== null) {
            <div class="cp-days">{{ tenantSvc.trialDaysLeft() }} days remaining in trial</div>
          }
        </div>
      }

      <div class="plans-grid">
        @for (plan of plans; track plan.slug) {
          <div class="plan-card" [class.featured]="plan.featured">
            @if (plan.featured) {
              <div class="popular-badge">Most Popular</div>
            }
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              @if (plan.priceMonthly === 0 && plan.slug !== 'trial') {
                <span class="price-val">Custom</span>
              } @else if (plan.priceMonthly === 0) {
                <span class="price-val">Free</span>
                <span class="price-period">30 days</span>
              } @else {
                <span class="price-val">₹{{ plan.priceMonthly | number }}</span>
                <span class="price-period">/month</span>
              }
            </div>
            @if (plan.priceYearly > 0) {
              <div class="price-yearly">₹{{ plan.priceYearly | number }}/year — save 2 months</div>
            }
            <div class="plan-limit">Up to {{ plan.maxUnits === 9999 ? 'unlimited' : plan.maxUnits }} units · {{ plan.maxStaff }} staff</div>

            <ul class="plan-features">
              @for (feat of plan.features; track feat) {
                <li><mat-icon>check</mat-icon> {{ feat }}</li>
              }
            </ul>

            @if (plan.slug === 'enterprise') {
              <button mat-stroked-button class="plan-btn">Contact sales</button>
            } @else {
              <button mat-flat-button [color]="plan.featured ? 'primary' : undefined" class="plan-btn">
                @if (isCurrentPlan(plan.slug)) { Current plan } @else { Upgrade to {{ plan.name }} }
              </button>
            }
          </div>
        }
      </div>

      <div class="billing-note">
        <mat-icon>info</mat-icon>
        Payments are processed securely via Razorpay. Invoices are emailed to the registered admin address.
        To upgrade or discuss enterprise pricing, contact <strong>billing&#64;society360.in</strong>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1100px; }
    .header { margin-bottom: 28px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
    .sub { color: var(--s-text-faint, #64748b); font-size: .9rem; }

    .current-plan {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--s-surface, #fff);
      border: 1px solid var(--s-border, #e2e8f0);
      border-radius: 12px;
      margin-bottom: 28px;
    }
    .cp-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--s-text-faint, #94a3b8); }
    .cp-name  { font-size: 1.1rem; font-weight: 700; }
    .cp-status {
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      background: #e0f5f7;
      color: #0f4c52;
    }
    .cp-status.active { background: #e6f4ed; color: #2e8b57; }
    .cp-days { font-size: .8rem; color: var(--s-text-faint, #64748b); margin-left: auto; }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .plan-card {
      background: var(--s-surface, #fff);
      border: 1px solid var(--s-border, #e2e8f0);
      border-radius: 14px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
    }
    .plan-card.featured {
      border-color: var(--s-primary, #4338ca);
      box-shadow: 0 0 0 2px rgba(67,56,202,.12);
    }
    .popular-badge {
      position: absolute;
      top: -1px; left: 50%; transform: translateX(-50%);
      background: var(--s-primary, #4338ca);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
      padding: 3px 12px;
      border-radius: 0 0 8px 8px;
    }
    .plan-name {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .8px;
      color: var(--s-text-faint, #94a3b8);
      margin-top: 12px;
    }
    .plan-card.featured .plan-name { color: var(--s-primary, #4338ca); }
    .price-val { font-size: 1.8rem; font-weight: 800; }
    .price-period { font-size: .8rem; color: var(--s-text-faint, #94a3b8); }
    .price-yearly { font-size: .75rem; color: #2e8b57; margin-bottom: 4px; }
    .plan-limit { font-size: .78rem; color: var(--s-text-faint, #94a3b8); margin-bottom: 12px; }
    .plan-features { list-style: none; padding: 0; flex: 1; display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
    .plan-features li { display: flex; align-items: center; gap: 7px; font-size: .82rem; }
    .plan-features mat-icon { font-size: 16px; width: 16px; height: 16px; color: #2e8b57; }
    .plan-btn { width: 100%; height: 40px; border-radius: 8px; font-weight: 600; }

    .billing-note {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 16px;
      background: var(--s-surface, #f8fafc);
      border: 1px solid var(--s-border, #e2e8f0);
      border-radius: 10px;
      font-size: .82rem;
      color: var(--s-text-faint, #64748b);
      line-height: 1.6;
    }
    .billing-note mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
  `]
})
export class BillingComponent {
  protected tenantSvc = inject(TenantService);
  protected plans = PLANS;

  isCurrentPlan(slug: string): boolean {
    return (this.tenantSvc.tenant()?.planName?.toLowerCase() ?? 'trial') === slug;
  }
}

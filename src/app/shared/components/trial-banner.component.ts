import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-trial-banner',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `
    @if (tenantSvc.isTrial() && tenantSvc.trialDaysLeft() !== null) {
      <div class="banner" [class.urgent]="(tenantSvc.trialDaysLeft() ?? 30) <= 7">
        <mat-icon>schedule</mat-icon>
        <span>
          @if ((tenantSvc.trialDaysLeft() ?? 0) > 0) {
            <strong>{{ tenantSvc.trialDaysLeft() }} days left</strong> on your free trial.
          } @else {
            <strong>Your trial has ended.</strong>
          }
          Upgrade to keep full access.
        </span>
        <a routerLink="/settings/billing" mat-stroked-button class="upgrade-btn">
          Upgrade now
        </a>
      </div>
    }
    @if (tenantSvc.isSuspended()) {
      <div class="banner suspended">
        <mat-icon>block</mat-icon>
        <span><strong>Account suspended.</strong> Please contact support or upgrade your plan to restore access.</span>
        <a routerLink="/settings/billing" mat-stroked-button class="upgrade-btn">View plans</a>
      </div>
    }
  `,
  styles: [`
    .banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      background: #e0f5f7;
      border-bottom: 1px solid #00c2a8;
      font-size: .85rem;
      color: #0f4c52;
    }
    .banner.urgent { background: #fdf0e4; border-color: #e07a2f; color: #7a3a0f; }
    .banner.suspended { background: #fee2e2; border-color: #ef4444; color: #7f1d1d; }
    .banner mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .banner span { flex: 1; }
    .upgrade-btn { font-size: .8rem; height: 30px; line-height: 30px; flex-shrink: 0; }

    :host-context([data-theme="dark"]) .banner {
      background: #0d2e32; color: #a0ede8; border-color: #00c2a8;
    }
    :host-context([data-theme="dark"]) .banner.urgent {
      background: #2a1a08; color: #e0a070; border-color: #e07a2f;
    }
    :host-context([data-theme="dark"]) .banner.suspended {
      background: #450a0a; color: #fca5a5; border-color: #ef4444;
    }
  `]
})
export class TrialBannerComponent {
  protected tenantSvc = inject(TenantService);
}

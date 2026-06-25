import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="glass-card hoverable card fade-in" [style.--accent]="color()">
      <div class="top">
        <div class="icon"><mat-icon>{{ icon() }}</mat-icon></div>
        @if (trend() !== null) {
          <span class="trend" [class.down]="(trend() ?? 0) < 0">
            <mat-icon>{{ (trend() ?? 0) >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
            {{ (trend() ?? 0) >= 0 ? '+' : '' }}{{ trend() }}%
          </span>
        }
      </div>
      <div class="value">{{ value() }}</div>
      <div class="label">{{ label() }}</div>
      <div class="bar"></div>
    </div>
  `,
  styles: [`
    .card { padding: 20px; position: relative; overflow: hidden; }
    .top { display:flex; justify-content: space-between; align-items: flex-start; }
    .icon {
      width: 46px; height: 46px; border-radius: 14px; display:grid; place-items:center;
      background: color-mix(in srgb, var(--accent) 16%, transparent);
      color: var(--accent);
    }
    .icon mat-icon { font-size: 24px; width:24px; height:24px; }
    .trend {
      display:inline-flex; align-items:center; gap:2px; font-size:12px; font-weight:700;
      color: var(--s-success); background: color-mix(in srgb, var(--s-success) 14%, transparent);
      padding: 3px 8px; border-radius: 999px;
    }
    .trend.down { color: var(--s-danger); background: color-mix(in srgb, var(--s-danger) 14%, transparent); }
    .trend mat-icon { font-size:14px; width:14px; height:14px; }
    .value { font-size: 1.7rem; font-weight: 800; margin-top: 16px; letter-spacing: -.03em; color: var(--s-text); }
    .label { font-size: .82rem; color: var(--s-text-soft); margin-top: 2px; font-weight: 500; }
    .bar { position:absolute; left:0; bottom:0; height:3px; width:100%;
      background: linear-gradient(90deg, var(--accent), transparent); opacity:.7; }
  `]
})
export class SummaryCardComponent {
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  color = input<string>('#6366f1');
  trend = input<number | null>(null);
}

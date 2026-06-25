import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Activity } from '../models/models';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="glass-card feed fade-in">
      <h3>Recent Activity</h3>
      <ul>
        @for (a of items(); track a.id) {
          <li>
            <span class="dot" [attr.data-type]="a.type"><mat-icon>{{ a.icon }}</mat-icon></span>
            <div class="body">
              <span class="t">{{ a.title }}</span>
              <span class="d">{{ a.detail }}</span>
            </div>
            <span class="time">{{ a.time }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .feed { padding: 20px; }
    .feed h3 { font-size:1rem; margin-bottom: 14px; }
    ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; }
    li { display:flex; align-items:center; gap:12px; padding: 11px 0; border-bottom:1px solid var(--s-border); }
    li:last-child { border-bottom:none; }
    .dot { width:38px; height:38px; border-radius:11px; display:grid; place-items:center; flex-shrink:0;
      background: color-mix(in srgb, var(--s-primary) 14%, transparent); color: var(--s-primary); }
    .dot[data-type="finance"]{ background: color-mix(in srgb, #10b981 16%, transparent); color:#10b981; }
    .dot[data-type="complaint"]{ background: color-mix(in srgb, #ef4444 16%, transparent); color:#ef4444; }
    .dot[data-type="project"]{ background: color-mix(in srgb, #8b5cf6 16%, transparent); color:#8b5cf6; }
    .dot[data-type="notice"]{ background: color-mix(in srgb, #f59e0b 16%, transparent); color:#f59e0b; }
    .dot[data-type="meeting"]{ background: color-mix(in srgb, #06b6d4 16%, transparent); color:#06b6d4; }
    .dot[data-type="resident"]{ background: color-mix(in srgb, #3b82f6 16%, transparent); color:#3b82f6; }
    .dot mat-icon { font-size:20px; width:20px; height:20px; }
    .body { display:flex; flex-direction:column; flex:1; min-width:0; }
    .t { font-size:.86rem; font-weight:600; color: var(--s-text); }
    .d { font-size:.78rem; color: var(--s-text-soft); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .time { font-size:.72rem; color: var(--s-text-faint); white-space:nowrap; }
  `]
})
export class ActivityFeedComponent {
  items = input.required<Activity[]>();
}

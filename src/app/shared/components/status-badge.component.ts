import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [style.--c]="color()">{{ status() }}</span>`,
  styles: [`
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 11px; border-radius: 999px;
      font-size: 12px; font-weight: 600; letter-spacing: .01em;
      color: var(--c);
      background: color-mix(in srgb, var(--c) 14%, transparent);
      border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
      white-space: nowrap;
    }
    .badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: var(--c); box-shadow: 0 0 8px var(--c);
    }
  `]
})
export class StatusBadgeComponent {
  status = input.required<string>();
  color = computed(() => {
    const s = this.status().toLowerCase();
    const map: Record<string, string> = {
      completed: '#10b981', resolved: '#10b981', active: '#10b981', paid: '#10b981', approved: '#3b82f6',
      pending: '#f59e0b', assigned: '#3b82f6', 'in progress': '#8b5cf6', proposed: '#06b6d4',
      open: '#ef4444', critical: '#ef4444', failed: '#ef4444', expired: '#ef4444', high: '#f97316',
      medium: '#f59e0b', low: '#64748b', closed: '#64748b', inactive: '#64748b', scheduled: '#06b6d4',
      cancelled: '#ef4444', vacant: '#64748b', owner: '#6366f1', tenant: '#8b5cf6'
    };
    return map[s] ?? '#6366f1';
  });
}

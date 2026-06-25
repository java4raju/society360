import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-widget',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="glass-card hoverable kpi fade-in" [style.--accent]="color()">
      <div class="head">
        <mat-icon>{{ icon() }}</mat-icon>
        <span>{{ label() }}</span>
      </div>
      <div class="val">{{ value() }}</div>
      @if (progress() !== null) {
        <div class="track"><div class="fill" [style.width.%]="progress()"></div></div>
      }
      @if (note()) { <div class="note">{{ note() }}</div> }
    </div>
  `,
  styles: [`
    .kpi { padding: 18px 20px; }
    .head { display:flex; align-items:center; gap:8px; color: var(--s-text-soft); font-size:.82rem; font-weight:600; }
    .head mat-icon { font-size:18px; width:18px; height:18px; color: var(--accent); }
    .val { font-size:1.45rem; font-weight:800; margin-top:8px; letter-spacing:-.02em; }
    .track { height:7px; border-radius:999px; background: color-mix(in srgb, var(--s-text-faint) 16%, transparent); margin-top:12px; overflow:hidden; }
    .fill { height:100%; border-radius:999px; background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, #fff)); transition: width .8s cubic-bezier(.2,.8,.2,1); }
    .note { font-size:.74rem; color: var(--s-text-faint); margin-top:8px; }
  `]
})
export class KpiWidgetComponent {
  icon = input<string>('insights');
  label = input.required<string>();
  value = input.required<string | number>();
  color = input<string>('#6366f1');
  progress = input<number | null>(null);
  note = input<string>('');
}

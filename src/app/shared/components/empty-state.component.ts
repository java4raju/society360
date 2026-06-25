import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty fade-in">
      <div class="circle"><mat-icon>{{ icon() }}</mat-icon></div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty { display:grid; place-items:center; text-align:center; padding: 56px 20px; gap: 6px; }
    .circle { width:72px; height:72px; border-radius:50%; display:grid; place-items:center;
      background: color-mix(in srgb, var(--s-primary) 12%, transparent); color: var(--s-primary); margin-bottom:8px; }
    .circle mat-icon { font-size:34px; width:34px; height:34px; }
    h3 { font-size:1.05rem; }
    p { font-size:.85rem; max-width: 360px; }
  `]
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input<string>('Nothing here yet');
  message = input<string>('There is no data to display right now.');
}

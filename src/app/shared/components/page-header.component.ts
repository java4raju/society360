import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <header class="ph">
      <div class="ph-icon"><mat-icon>{{ icon() }}</mat-icon></div>
      <div class="ph-text">
        <h1>{{ title() }}</h1>
        <p>{{ subtitle() }}</p>
      </div>
      <div class="ph-actions"><ng-content></ng-content></div>
    </header>
  `,
  styles: [`
    .ph {
      display: flex; align-items: center; gap: 18px;
      padding: 22px 26px; margin-bottom: 22px;
      border-radius: var(--s-radius);
      background:
        linear-gradient(120deg, color-mix(in srgb, var(--s-primary) 92%, #000) 0%, var(--s-violet) 55%, var(--s-accent) 120%);
      color: #fff; position: relative; overflow: hidden;
      box-shadow: 0 18px 40px -18px color-mix(in srgb, var(--s-violet) 60%, transparent);
    }
    .ph::after {
      content:''; position:absolute; inset:0;
      background: radial-gradient(500px 200px at 90% -40%, rgba(255,255,255,.28), transparent 60%);
    }
    .ph-icon {
      width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center;
      background: rgba(255,255,255,.18); backdrop-filter: blur(6px); z-index: 1;
    }
    .ph-icon mat-icon { font-size: 28px; width:28px; height:28px; }
    .ph-text { z-index: 1; flex: 1; }
    .ph-text h1 { color:#fff; font-size: 1.55rem; }
    .ph-text p { color: rgba(255,255,255,.82); margin: 4px 0 0; font-size: .9rem; }
    .ph-actions { z-index: 1; display:flex; gap:10px; flex-wrap: wrap; }
    @media (max-width: 640px){ .ph { flex-direction: column; align-items: flex-start; } }
  `]
})
export class PageHeaderComponent {
  icon = input<string>('dashboard');
  title = input.required<string>();
  subtitle = input<string>('');
}

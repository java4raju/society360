import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    @switch (variant()) {
      @case ('cards') {
        <div class="sk-cards">
          @for (i of repeat(); track i) {
            <div class="sk-card">
              <div class="shimmer" style="height:42px;width:42px;border-radius:12px"></div>
              <div class="shimmer" style="height:14px;width:60%;margin-top:14px"></div>
              <div class="shimmer" style="height:26px;width:80%;margin-top:10px"></div>
            </div>
          }
        </div>
      }
      @case ('table') {
        <div class="sk-table">
          <div class="shimmer" style="height:44px;width:100%"></div>
          @for (i of repeat(); track i) {
            <div class="shimmer" style="height:38px;width:100%;margin-top:8px"></div>
          }
        </div>
      }
      @case ('chart') {
        <div class="sk-chart">
          <div class="shimmer" style="height:16px;width:40%"></div>
          <div class="shimmer" style="height:220px;width:100%;margin-top:16px;border-radius:14px"></div>
        </div>
      }
      @default {
        <div class="sk-list">
          @for (i of repeat(); track i) {
            <div class="shimmer" style="height:64px;width:100%;margin-bottom:10px;border-radius:14px"></div>
          }
        </div>
      }
    }
  `,
  styles: [`
    :host { display: block; }
    .sk-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 18px; }
    .sk-card { background: var(--s-surface); border: 1px solid var(--s-border); border-radius: 18px; padding: 20px; }
    .sk-chart, .sk-table { background: var(--s-surface); border: 1px solid var(--s-border); border-radius: 18px; padding: 20px; }
  `]
})
export class SkeletonLoaderComponent {
  variant = input<'cards' | 'table' | 'chart' | 'list'>('list');
  count = input<number>(6);
  repeat() { return Array.from({ length: this.count() }, (_, i) => i); }
}

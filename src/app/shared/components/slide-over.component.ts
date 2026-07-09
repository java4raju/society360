import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-slide-over',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  animations: [
    trigger('overlay', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease', style({ opacity: 0 }))]),
    ]),
    trigger('panel', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('280ms cubic-bezier(.4,0,.2,1)', style({ transform: 'translateX(0)' }))]),
      transition(':leave', [animate('200ms cubic-bezier(.4,0,.2,1)', style({ transform: 'translateX(100%)' }))]),
    ]),
  ],
  template: `
    @if (open) {
      <div class="overlay" @overlay (click)="close.emit()"></div>
      <aside class="panel glass-card" @panel>
        <div class="panel-header">
          <div>
            <h2>{{ title }}</h2>
            @if (subtitle) { <p class="sub">{{ subtitle }}</p> }
          </div>
          <button mat-icon-button (click)="close.emit()"><mat-icon>close</mat-icon></button>
        </div>
        <div class="panel-body">
          <ng-content></ng-content>
        </div>
      </aside>
    }
  `,
  styles: [`
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 900; }
    .panel { position: fixed; top: 0; right: 0; bottom: 0; width: min(520px, 95vw); z-index: 901; display: flex; flex-direction: column; border-radius: 20px 0 0 20px; overflow: hidden; }
    .panel-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.5rem 1.5rem 1rem; border-bottom: 1px solid var(--border); flex-shrink: 0; }
    .panel-header h2 { margin: 0; font-size: 1.125rem; font-weight: 700; }
    .panel-header .sub { margin: 4px 0 0; font-size: .8rem; color: var(--text-secondary); }
    .panel-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
  `]
})
export class SlideOverComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Output() close = new EventEmitter<void>();
}

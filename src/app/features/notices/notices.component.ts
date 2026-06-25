import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Notice } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatChipsModule,
    SkeletonLoaderComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="campaign" title="Notices" subtitle="Announcements and circulars for the community."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader [count]="6"></app-skeleton-loader>
    } @else {
      <div class="toolbar fade-in">
        <mat-form-field appearance="outline" class="search">
          <mat-label>Search notices</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <div class="chips">
          <button class="chip" [class.on]="category()===''" (click)="category.set('')">All</button>
          @for (c of categories(); track c) {
            <button class="chip" [class.on]="category()===c" (click)="category.set(c)">{{ c }}</button>
          }
        </div>
      </div>

      @if (pinned().length) {
        <h3 class="sec fade-in"><mat-icon>push_pin</mat-icon> Pinned</h3>
        <div class="grid fade-in">
          @for (n of pinned(); track n.id) { <ng-container *ngTemplateOutlet="card; context:{ $implicit: n }"></ng-container> }
        </div>
      }

      <h3 class="sec fade-in"><mat-icon>list</mat-icon> Latest Notices</h3>
      @if (latest().length === 0) {
        <app-empty-state icon="campaign" title="No notices found" message="Try a different search or category."></app-empty-state>
      } @else {
        <div class="grid fade-in">
          @for (n of latest(); track n.id) { <ng-container *ngTemplateOutlet="card; context:{ $implicit: n }"></ng-container> }
        </div>
      }
    }

    <ng-template #card let-n>
      <div class="glass-card hoverable notice" [class.important]="n.important">
        <div class="ntop">
          <span class="cat">{{ n.category }}</span>
          <div class="flags">
            @if (n.important) { <span class="imp"><mat-icon>priority_high</mat-icon> Important</span> }
            @if (n.pinned) { <mat-icon class="pin">push_pin</mat-icon> }
          </div>
        </div>
        <h4>{{ n.title }}</h4>
        <p>{{ n.body }}</p>
        <div class="foot">
          <span><mat-icon>person</mat-icon> {{ n.author }}</span>
          <span><mat-icon>event</mat-icon> {{ n.date }}</span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .toolbar { display:flex; flex-direction:column; gap:10px; margin-bottom:8px; }
    .search { max-width:420px; }
    .chips { display:flex; flex-wrap:wrap; gap:8px; }
    .chip { border:1px solid var(--s-border); background: var(--s-surface); color: var(--s-text-soft);
      padding:6px 14px; border-radius:999px; font-size:.8rem; font-weight:600; cursor:pointer; transition: all .2s; font-family:inherit; }
    .chip:hover { border-color: var(--s-primary); }
    .chip.on { background: var(--s-primary); color:#fff; border-color: var(--s-primary); }
    .sec { display:flex; align-items:center; gap:8px; font-size:1rem; margin:22px 0 14px; }
    .sec mat-icon { color: var(--s-primary); }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap:16px; }
    .notice { padding:18px; position:relative; }
    .notice.important { border-color: color-mix(in srgb, var(--s-warning) 40%, transparent); }
    .ntop { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
    .cat { font-size:.7rem; font-weight:700; text-transform:uppercase; color: var(--s-accent);
      background: color-mix(in srgb, var(--s-accent) 12%, transparent); padding:3px 9px; border-radius:6px; }
    .flags { display:flex; align-items:center; gap:8px; }
    .imp { display:inline-flex; align-items:center; gap:3px; font-size:.7rem; font-weight:700; color: var(--s-warning);
      background: color-mix(in srgb, var(--s-warning) 14%, transparent); padding:2px 8px; border-radius:6px; }
    .imp mat-icon, .pin { font-size:14px; width:14px; height:14px; }
    .pin { color: var(--s-primary); transform: rotate(35deg); }
    .notice h4 { font-size:1rem; }
    .notice p { font-size:.85rem; margin:6px 0 14px; }
    .foot { display:flex; justify-content:space-between; padding-top:12px; border-top:1px solid var(--s-border); font-size:.76rem; color: var(--s-text-faint); }
    .foot mat-icon { font-size:14px; width:14px; height:14px; vertical-align:-3px; }
  `]
})
export class NoticesComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  notices = signal<Notice[]>([]);
  search = signal('');
  category = signal('');

  categories = computed(() => Array.from(new Set(this.notices().map(n => n.category))));

  private filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.notices().filter(n =>
      (!q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)) &&
      (!this.category() || n.category === this.category()));
  });

  pinned = computed(() => this.filtered().filter(n => n.pinned));
  latest = computed(() => this.filtered().filter(n => !n.pinned));

  constructor() {
    this.repo.getNotices().subscribe(n => { this.notices.set(n); this.loading.set(false); });
  }
}

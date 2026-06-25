import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Project, ProjectStatus } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatIconModule, SkeletonLoaderComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header icon="view_kanban" title="Projects" subtitle="Capital projects from proposal to completion.">
      <span class="hpill"><mat-icon>payments</mat-icon> {{ inr.transform(totalBudget(), true) }} total budget</span>
    </app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="8"></app-skeleton-loader>
    } @else {
      <div class="board fade-in">
        @for (col of columns; track col.status) {
          <div class="col">
            <div class="col-head" [style.--c]="col.color">
              <span class="title"><span class="d"></span>{{ col.status }}</span>
              <span class="count">{{ byStatus(col.status).length }}</span>
            </div>
            <div class="cards">
              @for (p of byStatus(col.status); track p.id) {
                <div class="glass-card hoverable pcard">
                  <div class="ptop">
                    <span class="cat">{{ p.category }}</span>
                    <app-status-badge [status]="p.status"></app-status-badge>
                  </div>
                  <h4>{{ p.name }}</h4>
                  <p>{{ p.description }}</p>
                  <div class="prog">
                    <div class="bar"><div class="fill" [style.width.%]="p.progress" [style.--c]="col.color"></div></div>
                    <span>{{ p.progress }}%</span>
                  </div>
                  <div class="meta">
                    <span><mat-icon>account_balance_wallet</mat-icon> {{ inr.transform(p.spent, true) }} / {{ inr.transform(p.budget, true) }}</span>
                  </div>
                  <div class="foot">
                    <span><mat-icon>person</mat-icon> {{ p.owner }}</span>
                    <span><mat-icon>event</mat-icon> {{ p.endDate }}</span>
                  </div>
                </div>
              }
              @if (byStatus(col.status).length === 0) {
                <div class="col-empty"><mat-icon>inbox</mat-icon> No projects</div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .hpill { display:inline-flex; align-items:center; gap:6px; background: rgba(255,255,255,.2); padding:6px 12px; border-radius:999px; font-weight:600; font-size:.85rem; }
    .hpill mat-icon { font-size:18px; width:18px; height:18px; }
    .board { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; align-items:start; }
    .col-head { display:flex; align-items:center; justify-content:space-between; padding: 10px 14px; border-radius:12px; margin-bottom:12px;
      background: color-mix(in srgb, var(--c) 12%, var(--s-surface)); border:1px solid color-mix(in srgb, var(--c) 24%, transparent); }
    .col-head .title { display:flex; align-items:center; gap:8px; font-weight:700; font-size:.9rem; }
    .col-head .d { width:9px; height:9px; border-radius:50%; background: var(--c); }
    .col-head .count { background: var(--c); color:#fff; font-size:.74rem; font-weight:700; padding:1px 9px; border-radius:999px; }
    .cards { display:flex; flex-direction:column; gap:12px; }
    .pcard { padding:15px; }
    .ptop { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
    .cat { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color: var(--s-primary);
      background: color-mix(in srgb, var(--s-primary) 12%, transparent); padding:3px 8px; border-radius:6px; }
    .pcard h4 { font-size:.98rem; }
    .pcard p { font-size:.8rem; margin:5px 0 12px; display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .prog { display:flex; align-items:center; gap:8px; }
    .prog .bar { flex:1; height:7px; border-radius:999px; background: color-mix(in srgb, var(--s-text-faint) 16%, transparent); overflow:hidden; }
    .prog .fill { height:100%; border-radius:999px; background: var(--c); transition: width .8s cubic-bezier(.2,.8,.2,1); }
    .prog span { font-size:.76rem; font-weight:700; color: var(--s-text-soft); }
    .meta { margin-top:12px; font-size:.78rem; color: var(--s-text-soft); }
    .meta mat-icon, .foot mat-icon { font-size:15px; width:15px; height:15px; vertical-align:-3px; }
    .foot { display:flex; justify-content:space-between; gap:8px; margin-top:10px; padding-top:10px; border-top:1px solid var(--s-border); font-size:.74rem; color: var(--s-text-faint); }
    .col-empty { text-align:center; color: var(--s-text-faint); font-size:.82rem; padding:24px 0; }
    .col-empty mat-icon { display:block; margin:0 auto 4px; opacity:.6; }
    @media (max-width: 1100px){ .board { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 640px){ .board { grid-template-columns: 1fr; } }
  `]
})
export class ProjectsComponent {
  private repo = inject(SocietyRepository);
  inr = new InrPipe();

  loading = signal(true);
  projects = signal<Project[]>([]);
  totalBudget = computed(() => this.projects().reduce((s, p) => s + p.budget, 0));

  columns: { status: ProjectStatus; color: string }[] = [
    { status: 'Proposed', color: '#06b6d4' },
    { status: 'Approved', color: '#3b82f6' },
    { status: 'In Progress', color: '#8b5cf6' },
    { status: 'Completed', color: '#10b981' }
  ];

  constructor() {
    this.repo.getProjects().subscribe(p => { this.projects.set(p); this.loading.set(false); });
  }

  byStatus(s: ProjectStatus) { return this.projects().filter(p => p.status === s); }
}

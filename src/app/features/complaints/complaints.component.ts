import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Complaint, ComplaintStatus } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonToggleModule, SkeletonLoaderComponent,
    PageHeaderComponent, StatusBadgeComponent, ChartCardComponent, KpiWidgetComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="report_problem" title="Complaints" subtitle="Resident ticketing and resolution tracking."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="4"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader [count]="6"></app-skeleton-loader></div>
    } @else {
      <section class="cards-grid fade-in">
        <app-kpi-widget icon="confirmation_number" label="Total Tickets" [value]="complaints().length" color="#6366f1"></app-kpi-widget>
        <app-kpi-widget icon="pending_actions" label="Open / Active" [value]="active()" color="#ef4444"></app-kpi-widget>
        <app-kpi-widget icon="task_alt" label="Resolved" [value]="resolved()" color="#10b981" [progress]="resolutionRate()"></app-kpi-widget>
        <app-kpi-widget icon="priority_high" label="Critical Priority" [value]="critical()" color="#f59e0b"></app-kpi-widget>
      </section>

      <section class="charts fade-in">
        <app-chart-card title="By Status" subtitle="Ticket distribution" type="doughnut" [data]="statusChart()"></app-chart-card>
        <app-chart-card title="By Category" subtitle="Most reported issues" type="bar" [data]="categoryChart()"></app-chart-card>
      </section>

      <div class="toolbar fade-in">
        <mat-button-toggle-group [(ngModel)]="statusFilter">
          <mat-button-toggle value="">All</mat-button-toggle>
          @for (s of statuses; track s) { <mat-button-toggle [value]="s">{{ s }}</mat-button-toggle> }
        </mat-button-toggle-group>
      </div>

      @if (filtered().length === 0) {
        <app-empty-state icon="inbox" title="No complaints" message="No tickets match the selected status."></app-empty-state>
      } @else {
        <div class="list fade-in">
          @for (c of filtered(); track c.id) {
            <div class="glass-card hoverable item">
              <div class="left">
                <span class="pri" [attr.data-p]="c.priority"><mat-icon>flag</mat-icon></span>
              </div>
              <div class="mid">
                <div class="row1">
                  <h4>{{ c.title }}</h4>
                  <span class="id">#{{ c.id }}</span>
                </div>
                <p>{{ c.description }}</p>
                <div class="tags">
                  <span class="tag"><mat-icon>category</mat-icon> {{ c.category }}</span>
                  <span class="tag"><mat-icon>home</mat-icon> {{ c.flatNumber }}</span>
                  <span class="tag"><mat-icon>person</mat-icon> {{ c.resident }}</span>
                  @if (c.assignedTo) { <span class="tag"><mat-icon>engineering</mat-icon> {{ c.assignedTo }}</span> }
                  <span class="tag"><mat-icon>schedule</mat-icon> {{ c.createdDate }}</span>
                </div>
              </div>
              <div class="right">
                <app-status-badge [status]="c.status"></app-status-badge>
                <app-status-badge [status]="c.priority"></app-status-badge>
              </div>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [`
    .charts { display:grid; grid-template-columns: 1fr 1.4fr; gap:18px; margin:20px 0; }
    .toolbar { margin-bottom:16px; overflow-x:auto; }
    .list { display:flex; flex-direction:column; gap:12px; }
    .item { display:flex; gap:14px; padding:16px; align-items:flex-start; }
    .pri { width:42px; height:42px; border-radius:12px; display:grid; place-items:center; }
    .pri[data-p="Critical"]{ background: color-mix(in srgb,#ef4444 16%,transparent); color:#ef4444; }
    .pri[data-p="High"]{ background: color-mix(in srgb,#f97316 16%,transparent); color:#f97316; }
    .pri[data-p="Medium"]{ background: color-mix(in srgb,#f59e0b 16%,transparent); color:#f59e0b; }
    .pri[data-p="Low"]{ background: color-mix(in srgb,#64748b 16%,transparent); color:#64748b; }
    .mid { flex:1; min-width:0; }
    .row1 { display:flex; align-items:center; gap:10px; }
    .row1 h4 { font-size:.98rem; }
    .id { font-size:.72rem; color: var(--s-text-faint); font-weight:600; }
    .item p { font-size:.82rem; margin:4px 0 10px; }
    .tags { display:flex; flex-wrap:wrap; gap:7px; }
    .tag { display:inline-flex; align-items:center; gap:4px; font-size:.72rem; color: var(--s-text-soft);
      background: var(--s-surface-2); border:1px solid var(--s-border); padding:3px 8px; border-radius:7px; }
    .tag mat-icon { font-size:13px; width:13px; height:13px; }
    .right { display:flex; flex-direction:column; gap:7px; align-items:flex-end; }
    @media (max-width: 820px){ .charts { grid-template-columns:1fr; } .right { flex-direction:row; } }
  `]
})
export class ComplaintsComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  complaints = signal<Complaint[]>([]);
  statusFilter = '';
  statuses: ComplaintStatus[] = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  active = computed(() => this.complaints().filter(c => ['Open', 'Assigned', 'In Progress'].includes(c.status)).length);
  resolved = computed(() => this.complaints().filter(c => ['Resolved', 'Closed'].includes(c.status)).length);
  critical = computed(() => this.complaints().filter(c => c.priority === 'Critical').length);
  resolutionRate = computed(() => this.complaints().length ? Math.round(this.resolved() / this.complaints().length * 100) : 0);

  filtered = computed(() => this.statusFilter ? this.complaints().filter(c => c.status === this.statusFilter) : this.complaints());

  statusChart = computed<ChartData>(() => {
    const counts = this.statuses.map(s => this.complaints().filter(c => c.status === s).length);
    return { labels: this.statuses, datasets: [{ data: counts,
      backgroundColor: ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#64748b'], borderWidth: 0 }] };
  });

  categoryChart = computed<ChartData>(() => {
    const cats = Array.from(new Set(this.complaints().map(c => c.category)));
    return { labels: cats, datasets: [{ label: 'Tickets',
      data: cats.map(cat => this.complaints().filter(c => c.category === cat).length),
      backgroundColor: '#6366f1', borderRadius: 8, barThickness: 22 }] };
  });

  constructor() {
    this.repo.getComplaints().subscribe(c => { this.complaints.set(c); this.loading.set(false); });
  }
}

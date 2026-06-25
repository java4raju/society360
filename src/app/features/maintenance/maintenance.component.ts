import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Resident } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, MatIconModule, SkeletonLoaderComponent, PageHeaderComponent, KpiWidgetComponent,
    ChartCardComponent, StatusBadgeComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="home_repair_service" title="Maintenance" subtitle="Resident dues, collections and defaulters."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="4"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader [count]="6"></app-skeleton-loader></div>
    } @else {
      <section class="cards-grid fade-in">
        <app-kpi-widget icon="request_quote" label="Total Dues Billed" [value]="inr.transform(billed(), true)" color="#6366f1"></app-kpi-widget>
        <app-kpi-widget icon="paid" label="Collected" [value]="inr.transform(collected(), true)" color="#10b981" [progress]="collectionRate()"></app-kpi-widget>
        <app-kpi-widget icon="pending" label="Pending Dues" [value]="inr.transform(pending(), true)" color="#f59e0b"></app-kpi-widget>
        <app-kpi-widget icon="report" label="Defaulters" [value]="defaulters().length" color="#ef4444" note="Residents with pending dues"></app-kpi-widget>
      </section>

      <section class="charts fade-in">
        <app-chart-card title="Monthly Collection Trend" subtitle="Collection rate over time" type="line" [data]="trend"></app-chart-card>
        <app-chart-card title="Dues by Block" subtitle="Pending dues per block" type="bar" [data]="blockChart()"></app-chart-card>
      </section>

      <div class="glass-card tbl-wrap fade-in">
        <h3><mat-icon>warning</mat-icon> Defaulters List</h3>
        @if (defaulters().length === 0) {
          <app-empty-state icon="celebration" title="No defaulters" message="All residents are up to date with their dues."></app-empty-state>
        } @else {
          <table class="tbl">
            <thead><tr><th>Flat</th><th>Resident</th><th>Block</th><th>Contact</th><th class="r">Pending Dues</th><th>Status</th></tr></thead>
            <tbody>
              @for (r of defaulters(); track r.id) {
                <tr>
                  <td class="b">{{ r.flatNumber }}</td>
                  <td>{{ r.ownerName }}</td>
                  <td>Block {{ r.block }}</td>
                  <td>{{ r.contact }}</td>
                  <td class="r text-danger">{{ inr.transform(r.duesAmount) }}</td>
                  <td><app-status-badge status="Pending"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    }
  `,
  styles: [`
    .charts { display:grid; grid-template-columns: 1.4fr 1fr; gap:18px; margin:20px 0; }
    .tbl-wrap { padding:18px; }
    .tbl-wrap h3 { display:flex; align-items:center; gap:8px; font-size:1rem; margin-bottom:14px; }
    .tbl-wrap h3 mat-icon { color: var(--s-warning); }
    table.tbl { width:100%; border-collapse:collapse; }
    .tbl th { text-align:left; font-size:.73rem; text-transform:uppercase; color: var(--s-text-faint); padding:10px 14px; border-bottom:1px solid var(--s-border); }
    .tbl td { padding:13px 14px; border-bottom:1px solid var(--s-border); font-size:.87rem; }
    .tbl tr:hover { background: color-mix(in srgb, var(--s-primary) 6%, transparent); }
    .b { font-weight:700; }
    .r { text-align:right; font-weight:700; }
    @media (max-width: 820px){ .charts { grid-template-columns:1fr; } table.tbl { display:block; overflow-x:auto; } }
  `]
})
export class MaintenanceComponent {
  private repo = inject(SocietyRepository);
  inr = new InrPipe();

  loading = signal(true);
  residents = signal<Resident[]>([]);

  private MONTHLY = 8500;
  billed = computed(() => this.residents().filter(r => r.status === 'Active').length * this.MONTHLY);
  pending = computed(() => this.residents().reduce((s, r) => s + r.duesAmount, 0));
  collected = computed(() => Math.max(0, this.billed() - this.pending()));
  collectionRate = computed(() => this.billed() ? Math.round(this.collected() / this.billed() * 100) : 0);
  defaulters = computed(() => this.residents().filter(r => r.duesAmount > 0).sort((a, b) => b.duesAmount - a.duesAmount));

  trend: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Collection %', data: [86, 89, 84, 92, 88, 93],
      borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.12)', fill: true, tension: .4, borderWidth: 3, pointRadius: 3 }]
  };

  blockChart = computed<ChartData>(() => {
    const blocks = ['A', 'B', 'C', 'D'];
    return { labels: blocks.map(b => 'Block ' + b), datasets: [{ label: 'Pending Dues',
      data: blocks.map(b => this.residents().filter(r => r.block === b).reduce((s, r) => s + r.duesAmount, 0)),
      backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b'], borderRadius: 8, barThickness: 34 }] };
  });

  constructor() {
    this.repo.getResidents().subscribe(r => { this.residents.set(r); this.loading.set(false); });
  }
}

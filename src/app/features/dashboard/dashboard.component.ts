import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { DashboardSummary, Activity } from '../../shared/models/models';
import { SummaryCardComponent } from '../../shared/components/summary-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { ActivityFeedComponent } from '../../shared/components/activity-feed.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, ChartCardComponent, ActivityFeedComponent,
    SkeletonLoaderComponent, PageHeaderComponent],
  template: `
    <app-page-header icon="dashboard" title="Dashboard"
      [subtitle]="'Welcome back — here is what is happening across your community today.'"></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="6"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader variant="chart" [count]="2"></app-skeleton-loader></div>
    } @else if (summary(); as s) {
      <section class="cards-grid">
        <app-summary-card icon="diversity_3" [value]="s.totalResidents" label="Total Residents" color="#6366f1" [trend]="3.2"></app-summary-card>
        <app-summary-card icon="trending_up" [value]="inr.transform(s.monthlyCollection, true)" label="Monthly Collection" color="#10b981" [trend]="5.8"></app-summary-card>
        <app-summary-card icon="trending_down" [value]="inr.transform(s.monthlyExpense, true)" label="Monthly Expense" color="#f59e0b" [trend]="-2.1"></app-summary-card>
        <app-summary-card icon="report_problem" [value]="s.openComplaints" label="Open Complaints" color="#ef4444" [trend]="-12"></app-summary-card>
        <app-summary-card icon="view_kanban" [value]="s.activeProjects" label="Active Projects" color="#8b5cf6" [trend]="1"></app-summary-card>
        <app-summary-card icon="account_balance" [value]="inr.transform(s.bankBalance, true)" label="Bank Balance" color="#06b6d4" [trend]="4.4"></app-summary-card>
      </section>

      <section class="charts">
        <app-chart-card class="c-wide" title="Income vs Expense" subtitle="Last 12 months"
          type="line" [data]="lineData"></app-chart-card>
        <app-chart-card title="Expense Breakdown" subtitle="By category this year"
          type="doughnut" [data]="pieData"></app-chart-card>
        <app-chart-card title="Maintenance Collection %" subtitle="Monthly collection efficiency"
          type="bar" [data]="barData"></app-chart-card>
        <app-chart-card title="Complaint Resolution" subtitle="Raised vs resolved"
          type="line" [data]="resolutionData"></app-chart-card>
        <app-activity-feed class="c-wide" [items]="activities()"></app-activity-feed>
      </section>
    }
  `,
  styles: [`
    .charts { display:grid; grid-template-columns: repeat(2, 1fr); gap:18px; margin-top:20px; }
    .c-wide { grid-column: span 2; }
    @media (max-width: 900px){ .charts { grid-template-columns: 1fr; } .c-wide { grid-column: span 1; } }
  `]
})
export class DashboardComponent {
  private repo = inject(SocietyRepository);
  inr = new InrPipe();

  loading = signal(true);
  summary = signal<DashboardSummary | null>(null);
  activities = signal<Activity[]>([]);

  lineData: ChartData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Income', data: [820, 910, 870, 940, 990, 1020, 880, 960, 1010, 1080, 1040, 1120].map(v => v * 1000),
        borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.12)', fill: true, tension: .4, pointRadius: 0, borderWidth: 3 },
      { label: 'Expense', data: [640, 690, 720, 700, 760, 810, 690, 730, 770, 800, 780, 840].map(v => v * 1000),
        borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.10)', fill: true, tension: .4, pointRadius: 0, borderWidth: 3 }
    ]
  };

  pieData: ChartData = {
    labels: ['Salaries', 'Utilities', 'Maintenance', 'Repairs', 'Insurance'],
    datasets: [{ data: [38, 24, 18, 12, 8],
      backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'], borderWidth: 0 }]
  };

  barData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Collection %', data: [88, 91, 86, 94, 90, 95],
      backgroundColor: '#6366f1', borderRadius: 8, barThickness: 26 }]
  };

  resolutionData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Raised', data: [12, 9, 14, 8, 11, 7], borderColor: '#ef4444', tension: .4, borderWidth: 3, pointRadius: 0 },
      { label: 'Resolved', data: [10, 11, 12, 9, 12, 9], borderColor: '#10b981', tension: .4, borderWidth: 3, pointRadius: 0 }
    ]
  };

  constructor() {
    forkJoin({ summary: this.repo.getDashboardSummary(), activities: this.repo.getActivities() })
      .subscribe(({ summary, activities }) => {
        this.summary.set(summary);
        this.activities.set(activities);
        this.loading.set(false);
      });
  }
}

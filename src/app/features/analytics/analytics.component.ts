import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Complaint, Project, Transaction } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, SkeletonLoaderComponent, PageHeaderComponent, KpiWidgetComponent, ChartCardComponent],
  template: `
    <app-page-header icon="monitoring" title="Analytics" subtitle="Executive dashboard — financial health and governance KPIs."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="5"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader variant="chart" [count]="2"></app-skeleton-loader></div>
    } @else {
      <section class="hero fade-in">
        <div class="glass-card score">
          <div class="ring" [style.--p]="governance()">
            <span class="num">{{ governance() }}</span>
            <span class="lbl">Governance<br/>Score</span>
          </div>
          <div class="score-info">
            <h3>Healthy Community Governance</h3>
            <p>Composite score across financial discipline, complaint resolution, collection efficiency and project delivery.</p>
            <div class="pillz">
              <span><mat-icon>paid</mat-icon> Collections 92%</span>
              <span><mat-icon>task_alt</mat-icon> Resolution {{ resolutionRate() }}%</span>
              <span><mat-icon>engineering</mat-icon> Projects {{ projectCompletion() }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="cards-grid fade-in">
        <app-kpi-widget icon="savings" label="Financial Health" [value]="'Strong'" color="#10b981" [progress]="84"></app-kpi-widget>
        <app-kpi-widget icon="trending_up" label="Net Surplus (YTD)" [value]="surplusFmt()" color="#06b6d4"></app-kpi-widget>
        <app-kpi-widget icon="report_problem" label="Avg Resolution Time" [value]="'3.4 days'" color="#8b5cf6"></app-kpi-widget>
        <app-kpi-widget icon="view_kanban" label="Project Completion" [value]="projectCompletion() + '%'" color="#6366f1" [progress]="projectCompletion()"></app-kpi-widget>
        <app-kpi-widget icon="thumb_up" label="Resident Satisfaction" [value]="'4.4 / 5'" color="#f59e0b" [progress]="88"></app-kpi-widget>
      </section>

      <section class="charts fade-in">
        <app-chart-card class="wide" title="Yearly Financial Trend" subtitle="Income, expense and surplus" type="line" [data]="yearly()"></app-chart-card>
        <app-chart-card title="Complaint Metrics" subtitle="By status" type="polarArea" [data]="complaintMetrics()"></app-chart-card>
        <app-chart-card title="Project Budget Allocation" subtitle="By category" type="doughnut" [data]="projectBudget()"></app-chart-card>
        <app-chart-card class="wide" title="Reserve Fund Growth" subtitle="Quarterly reserve build-up" type="bar" [data]="reserveGrowth"></app-chart-card>
      </section>
    }
  `,
  styles: [`
    .hero { margin-bottom:20px; }
    .score { padding:24px; display:flex; align-items:center; gap:28px; flex-wrap:wrap; }
    .ring { --p:0; width:150px; height:150px; border-radius:50%; display:grid; place-items:center; flex-shrink:0; position:relative;
      background: conic-gradient(var(--s-primary) calc(var(--p)*1%), color-mix(in srgb, var(--s-text-faint) 16%, transparent) 0); text-align:center; }
    .ring::before { content:''; position:absolute; inset:12px; border-radius:50%; background: var(--s-surface); }
    .ring .num { position:relative; font-size:2.4rem; font-weight:800; line-height:1; }
    .ring .lbl { position:relative; font-size:.72rem; color: var(--s-text-soft); margin-top:4px; font-weight:600; }
    .score-info { flex:1; min-width:240px; }
    .score-info h3 { font-size:1.2rem; }
    .score-info p { font-size:.86rem; margin:6px 0 12px; max-width:520px; }
    .pillz { display:flex; flex-wrap:wrap; gap:10px; }
    .pillz span { display:inline-flex; align-items:center; gap:5px; font-size:.78rem; font-weight:600; color: var(--s-text-soft);
      background: var(--s-surface-2); border:1px solid var(--s-border); padding:6px 11px; border-radius:999px; }
    .pillz mat-icon { font-size:16px; width:16px; height:16px; color: var(--s-primary); }
    .charts { display:grid; grid-template-columns: repeat(2,1fr); gap:18px; margin-top:20px; }
    .wide { grid-column: span 2; }
    @media (max-width: 900px){ .charts { grid-template-columns:1fr; } .wide { grid-column: span 1; } }
  `]
})
export class AnalyticsComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  transactions = signal<Transaction[]>([]);
  complaints = signal<Complaint[]>([]);
  projects = signal<Project[]>([]);

  resolutionRate = signal(0);
  projectCompletion = signal(0);
  governance = signal(0);

  reserveGrowth: ChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: 'Reserve (₹L)', data: [42, 58, 71, 86],
      backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'], borderRadius: 8, barThickness: 46 }]
  };

  surplusFmt = signal('₹0');

  yearly = signal<ChartData>({ labels: [], datasets: [] });
  complaintMetrics = signal<ChartData>({ labels: [], datasets: [] });
  projectBudget = signal<ChartData>({ labels: [], datasets: [] });

  constructor() {
    forkJoin({ t: this.repo.getTransactions(), c: this.repo.getComplaints(), p: this.repo.getProjects() })
      .subscribe(({ t, c, p }) => {
        this.transactions.set(t); this.complaints.set(c); this.projects.set(p);

        const resolved = c.filter(x => x.status === 'Resolved' || x.status === 'Closed').length;
        this.resolutionRate.set(c.length ? Math.round(resolved / c.length * 100) : 0);
        const completed = p.filter(x => x.status === 'Completed').length;
        this.projectCompletion.set(p.length ? Math.round(completed / p.length * 100) : 0);
        this.governance.set(Math.round((92 + this.resolutionRate() + this.projectCompletion() + 88) / 4));

        const income = t.filter(x => x.type === 'Income').reduce((s, x) => s + x.amount, 0);
        const expense = t.filter(x => x.type === 'Expense').reduce((s, x) => s + x.amount, 0);
        this.surplusFmt.set('₹' + Math.round((income - expense) / 100000) + ' L');

        this.yearly.set({
          labels: ['2022', '2023', '2024', '2025', '2026'],
          datasets: [
            { label: 'Income', data: [88, 96, 104, 118, 126], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', fill: true, tension: .4, borderWidth: 3, pointRadius: 3 },
            { label: 'Expense', data: [70, 76, 82, 90, 96], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.1)', fill: true, tension: .4, borderWidth: 3, pointRadius: 3 },
            { label: 'Surplus', data: [18, 20, 22, 28, 30], borderColor: '#6366f1', tension: .4, borderWidth: 3, pointRadius: 3 }
          ]
        });

        const statuses = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
        this.complaintMetrics.set({
          labels: statuses,
          datasets: [{ data: statuses.map(s => c.filter(x => x.status === s).length),
            backgroundColor: ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#64748b'] }]
        });

        const cats = Array.from(new Set(p.map(x => x.category)));
        this.projectBudget.set({
          labels: cats,
          datasets: [{ data: cats.map(cat => Math.round(p.filter(x => x.category === cat).reduce((s, x) => s + x.budget, 0) / 100000)),
            backgroundColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'], borderWidth: 0 }]
        });

        this.loading.set(false);
      });
  }
}

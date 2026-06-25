import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Transaction } from '../../shared/models/models';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
    MatPaginatorModule, KpiWidgetComponent, SkeletonLoaderComponent, PageHeaderComponent,
    StatusBadgeComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="account_balance_wallet" title="Finance"
      subtitle="Track income, expenses, reserves and collection efficiency."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="5"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader variant="table" [count]="8"></app-skeleton-loader></div>
    } @else {
      <section class="cards-grid fade-in">
        <app-kpi-widget icon="trending_up" label="Total Income" [value]="inr.transform(totalIncome(), true)" color="#10b981" note="This fiscal year"></app-kpi-widget>
        <app-kpi-widget icon="trending_down" label="Total Expenses" [value]="inr.transform(totalExpense(), true)" color="#f59e0b" note="This fiscal year"></app-kpi-widget>
        <app-kpi-widget icon="savings" label="Reserve Fund" [value]="inr.transform(reserve(), true)" color="#8b5cf6" note="15% of surplus allocated"></app-kpi-widget>
        <app-kpi-widget icon="account_balance" label="Bank Balance" [value]="inr.transform(bankBalance(), true)" color="#06b6d4" note="Across operating accounts"></app-kpi-widget>
        <app-kpi-widget icon="speed" label="Collection Efficiency" [value]="efficiency() + '%'" color="#6366f1" [progress]="efficiency()"></app-kpi-widget>
      </section>

      <div class="glass-card table-wrap fade-in">
        <div class="filters">
          <mat-form-field appearance="outline" class="search">
            <mat-label>Search transactions</mat-label>
            <input matInput [(ngModel)]="search" (ngModelChange)="resetPage()" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select [(ngModel)]="typeFilter" (ngModelChange)="resetPage()">
              <mat-option value="">All</mat-option>
              <mat-option value="Income">Income</mat-option>
              <mat-option value="Expense">Expense</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="categoryFilter" (ngModelChange)="resetPage()">
              <mat-option value="">All</mat-option>
              @for (c of categories(); track c) { <mat-option [value]="c">{{ c }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="statusFilter" (ngModelChange)="resetPage()">
              <mat-option value="">All</mat-option>
              <mat-option value="Completed">Completed</mat-option>
              <mat-option value="Pending">Pending</mat-option>
              <mat-option value="Failed">Failed</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        @if (filtered().length === 0) {
          <app-empty-state icon="receipt_long" title="No transactions found" message="Try adjusting your filters or search query."></app-empty-state>
        } @else {
          <table class="tbl">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Category</th><th>Method</th><th class="r">Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              @for (t of paged(); track t.id) {
                <tr>
                  <td>{{ t.date }}</td>
                  <td class="desc">{{ t.description }}</td>
                  <td>{{ t.category }}</td>
                  <td>{{ t.method }}</td>
                  <td class="r" [class.text-success]="t.type==='Income'" [class.text-danger]="t.type==='Expense'">
                    {{ t.type === 'Income' ? '+' : '-' }}{{ inr.transform(t.amount) }}
                  </td>
                  <td><app-status-badge [status]="t.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
          <mat-paginator [length]="filtered().length" [pageSize]="pageSize()" [pageIndex]="pageIndex()"
            [pageSizeOptions]="[8, 12, 25, 50]" (page)="onPage($event)"></mat-paginator>
        }
      </div>
    }
  `,
  styles: [`
    .table-wrap { padding: 18px; margin-top: 20px; }
    .filters { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap:12px; margin-bottom:8px; }
    .search { grid-column: span 1; }
    table.tbl { width:100%; border-collapse: collapse; }
    .tbl th { text-align:left; font-size:.74rem; text-transform:uppercase; letter-spacing:.04em; color: var(--s-text-faint);
      padding: 10px 14px; border-bottom:1px solid var(--s-border); }
    .tbl td { padding: 13px 14px; border-bottom:1px solid var(--s-border); font-size:.87rem; color: var(--s-text); }
    .tbl tbody tr { transition: background .15s; }
    .tbl tbody tr:hover { background: color-mix(in srgb, var(--s-primary) 6%, transparent); }
    .desc { font-weight:600; }
    .r { text-align:right; font-weight:700; font-variant-numeric: tabular-nums; }
    @media (max-width: 820px){ .filters { grid-template-columns: 1fr 1fr; } table.tbl { display:block; overflow-x:auto; } }
  `]
})
export class FinanceComponent {
  private repo = inject(SocietyRepository);
  inr = new InrPipe();

  loading = signal(true);
  transactions = signal<Transaction[]>([]);

  search = '';
  typeFilter = '';
  categoryFilter = '';
  statusFilter = '';
  pageIndex = signal(0);
  pageSize = signal(12);

  // bound via getters to keep template filters reactive on change
  private filterTick = signal(0);

  categories = computed(() => Array.from(new Set(this.transactions().map(t => t.category))).sort());

  totalIncome = computed(() => this.transactions().filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0));
  totalExpense = computed(() => this.transactions().filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0));
  reserve = computed(() => Math.round((this.totalIncome() - this.totalExpense()) * 0.15));
  bankBalance = computed(() => this.totalIncome() - this.totalExpense() + 5200000);
  efficiency = computed(() => 92);

  filtered = computed(() => {
    this.filterTick();
    const q = this.search.toLowerCase();
    return this.transactions().filter(t =>
      (!q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
      (!this.typeFilter || t.type === this.typeFilter) &&
      (!this.categoryFilter || t.category === this.categoryFilter) &&
      (!this.statusFilter || t.status === this.statusFilter));
  });

  paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor() {
    this.repo.getTransactions().subscribe(t => {
      this.transactions.set(t);
      this.loading.set(false);
    });
  }

  resetPage() { this.filterTick.update(v => v + 1); this.pageIndex.set(0); }
  onPage(e: PageEvent) { this.pageIndex.set(e.pageIndex); this.pageSize.set(e.pageSize); }
}

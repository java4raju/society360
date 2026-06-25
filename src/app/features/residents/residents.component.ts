import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Resident } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-residents',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatPaginatorModule, SkeletonLoaderComponent, PageHeaderComponent, StatusBadgeComponent, KpiWidgetComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="diversity_3" title="Residents" subtitle="Directory of owners, tenants and occupancy."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="4"></app-skeleton-loader>
      <div style="margin-top:20px"><app-skeleton-loader variant="table" [count]="8"></app-skeleton-loader></div>
    } @else {
      <section class="cards-grid fade-in">
        <app-kpi-widget icon="diversity_3" label="Total Units" [value]="residents().length" color="#6366f1"></app-kpi-widget>
        <app-kpi-widget icon="home" label="Owner Occupied" [value]="count('Owner')" color="#10b981"></app-kpi-widget>
        <app-kpi-widget icon="key" label="Tenanted" [value]="count('Tenant')" color="#8b5cf6"></app-kpi-widget>
        <app-kpi-widget icon="meeting_room" label="Vacant" [value]="count('Vacant')" color="#f59e0b"></app-kpi-widget>
      </section>

      <div class="glass-card tbl-wrap fade-in">
        <div class="filters">
          <mat-form-field appearance="outline" class="search">
            <mat-label>Search resident or flat</mat-label>
            <input matInput [ngModel]="search()" (ngModelChange)="onSearch($event)" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Block</mat-label>
            <mat-select [ngModel]="block()" (ngModelChange)="block.set($event); pageIndex.set(0)">
              <mat-option value="">All</mat-option>
              @for (b of blocks; track b) { <mat-option [value]="b">Block {{ b }}</mat-option> }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Occupancy</mat-label>
            <mat-select [ngModel]="occ()" (ngModelChange)="occ.set($event); pageIndex.set(0)">
              <mat-option value="">All</mat-option>
              <mat-option value="Owner">Owner</mat-option>
              <mat-option value="Tenant">Tenant</mat-option>
              <mat-option value="Vacant">Vacant</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        @if (filtered().length === 0) {
          <app-empty-state icon="person_off" title="No residents found" message="Adjust your filters or search query."></app-empty-state>
        } @else {
          <table class="tbl">
            <thead><tr><th>Flat</th><th>Owner</th><th>Tenant</th><th>Contact</th><th class="c">Parking</th><th>Occupancy</th><th>Status</th></tr></thead>
            <tbody>
              @for (r of paged(); track r.id) {
                <tr>
                  <td class="b">{{ r.flatNumber }}</td>
                  <td>
                    <div class="who"><span class="av">{{ r.ownerName[0] }}</span> {{ r.ownerName }}</div>
                  </td>
                  <td>{{ r.tenantName ?? '—' }}</td>
                  <td>{{ r.contact }}</td>
                  <td class="c">{{ r.parkingSlots }}</td>
                  <td><app-status-badge [status]="r.occupancy"></app-status-badge></td>
                  <td><app-status-badge [status]="r.status"></app-status-badge></td>
                </tr>
              }
            </tbody>
          </table>
          <mat-paginator [length]="filtered().length" [pageSize]="pageSize()" [pageIndex]="pageIndex()"
            [pageSizeOptions]="[10, 15, 25, 50]" (page)="onPage($event)"></mat-paginator>
        }
      </div>
    }
  `,
  styles: [`
    .tbl-wrap { padding:18px; margin-top:20px; }
    .filters { display:grid; grid-template-columns: 2fr 1fr 1fr; gap:12px; margin-bottom:8px; }
    table.tbl { width:100%; border-collapse:collapse; }
    .tbl th { text-align:left; font-size:.73rem; text-transform:uppercase; color: var(--s-text-faint); padding:10px 14px; border-bottom:1px solid var(--s-border); }
    .tbl td { padding:12px 14px; border-bottom:1px solid var(--s-border); font-size:.86rem; }
    .tbl tr:hover { background: color-mix(in srgb, var(--s-primary) 6%, transparent); }
    .b { font-weight:700; } .c { text-align:center; }
    .who { display:flex; align-items:center; gap:9px; }
    .av { width:30px; height:30px; border-radius:9px; display:grid; place-items:center; font-weight:700; font-size:.78rem; color:#fff;
      background: linear-gradient(135deg, var(--s-primary), var(--s-violet)); }
    @media (max-width: 820px){ .filters { grid-template-columns:1fr; } table.tbl { display:block; overflow-x:auto; } }
  `]
})
export class ResidentsComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  residents = signal<Resident[]>([]);
  search = signal('');
  block = signal('');
  occ = signal('');
  blocks = ['A', 'B', 'C', 'D'];
  pageIndex = signal(0);
  pageSize = signal(10);

  count(o: string) { return this.residents().filter(r => r.occupancy === o).length; }

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.residents().filter(r =>
      (!q || r.ownerName.toLowerCase().includes(q) || r.flatNumber.toLowerCase().includes(q) || (r.tenantName ?? '').toLowerCase().includes(q)) &&
      (!this.block() || r.block === this.block()) &&
      (!this.occ() || r.occupancy === this.occ()));
  });

  paged = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  constructor() {
    this.repo.getResidents().subscribe(r => { this.residents.set(r); this.loading.set(false); });
  }

  onSearch(v: string) { this.search.set(v); this.pageIndex.set(0); }
  onPage(e: PageEvent) { this.pageIndex.set(e.pageIndex); this.pageSize.set(e.pageSize); }
}

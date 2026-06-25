import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Vendor } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { KpiWidgetComponent } from '../../shared/components/kpi-widget.component';
import { InrPipe } from '../../shared/pipes/inr.pipe';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, MatIconModule, SkeletonLoaderComponent, PageHeaderComponent, StatusBadgeComponent, KpiWidgetComponent],
  template: `
    <app-page-header icon="handshake" title="Vendors" subtitle="Service providers, contracts and performance ratings."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="6"></app-skeleton-loader>
    } @else {
      <section class="cards-grid fade-in">
        <app-kpi-widget icon="store" label="Total Vendors" [value]="vendors().length" color="#6366f1"></app-kpi-widget>
        <app-kpi-widget icon="verified" label="Active Contracts" [value]="active()" color="#10b981"></app-kpi-widget>
        <app-kpi-widget icon="payments" label="Annual Contract Value" [value]="inr.transform(totalValue(), true)" color="#06b6d4"></app-kpi-widget>
        <app-kpi-widget icon="star" label="Avg Rating" [value]="avgRating()" color="#f59e0b"></app-kpi-widget>
      </section>

      <div class="grid fade-in">
        @for (v of vendors(); track v.id) {
          <div class="glass-card hoverable vcard">
            <div class="vtop">
              <span class="avatar">{{ v.name[0] }}</span>
              <div class="vt">
                <h4>{{ v.name }}</h4>
                <span class="cat">{{ v.category }}</span>
              </div>
              <app-status-badge [status]="v.status"></app-status-badge>
            </div>
            <div class="stars">
              @for (s of [1,2,3,4,5]; track s) {
                <mat-icon [class.filled]="s <= Math.round(v.rating)">star</mat-icon>
              }
              <span class="rv">{{ v.rating }}</span>
            </div>
            <div class="rows">
              <div class="r"><span><mat-icon>call</mat-icon> Contact</span><b>{{ v.contact }}</b></div>
              <div class="r"><span><mat-icon>mail</mat-icon> Email</span><b>{{ v.email }}</b></div>
              <div class="r"><span><mat-icon>payments</mat-icon> Contract</span><b>{{ inr.transform(v.contractValue, true) }}/yr</b></div>
              <div class="r"><span><mat-icon>event</mat-icon> Period</span><b>{{ v.contractStart }} → {{ v.contractEnd }}</b></div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(330px,1fr)); gap:16px; margin-top:20px; }
    .vcard { padding:18px; }
    .vtop { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .avatar { width:46px; height:46px; border-radius:13px; display:grid; place-items:center; font-weight:800; color:#fff;
      background: linear-gradient(135deg, var(--s-primary), var(--s-violet)); flex-shrink:0; }
    .vt { flex:1; min-width:0; }
    .vt h4 { font-size:1rem; }
    .cat { font-size:.74rem; color: var(--s-text-soft); }
    .stars { display:flex; align-items:center; gap:1px; margin-bottom:14px; }
    .stars mat-icon { font-size:18px; width:18px; height:18px; color: color-mix(in srgb, var(--s-text-faint) 40%, transparent); }
    .stars mat-icon.filled { color: #f59e0b; }
    .rv { margin-left:6px; font-size:.82rem; font-weight:700; color: var(--s-text-soft); }
    .rows { display:flex; flex-direction:column; gap:9px; }
    .r { display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:.82rem; }
    .r span { display:inline-flex; align-items:center; gap:5px; color: var(--s-text-faint); }
    .r span mat-icon { font-size:15px; width:15px; height:15px; }
    .r b { color: var(--s-text); font-weight:600; text-align:right; word-break:break-word; }
  `]
})
export class VendorsComponent {
  private repo = inject(SocietyRepository);
  inr = new InrPipe();
  Math = Math;

  loading = signal(true);
  vendors = signal<Vendor[]>([]);

  active = computed(() => this.vendors().filter(v => v.status === 'Active').length);
  totalValue = computed(() => this.vendors().reduce((s, v) => s + v.contractValue, 0));
  avgRating = computed(() => {
    const v = this.vendors();
    return v.length ? (v.reduce((s, x) => s + x.rating, 0) / v.length).toFixed(1) : '0';
  });

  constructor() {
    this.repo.getVendors().subscribe(v => { this.vendors.set(v); this.loading.set(false); });
  }
}

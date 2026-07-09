import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminStoreService } from '../../../core/services/admin-store.service';
import { SlideOverComponent } from '../../../shared/components/slide-over.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { InrPipe } from '../../../shared/pipes/inr.pipe';
import { Vendor } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule,
    SlideOverComponent, InrPipe
  ],
  template: `
    <div class="admin-page fade-in">
      <div class="page-toolbar">
        <div>
          <h2>Vendors</h2>
          <p class="meta">{{ filtered().length }} vendors</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Vendor
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Vendor</th>
            <td mat-cell *matCellDef="let v"><strong>{{ v.name }}</strong><br><small>{{ v.category }}</small></td>
          </ng-container>
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let v">{{ v.contact }}</td>
          </ng-container>
          <ng-container matColumnDef="contract">
            <th mat-header-cell *matHeaderCellDef>Contract Value</th>
            <td mat-cell *matCellDef="let v">{{ v.contractValue | inr }}</td>
          </ng-container>
          <ng-container matColumnDef="rating">
            <th mat-header-cell *matHeaderCellDef>Rating</th>
            <td mat-cell *matCellDef="let v">
              <span class="stars">{{ '★'.repeat(v.rating) }}{{ '☆'.repeat(5 - v.rating) }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let v"><span class="badge" [attr.data-s]="v.status">{{ v.status }}</span></td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let v">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(v)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(v)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>handshake</mat-icon><span>No vendors found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Vendor' : 'New Vendor'"
        subtitle="Service & maintenance vendors" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Vendor Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            @for (c of categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Expired">Expired</mat-option>
            <mat-option value="Pending">Pending</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contact</mat-label>
          <input matInput formControlName="contact" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contract Value (₹)</mat-label>
          <input matInput formControlName="contractValue" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Rating (1–5)</mat-label>
          <input matInput formControlName="rating" type="number" min="1" max="5" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contract Start</mat-label>
          <input matInput formControlName="contractStart" type="date" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contract End</mat-label>
          <input matInput formControlName="contractEnd" type="date" />
        </mat-form-field>
        <div class="form-actions span2">
          <button mat-button type="button" (click)="closePanel()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
        </div>
      </form>
    </app-slide-over>
  `,
  styles: [`
    .admin-page { padding: 1.5rem; }
    .page-toolbar { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
    .page-toolbar h2 { margin: 0; font-size: 1.375rem; font-weight: 700; }
    .meta { margin: 2px 0 0; font-size: .8rem; color: var(--text-secondary); }
    .toolbar-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .search-field { width: 220px; }
    ::ng-deep .search-field .mat-mdc-form-field-subscript-wrapper { display: none; }
    .table-wrap { border-radius: 16px; overflow: hidden; }
    table { width: 100%; }
    small { color: var(--text-secondary); font-size: .75rem; }
    .stars { color: #f59e0b; letter-spacing: 1px; }
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-s="Active"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Expired"] { background: color-mix(in srgb,#ef4444 15%,transparent); color: #dc2626; }
    .badge[data-s="Pending"] { background: color-mix(in srgb,#f59e0b 15%,transparent); color: #b45309; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminVendorsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['name', 'contact', 'contract', 'rating', 'status', 'actions'];
  categories = ['Security', 'Housekeeping', 'Plumbing', 'Electrical', 'Landscaping', 'IT', 'Lifts', 'Other'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Vendor | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.vendors().filter(v => !term || v.name.toLowerCase().includes(term) || v.category.toLowerCase().includes(term));
  });

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['Security', Validators.required],
    status: ['Active', Validators.required],
    contact: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contractValue: [0],
    rating: [3, [Validators.min(1), Validators.max(5)]],
    contractStart: ['', Validators.required],
    contractEnd: ['', Validators.required],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ category: 'Security', status: 'Active', contractValue: 0, rating: 3 }); this.panelOpen.set(true); }
  openEdit(v: Vendor) { this.editTarget.set(v); this.form.patchValue({ ...v }); this.panelOpen.set(true); }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) { this.store.updateVendor(target.id, v); } else { this.store.addVendor(v); }
    this.closePanel();
  }

  confirmDelete(v: Vendor) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Vendor', message: `Remove "${v.name}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteVendor(v.id); });
  }
}

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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminStoreService } from '../../../core/services/admin-store.service';
import { SlideOverComponent } from '../../../shared/components/slide-over.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { Resident } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-residents',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule, MatTooltipModule,
    SlideOverComponent
  ],
  template: `
    <div class="admin-page fade-in">
      <div class="page-toolbar">
        <div>
          <h2>Residents</h2>
          <p class="meta">{{ filtered().length }} of {{ store.residents().length }} residents</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Resident
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()" class="w-full">
          <ng-container matColumnDef="flat">
            <th mat-header-cell *matHeaderCellDef>Flat</th>
            <td mat-cell *matCellDef="let r"><strong>{{ r.block }}-{{ r.flatNumber }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="owner">
            <th mat-header-cell *matHeaderCellDef>Owner</th>
            <td mat-cell *matCellDef="let r">{{ r.ownerName }}</td>
          </ng-container>
          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let r">{{ r.contact }}</td>
          </ng-container>
          <ng-container matColumnDef="occupancy">
            <th mat-header-cell *matHeaderCellDef>Occupancy</th>
            <td mat-cell *matCellDef="let r">
              <span class="badge" [attr.data-type]="r.occupancy">{{ r.occupancy }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">
              <span class="badge" [attr.data-type]="r.status">{{ r.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="dues">
            <th mat-header-cell *matHeaderCellDef>Dues</th>
            <td mat-cell *matCellDef="let r">₹{{ r.duesAmount | number }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(r)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>person_off</mat-icon><span>No residents found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Resident' : 'Add Resident'"
        subtitle="Fill in flat & owner details" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Block</mat-label>
          <mat-select formControlName="block">
            @for (b of blocks; track b) { <mat-option [value]="b">{{ b }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Flat Number</mat-label>
          <input matInput formControlName="flatNumber" placeholder="101" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Owner Name</mat-label>
          <input matInput formControlName="ownerName" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Tenant Name (optional)</mat-label>
          <input matInput formControlName="tenantName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contact</mat-label>
          <input matInput formControlName="contact" placeholder="+91 9XXXXXXX" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Parking Slots</mat-label>
          <input matInput formControlName="parkingSlots" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Occupancy</mat-label>
          <mat-select formControlName="occupancy">
            <mat-option value="Owner">Owner</mat-option>
            <mat-option value="Tenant">Tenant</mat-option>
            <mat-option value="Vacant">Vacant</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Dues Amount (₹)</mat-label>
          <input matInput formControlName="duesAmount" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Joined Date</mat-label>
          <input matInput formControlName="joinedDate" type="date" />
        </mat-form-field>
        <div class="form-actions span2">
          <button mat-button type="button" (click)="closePanel()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
            {{ editTarget() ? 'Update' : 'Add' }} Resident
          </button>
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
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-type="Active"], .badge[data-type="Owner"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-type="Inactive"], .badge[data-type="Vacant"] { background: color-mix(in srgb,#94a3b8 15%,transparent); color: #64748b; }
    .badge[data-type="Tenant"] { background: color-mix(in srgb,#3b82f6 15%,transparent); color: #2563eb; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminResidentsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['flat', 'owner', 'contact', 'occupancy', 'status', 'dues', 'actions'];
  blocks = ['A', 'B', 'C', 'D', 'E'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Resident | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.residents().filter(r =>
      !term || r.ownerName.toLowerCase().includes(term) ||
      r.flatNumber.includes(term) || r.block.toLowerCase().includes(term) ||
      (r.email ?? '').toLowerCase().includes(term)
    );
  });

  form = this.fb.group({
    block: ['A', Validators.required],
    flatNumber: ['', Validators.required],
    ownerName: ['', Validators.required],
    tenantName: [''],
    contact: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    parkingSlots: [0],
    occupancy: ['Owner', Validators.required],
    status: ['Active', Validators.required],
    duesAmount: [0],
    joinedDate: [new Date().toISOString().split('T')[0], Validators.required],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ block: 'A', occupancy: 'Owner', status: 'Active', parkingSlots: 0, duesAmount: 0, joinedDate: new Date().toISOString().split('T')[0] }); this.panelOpen.set(true); }

  openEdit(r: Resident) {
    this.editTarget.set(r);
    this.form.patchValue({ ...r });
    this.panelOpen.set(true);
  }

  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) {
      this.store.updateResident(target.id, v);
    } else {
      this.store.addResident({ ...v, tenantName: v.tenantName || null });
    }
    this.closePanel();
  }

  confirmDelete(r: Resident) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Resident', message: `Remove ${r.ownerName} (${r.block}-${r.flatNumber})? This cannot be undone.`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteResident(r.id); });
  }
}

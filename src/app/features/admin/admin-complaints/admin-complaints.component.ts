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
import { Complaint } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule,
    SlideOverComponent
  ],
  template: `
    <div class="admin-page fade-in">
      <div class="page-toolbar">
        <div>
          <h2>Complaints</h2>
          <p class="meta">{{ filtered().length }} records</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Complaint
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let c"><strong>{{ c.title }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let c">{{ c.category }}</td>
          </ng-container>
          <ng-container matColumnDef="resident">
            <th mat-header-cell *matHeaderCellDef>Resident</th>
            <td mat-cell *matCellDef="let c">{{ c.resident }} ({{ c.flatNumber }})</td>
          </ng-container>
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priority</th>
            <td mat-cell *matCellDef="let c"><span class="badge" [attr.data-p]="c.priority">{{ c.priority }}</span></td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c"><span class="badge" [attr.data-s]="c.status">{{ c.status }}</span></td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(c)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(c)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>check_circle</mat-icon><span>No complaints found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Complaint' : 'New Complaint'"
        subtitle="Log a resident complaint" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            @for (c of categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
            <mat-option value="Critical">Critical</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Open">Open</mat-option>
            <mat-option value="Assigned">Assigned</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="Resolved">Resolved</mat-option>
            <mat-option value="Closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Resident Name</mat-label>
          <input matInput formControlName="resident" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Flat Number</mat-label>
          <input matInput formControlName="flatNumber" placeholder="A-101" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Assigned To</mat-label>
          <input matInput formControlName="assignedTo" placeholder="Staff name (optional)" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Created Date</mat-label>
          <input matInput formControlName="createdDate" type="date" />
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
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-p="Critical"] { background: color-mix(in srgb,#ef4444 15%,transparent); color: #dc2626; }
    .badge[data-p="High"] { background: color-mix(in srgb,#f97316 15%,transparent); color: #ea580c; }
    .badge[data-p="Medium"] { background: color-mix(in srgb,#f59e0b 15%,transparent); color: #b45309; }
    .badge[data-p="Low"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Open"] { background: color-mix(in srgb,#ef4444 15%,transparent); color: #dc2626; }
    .badge[data-s="Assigned"] { background: color-mix(in srgb,#3b82f6 15%,transparent); color: #2563eb; }
    .badge[data-s="In Progress"] { background: color-mix(in srgb,#f59e0b 15%,transparent); color: #b45309; }
    .badge[data-s="Resolved"], .badge[data-s="Closed"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminComplaintsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['title', 'category', 'resident', 'priority', 'status', 'actions'];
  categories = ['Plumbing', 'Electrical', 'Lift', 'Security', 'Housekeeping', 'Parking', 'Noise', 'Water', 'Other'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Complaint | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.complaints().filter(c =>
      !term || c.title.toLowerCase().includes(term) || c.resident.toLowerCase().includes(term)
    );
  });

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['Plumbing', Validators.required],
    priority: ['Medium', Validators.required],
    status: ['Open', Validators.required],
    resident: ['', Validators.required],
    flatNumber: ['', Validators.required],
    assignedTo: [null as string | null],
    createdDate: [new Date().toISOString().split('T')[0], Validators.required],
    resolvedDate: [null as string | null],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ category: 'Plumbing', priority: 'Medium', status: 'Open', createdDate: new Date().toISOString().split('T')[0] }); this.panelOpen.set(true); }
  openEdit(c: Complaint) { this.editTarget.set(c); this.form.patchValue({ ...c }); this.panelOpen.set(true); }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) { this.store.updateComplaint(target.id, v); } else { this.store.addComplaint({ ...v, resolvedDate: null }); }
    this.closePanel();
  }

  confirmDelete(c: Complaint) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Complaint', message: `Remove "${c.title}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteComplaint(c.id); });
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminStoreService } from '../../../core/services/admin-store.service';
import { SlideOverComponent } from '../../../shared/components/slide-over.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { Notice } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatCheckboxModule, MatTooltipModule,
    SlideOverComponent
  ],
  template: `
    <div class="admin-page fade-in">
      <div class="page-toolbar">
        <div>
          <h2>Notices</h2>
          <p class="meta">{{ filtered().length }} notices</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Notice
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let n">
              <strong>{{ n.title }}</strong>
              @if (n.pinned) { <mat-icon class="pin-icon" matTooltip="Pinned">push_pin</mat-icon> }
              @if (n.important) { <mat-icon class="imp-icon" matTooltip="Important">priority_high</mat-icon> }
            </td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let n">{{ n.category }}</td>
          </ng-container>
          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let n">{{ n.author }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let n">{{ n.date | date:'dd MMM yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let n">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(n)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(n)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>campaign</mat-icon><span>No notices found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Notice' : 'New Notice'"
        subtitle="Publish announcements to residents" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Body</mat-label>
          <textarea matInput formControlName="body" rows="4"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            @for (c of categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Author</mat-label>
          <input matInput formControlName="author" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput formControlName="date" type="date" />
        </mat-form-field>
        <div class="checks">
          <mat-checkbox formControlName="pinned">Pin to top</mat-checkbox>
          <mat-checkbox formControlName="important">Mark as Important</mat-checkbox>
        </div>
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
    .pin-icon { font-size: 14px; width: 14px; height: 14px; color: var(--primary); vertical-align: middle; margin-left: 4px; }
    .imp-icon { font-size: 14px; width: 14px; height: 14px; color: #ef4444; vertical-align: middle; margin-left: 2px; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .checks { display: flex; gap: 1.5rem; align-items: center; grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminNoticesComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['title', 'category', 'author', 'date', 'actions'];
  categories = ['General', 'Maintenance', 'Events', 'Finance', 'Emergency', 'Parking', 'Rules', 'Other'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Notice | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.notices().filter(n => !term || n.title.toLowerCase().includes(term));
  });

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    category: ['General', Validators.required],
    author: ['Management Committee', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    pinned: [false],
    important: [false],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ category: 'General', author: 'Management Committee', date: new Date().toISOString().split('T')[0], pinned: false, important: false }); this.panelOpen.set(true); }
  openEdit(n: Notice) { this.editTarget.set(n); this.form.patchValue({ ...n }); this.panelOpen.set(true); }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) { this.store.updateNotice(target.id, v); } else { this.store.addNotice(v); }
    this.closePanel();
  }

  confirmDelete(n: Notice) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Notice', message: `Remove "${n.title}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteNotice(n.id); });
  }
}

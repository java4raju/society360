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
import { Transaction } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-transactions',
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
          <h2>Transactions</h2>
          <p class="meta">{{ filtered().length }} records</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Transaction
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let t">{{ t.date | date:'dd MMM yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let t">{{ t.description }}</td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let t">{{ t.category }}</td>
          </ng-container>
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let t">
              <span [class]="t.type === 'Income' ? 'income' : 'expense'">
                {{ t.type === 'Income' ? '+' : '-' }}{{ t.amount | inr }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let t">
              <span class="badge" [attr.data-s]="t.status">{{ t.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let t">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(t)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(t)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>receipt_long</mat-icon><span>No transactions found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Transaction' : 'New Transaction'"
        subtitle="Record income or expense" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            @for (c of categories; track c) { <mat-option [value]="c">{{ c }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="Income">Income</mat-option>
            <mat-option value="Expense">Expense</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Amount (₹)</mat-label>
          <input matInput formControlName="amount" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Completed">Completed</mat-option>
            <mat-option value="Pending">Pending</mat-option>
            <mat-option value="Failed">Failed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Payment Method</mat-label>
          <mat-select formControlName="method">
            @for (m of methods; track m) { <mat-option [value]="m">{{ m }}</mat-option> }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput formControlName="date" type="date" />
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
    .income { color: #16a34a; font-weight: 600; }
    .expense { color: #dc2626; font-weight: 600; }
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-s="Completed"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Pending"] { background: color-mix(in srgb,#f59e0b 15%,transparent); color: #b45309; }
    .badge[data-s="Failed"] { background: color-mix(in srgb,#ef4444 15%,transparent); color: #dc2626; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminTransactionsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['date', 'description', 'category', 'amount', 'status', 'actions'];
  categories = ['Maintenance', 'Utilities', 'Security', 'Repairs', 'Events', 'Legal', 'Salary', 'Other'];
  methods = ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Online'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Transaction | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.transactions().filter(t =>
      !term || t.description.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
    );
  });

  form = this.fb.group({
    description: ['', Validators.required],
    category: ['Maintenance', Validators.required],
    type: ['Income', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    status: ['Completed', Validators.required],
    method: ['Bank Transfer', Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ category: 'Maintenance', type: 'Income', status: 'Completed', method: 'Bank Transfer', date: new Date().toISOString().split('T')[0], amount: 0 }); this.panelOpen.set(true); }
  openEdit(t: Transaction) { this.editTarget.set(t); this.form.patchValue({ ...t }); this.panelOpen.set(true); }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) { this.store.updateTransaction(target.id, v); } else { this.store.addTransaction(v); }
    this.closePanel();
  }

  confirmDelete(t: Transaction) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Transaction', message: `Remove "${t.description}" (₹${t.amount})?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteTransaction(t.id); });
  }
}

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
import { Meeting } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-meetings',
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
          <h2>Meetings</h2>
          <p class="meta">{{ filtered().length }} meetings</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Schedule Meeting
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Meeting</th>
            <td mat-cell *matCellDef="let m"><strong>{{ m.title }}</strong><br><small>{{ m.type }}</small></td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let m">{{ m.date | date:'dd MMM yyyy' }}</td>
          </ng-container>
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let m">{{ m.location }}</td>
          </ng-container>
          <ng-container matColumnDef="attendees">
            <th mat-header-cell *matHeaderCellDef>Attendees</th>
            <td mat-cell *matCellDef="let m">{{ m.attendees }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let m"><span class="badge" [attr.data-s]="m.status">{{ m.status }}</span></td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let m">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(m)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(m)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>groups</mat-icon><span>No meetings found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Meeting' : 'Schedule Meeting'"
        subtitle="RWA committee & general body meetings" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Meeting Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="AGM">AGM</mat-option>
            <mat-option value="Committee">Committee</mat-option>
            <mat-option value="Emergency">Emergency</mat-option>
            <mat-option value="General">General</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Scheduled">Scheduled</mat-option>
            <mat-option value="Completed">Completed</mat-option>
            <mat-option value="Cancelled">Cancelled</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput formControlName="date" type="date" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Expected Attendees</mat-label>
          <input matInput formControlName="attendees" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Agenda (one item per line)</mat-label>
          <textarea matInput formControlName="agendaText" rows="3" placeholder="Item 1&#10;Item 2&#10;Item 3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Decisions (one per line)</mat-label>
          <textarea matInput formControlName="decisionsText" rows="3"></textarea>
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
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-s="Scheduled"] { background: color-mix(in srgb,#3b82f6 15%,transparent); color: #2563eb; }
    .badge[data-s="Completed"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Cancelled"] { background: color-mix(in srgb,#94a3b8 15%,transparent); color: #64748b; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminMeetingsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['title', 'date', 'location', 'attendees', 'status', 'actions'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Meeting | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.meetings().filter(m => !term || m.title.toLowerCase().includes(term));
  });

  form = this.fb.group({
    title: ['', Validators.required],
    type: ['Committee' as Meeting['type'], Validators.required],
    status: ['Scheduled' as Meeting['status'], Validators.required],
    date: [new Date().toISOString().split('T')[0], Validators.required],
    location: ['', Validators.required],
    attendees: [0],
    agendaText: [''],
    decisionsText: [''],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ type: 'Committee', status: 'Scheduled', date: new Date().toISOString().split('T')[0], attendees: 0 }); this.panelOpen.set(true); }
  openEdit(m: Meeting) {
    this.editTarget.set(m);
    this.form.patchValue({ ...m, agendaText: m.agenda.join('\n'), decisionsText: m.decisions.join('\n') });
    this.panelOpen.set(true);
  }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const agenda = (v.agendaText || '').split('\n').map((s: string) => s.trim()).filter(Boolean);
    const decisions = (v.decisionsText || '').split('\n').map((s: string) => s.trim()).filter(Boolean);
    const payload = { title: v.title, type: v.type, status: v.status, date: v.date, location: v.location, attendees: v.attendees, agenda, decisions };
    const target = this.editTarget();
    if (target) { this.store.updateMeeting(target.id, payload); } else { this.store.addMeeting(payload); }
    this.closePanel();
  }

  confirmDelete(m: Meeting) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Meeting', message: `Remove "${m.title}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteMeeting(m.id); });
  }
}

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
import { Project } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-projects',
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
          <h2>Projects</h2>
          <p class="meta">{{ filtered().length }} projects</p>
        </div>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search…" (input)="q.set($any($event.target).value)" />
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> Add Project
          </button>
        </div>
      </div>

      <div class="table-wrap glass-card">
        <table mat-table [dataSource]="filtered()">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let p"><strong>{{ p.name }}</strong><br><small>{{ p.category }}</small></td>
          </ng-container>
          <ng-container matColumnDef="budget">
            <th mat-header-cell *matHeaderCellDef>Budget</th>
            <td mat-cell *matCellDef="let p">{{ p.budget | inr }}</td>
          </ng-container>
          <ng-container matColumnDef="progress">
            <th mat-header-cell *matHeaderCellDef>Progress</th>
            <td mat-cell *matCellDef="let p">
              <div class="progress-row">
                <div class="progress-bar"><div class="fill" [style.width.%]="p.progress"></div></div>
                <span>{{ p.progress }}%</span>
              </div>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let p"><span class="badge" [attr.data-s]="p.status">{{ p.status }}</span></td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button color="primary" matTooltip="Edit" (click)="openEdit(p)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="confirmDelete(p)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;" class="hoverable"></tr>
        </table>
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>view_kanban</mat-icon><span>No projects found</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Project' : 'New Project'"
        subtitle="Infrastructure & society projects" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Project Name</mat-label>
          <input matInput formControlName="name" />
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
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Proposed">Proposed</mat-option>
            <mat-option value="Approved">Approved</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="Completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Budget (₹)</mat-label>
          <input matInput formControlName="budget" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Spent (₹)</mat-label>
          <input matInput formControlName="spent" type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Progress (%)</mat-label>
          <input matInput formControlName="progress" type="number" min="0" max="100" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Project Owner</mat-label>
          <input matInput formControlName="owner" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput formControlName="startDate" type="date" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput formControlName="endDate" type="date" />
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
    .progress-row { display: flex; align-items: center; gap: 8px; }
    .progress-bar { flex: 1; height: 6px; border-radius: 99px; background: var(--border); max-width: 100px; }
    .fill { height: 100%; border-radius: 99px; background: var(--primary); }
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .badge[data-s="In Progress"] { background: color-mix(in srgb,#3b82f6 15%,transparent); color: #2563eb; }
    .badge[data-s="Completed"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Proposed"] { background: color-mix(in srgb,#94a3b8 15%,transparent); color: #64748b; }
    .badge[data-s="Approved"] { background: color-mix(in srgb,#f59e0b 15%,transparent); color: #b45309; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminProjectsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  cols = ['name', 'budget', 'progress', 'status', 'actions'];
  categories = ['Infrastructure', 'Security', 'Landscaping', 'Electrical', 'Plumbing', 'Technology', 'Amenities', 'Other'];
  q = signal('');
  panelOpen = signal(false);
  editTarget = signal<Project | null>(null);

  filtered = computed(() => {
    const term = this.q().toLowerCase();
    return this.store.projects().filter(p => !term || p.name.toLowerCase().includes(term));
  });

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    category: ['Infrastructure', Validators.required],
    status: ['Proposed', Validators.required],
    budget: [0, [Validators.required, Validators.min(0)]],
    spent: [0],
    progress: [0, [Validators.min(0), Validators.max(100)]],
    owner: ['', Validators.required],
    startDate: [new Date().toISOString().split('T')[0], Validators.required],
    endDate: ['', Validators.required],
  });

  openAdd() { this.editTarget.set(null); this.form.reset({ category: 'Infrastructure', status: 'Proposed', budget: 0, spent: 0, progress: 0, startDate: new Date().toISOString().split('T')[0] }); this.panelOpen.set(true); }
  openEdit(p: Project) { this.editTarget.set(p); this.form.patchValue({ ...p }); this.panelOpen.set(true); }
  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const target = this.editTarget();
    if (target) { this.store.updateProject(target.id, v); } else { this.store.addProject(v); }
    this.closePanel();
  }

  confirmDelete(p: Project) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Project', message: `Remove "${p.name}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deleteProject(p.id); });
  }
}

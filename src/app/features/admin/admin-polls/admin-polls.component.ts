import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
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
import { Poll } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-polls',
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
          <h2>Polls</h2>
          <p class="meta">{{ filtered().length }} polls</p>
        </div>
        <div class="toolbar-actions">
          <button mat-flat-button color="primary" (click)="openAdd()">
            <mat-icon>add</mat-icon> New Poll
          </button>
        </div>
      </div>

      <div class="cards-grid">
        @for (p of filtered(); track p.id) {
          <div class="poll-card glass-card hoverable">
            <div class="poll-head">
              <div>
                <div class="poll-title">{{ p.title }}</div>
                <div class="poll-meta">{{ p.category }} · {{ p.totalVotes }} votes</div>
              </div>
              <span class="badge" [attr.data-s]="p.status">{{ p.status }}</span>
            </div>
            @for (opt of p.options; track opt.id) {
              <div class="opt">
                <div class="opt-label">{{ opt.label }}</div>
                <div class="opt-bar">
                  <div class="opt-fill" [style.width.%]="p.totalVotes ? (opt.votes / p.totalVotes * 100) : 0"></div>
                </div>
                <div class="opt-pct">{{ p.totalVotes ? (opt.votes / p.totalVotes * 100 | number:'1.0-0') : 0 }}%</div>
              </div>
            }
            <div class="poll-actions">
              <button mat-button color="primary" (click)="openEdit(p)"><mat-icon>edit</mat-icon> Edit</button>
              <button mat-button color="warn" (click)="confirmDelete(p)"><mat-icon>delete</mat-icon> Delete</button>
            </div>
          </div>
        }
        @if (filtered().length === 0) {
          <div class="empty"><mat-icon>how_to_vote</mat-icon><span>No polls yet</span></div>
        }
      </div>
    </div>

    <app-slide-over [open]="panelOpen()" [title]="editTarget() ? 'Edit Poll' : 'New Poll'"
        subtitle="Create a resident poll" (close)="closePanel()">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Poll Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
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
            <mat-option value="Closed">Closed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="span2">
          <mat-label>End Date</mat-label>
          <input matInput formControlName="endDate" type="date" />
        </mat-form-field>

        <div class="options-section span2">
          <div class="options-header">
            <span>Options</span>
            <button type="button" mat-stroked-button (click)="addOption()"><mat-icon>add</mat-icon> Add Option</button>
          </div>
          @for (ctrl of optionsArray.controls; track $index) {
            <div class="option-row">
              <mat-form-field appearance="outline" class="flex1">
                <mat-label>Option {{ $index + 1 }}</mat-label>
                <input matInput [formControl]="$any(ctrl)" />
              </mat-form-field>
              @if (optionsArray.length > 2) {
                <button type="button" mat-icon-button color="warn" (click)="removeOption($index)"><mat-icon>remove_circle</mat-icon></button>
              }
            </div>
          }
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
    .toolbar-actions { display: flex; gap: 1rem; align-items: center; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
    .poll-card { padding: 1.25rem; border-radius: 16px; display: flex; flex-direction: column; gap: .75rem; }
    .poll-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .5rem; }
    .poll-title { font-weight: 700; font-size: .95rem; }
    .poll-meta { font-size: .75rem; color: var(--text-secondary); margin-top: 2px; }
    .opt { display: flex; align-items: center; gap: 8px; }
    .opt-label { font-size: .8rem; min-width: 90px; }
    .opt-bar { flex: 1; height: 6px; border-radius: 99px; background: var(--border); }
    .opt-fill { height: 100%; border-radius: 99px; background: var(--primary); transition: width .5s; }
    .opt-pct { font-size: .75rem; font-weight: 600; min-width: 36px; text-align: right; }
    .poll-actions { display: flex; gap: .5rem; margin-top: .25rem; }
    .badge { padding: 3px 10px; border-radius: 99px; font-size: .75rem; font-weight: 600; flex-shrink: 0; }
    .badge[data-s="Active"] { background: color-mix(in srgb,#22c55e 15%,transparent); color: #16a34a; }
    .badge[data-s="Closed"] { background: color-mix(in srgb,#94a3b8 15%,transparent); color: #64748b; }
    .empty { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3rem; color: var(--text-secondary); grid-column: 1 / -1; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-grid .span2 { grid-column: span 2; }
    .options-section { display: flex; flex-direction: column; gap: .75rem; }
    .options-header { display: flex; align-items: center; justify-content: space-between; font-weight: 600; font-size: .875rem; }
    .option-row { display: flex; align-items: center; gap: .5rem; }
    .flex1 { flex: 1; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: .5rem; }
  `]
})
export class AdminPollsComponent {
  store = inject(AdminStoreService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  categories = ['Amenities', 'Maintenance', 'Rules', 'Events', 'Finance', 'Other'];
  panelOpen = signal(false);
  editTarget = signal<Poll | null>(null);
  filtered = computed(() => this.store.polls());

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['Amenities', Validators.required],
    status: ['Active' as Poll['status'], Validators.required],
    endDate: ['', Validators.required],
    options: this.fb.array([this.fb.control(''), this.fb.control('')]),
  });

  get optionsArray() { return this.form.get('options') as FormArray; }

  addOption() { this.optionsArray.push(this.fb.control('')); }
  removeOption(i: number) { this.optionsArray.removeAt(i); }

  openAdd() {
    this.editTarget.set(null);
    this.form.reset({ category: 'Amenities', status: 'Active' });
    while (this.optionsArray.length > 2) this.optionsArray.removeAt(this.optionsArray.length - 1);
    this.optionsArray.controls.forEach(c => c.setValue(''));
    this.panelOpen.set(true);
  }

  openEdit(p: Poll) {
    this.editTarget.set(p);
    while (this.optionsArray.length < p.options.length) this.optionsArray.push(this.fb.control(''));
    while (this.optionsArray.length > p.options.length) this.optionsArray.removeAt(this.optionsArray.length - 1);
    this.form.patchValue({ title: p.title, description: p.description, category: p.category, status: p.status, endDate: p.endDate });
    p.options.forEach((opt, i) => this.optionsArray.at(i).setValue(opt.label));
    this.panelOpen.set(true);
  }

  closePanel() { this.panelOpen.set(false); }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as any;
    const labels: string[] = v.options.filter((o: string) => o?.trim());
    const target = this.editTarget();

    if (target) {
      const updatedOptions = labels.map((label, i) => ({
        id: target.options[i]?.id ?? crypto.randomUUID(),
        label,
        votes: target.options[i]?.votes ?? 0,
      }));
      this.store.updatePoll(target.id, { title: v.title, description: v.description, category: v.category, status: v.status, endDate: v.endDate, options: updatedOptions, totalVotes: updatedOptions.reduce((s, o) => s + o.votes, 0) });
    } else {
      const options = labels.map(label => ({ id: crypto.randomUUID(), label, votes: 0 }));
      this.store.addPoll({ title: v.title, description: v.description, category: v.category, status: v.status, endDate: v.endDate, options, totalVotes: 0, hasVoted: false });
    }
    this.closePanel();
  }

  confirmDelete(p: Poll) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Poll', message: `Remove "${p.title}"?`, danger: true }
    }).afterClosed().subscribe(ok => { if (ok) this.store.deletePoll(p.id); });
  }
}

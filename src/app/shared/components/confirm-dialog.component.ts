import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmData { title: string; message: string; danger?: boolean; }

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-wrap">
      <div class="icon-row" [class.danger]="data.danger">
        <mat-icon>{{ data.danger ? 'delete_forever' : 'help_outline' }}</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>{{ data.message }}</mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="ref.close(false)">Cancel</button>
        <button mat-flat-button [color]="data.danger ? 'warn' : 'primary'" (click)="ref.close(true)">Confirm</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-wrap { padding: 1.5rem; min-width: 340px; }
    .icon-row { width: 56px; height: 56px; border-radius: 50%; background: color-mix(in srgb, var(--primary) 15%, transparent); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .icon-row.danger { background: color-mix(in srgb, #ef4444 15%, transparent); }
    .icon-row.danger mat-icon, .icon-row.danger ::ng-deep mat-icon { color: #ef4444; }
    .icon-row mat-icon { color: var(--primary); font-size: 28px; width: 28px; height: 28px; }
    h2 { margin: 0 0 .5rem; font-size: 1.125rem; }
    mat-dialog-actions { padding-top: 1rem; }
  `]
})
export class ConfirmDialogComponent {
  data = inject<ConfirmData>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<ConfirmDialogComponent>);
}

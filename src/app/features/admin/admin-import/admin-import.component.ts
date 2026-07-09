import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { AdminStoreService } from '../../../core/services/admin-store.service';
import { Resident, Transaction } from '../../../shared/models/models';

type ImportType = 'residents' | 'transactions';
type ParsedRow = Record<string, string>;

interface ImportResult { success: number; errors: string[]; }

const RESIDENT_COLUMNS = ['flatNumber','block','ownerName','tenantName','contact','email','parkingSlots','occupancy','status','duesAmount','joinedDate'];
const TRANSACTION_COLUMNS = ['date','description','category','amount','type','status','method'];

@Component({
  selector: 'app-admin-import',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatTableModule, MatProgressBarModule],
  template: `
    <div class="import-page fade-in">
      <div class="import-header">
        <div>
          <h2>Bulk Import</h2>
          <p class="meta">Import data via Excel (.xlsx) or CSV files</p>
        </div>
      </div>

      <!-- Step 1: Choose type -->
      <div class="step-card glass-card">
        <div class="step-num">1</div>
        <div class="step-body">
          <h3>Select Data Type</h3>
          <p>Choose what kind of data you want to import</p>
          <div class="type-grid">
            @for (t of types; track t.value) {
              <div class="type-card" [class.selected]="importType() === t.value" (click)="importType.set(t.value)">
                <mat-icon>{{ t.icon }}</mat-icon>
                <span>{{ t.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Step 2: Download template -->
      <div class="step-card glass-card">
        <div class="step-num">2</div>
        <div class="step-body">
          <h3>Download Template</h3>
          <p>Download a CSV template pre-filled with the correct column headers</p>
          <div class="template-info">
            <div class="cols">
              <strong>Required columns:</strong>
              <div class="col-chips">
                @for (col of currentColumns(); track col) {
                  <span class="chip">{{ col }}</span>
                }
              </div>
            </div>
          </div>
          <button mat-stroked-button color="primary" (click)="downloadTemplate()">
            <mat-icon>download</mat-icon> Download CSV Template
          </button>
        </div>
      </div>

      <!-- Step 3: Upload file -->
      <div class="step-card glass-card">
        <div class="step-num">3</div>
        <div class="step-body">
          <h3>Upload File</h3>
          <p>Upload a filled-in CSV or Excel (.xlsx) file</p>
          <div class="upload-zone" [class.drag-over]="dragging()"
               (dragover)="$event.preventDefault(); dragging.set(true)"
               (dragleave)="dragging.set(false)"
               (drop)="onDrop($event)">
            <mat-icon>cloud_upload</mat-icon>
            <p>Drag & drop your file here or</p>
            <label class="file-btn">
              <input type="file" accept=".csv,.xlsx" (change)="onFileChange($event)" hidden />
              <span>Browse Files</span>
            </label>
            @if (fileName()) {
              <div class="file-name"><mat-icon>attach_file</mat-icon>{{ fileName() }}</div>
            }
          </div>
        </div>
      </div>

      <!-- Preview -->
      @if (previewRows().length > 0) {
        <div class="step-card glass-card">
          <div class="step-num">4</div>
          <div class="step-body">
            <h3>Preview (first 5 rows)</h3>
            <p>Verify your data looks correct before importing</p>
            <div class="preview-table">
              <table mat-table [dataSource]="previewRows().slice(0, 5)">
                @for (col of previewCols(); track col) {
                  <ng-container [matColumnDef]="col">
                    <th mat-header-cell *matHeaderCellDef>{{ col }}</th>
                    <td mat-cell *matCellDef="let row">{{ row[col] }}</td>
                  </ng-container>
                }
                <tr mat-header-row *matHeaderRowDef="previewCols()"></tr>
                <tr mat-row *matRowDef="let row; columns: previewCols()"></tr>
              </table>
            </div>
            <div class="import-summary">
              <span class="count">{{ previewRows().length }} rows ready to import</span>
              <button mat-flat-button color="primary" [disabled]="importing()" (click)="runImport()">
                <mat-icon>{{ importing() ? 'hourglass_empty' : 'upload' }}</mat-icon>
                {{ importing() ? 'Importing…' : 'Import ' + previewRows().length + ' ' + importType() }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Result -->
      @if (result()) {
        <div class="result-card" [class.has-errors]="result()!.errors.length > 0">
          <div class="result-icon">
            <mat-icon>{{ result()!.errors.length ? 'warning' : 'check_circle' }}</mat-icon>
          </div>
          <div class="result-body">
            <strong>Import {{ result()!.errors.length ? 'completed with issues' : 'successful' }}</strong>
            <p>✅ {{ result()!.success }} records imported successfully</p>
            @if (result()!.errors.length) {
              <p>❌ {{ result()!.errors.length }} rows had errors:</p>
              <ul>@for (e of result()!.errors.slice(0, 5); track e) { <li>{{ e }}</li> }</ul>
            }
            <button mat-stroked-button (click)="reset()">Import more</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .import-page { padding: 1.5rem; max-width: 860px; }
    .import-header { margin-bottom: 1.5rem; }
    .import-header h2 { margin: 0; font-size: 1.375rem; font-weight: 700; }
    .meta { margin: 4px 0 0; color: var(--text-secondary); font-size: .875rem; }
    .step-card { display: flex; gap: 1.5rem; padding: 1.5rem; border-radius: 16px; margin-bottom: 1.25rem; }
    .step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: #fff; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .step-body { flex: 1; }
    .step-body h3 { margin: 0 0 4px; font-size: 1rem; font-weight: 700; }
    .step-body p { margin: 0 0 1rem; color: var(--text-secondary); font-size: .875rem; }
    .type-grid { display: flex; gap: .75rem; flex-wrap: wrap; }
    .type-card { display: flex; align-items: center; gap: 8px; padding: .75rem 1.25rem; border: 2px solid var(--border); border-radius: 12px; cursor: pointer; font-weight: 500; transition: all .2s; }
    .type-card:hover { border-color: var(--primary); }
    .type-card.selected { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 10%, transparent); color: var(--primary); }
    .template-info { margin-bottom: 1rem; }
    .col-chips { display: flex; flex-wrap: wrap; gap: .375rem; margin-top: .5rem; }
    .chip { padding: 3px 10px; background: var(--hover); border-radius: 99px; font-size: .75rem; font-family: monospace; }
    .upload-zone { border: 2px dashed var(--border); border-radius: 16px; padding: 2.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: .75rem; transition: border-color .2s; cursor: pointer; }
    .upload-zone mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--text-secondary); }
    .upload-zone p { margin: 0; color: var(--text-secondary); }
    .upload-zone.drag-over { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 5%, transparent); }
    .file-btn { padding: 8px 20px; background: var(--primary); color: #fff; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: .875rem; }
    .file-name { display: flex; align-items: center; gap: 4px; font-size: .875rem; color: var(--primary); }
    .preview-table { overflow-x: auto; margin-bottom: 1rem; }
    .preview-table table { min-width: 600px; }
    .import-summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .count { font-size: .875rem; color: var(--text-secondary); }
    .result-card { display: flex; gap: 1.25rem; padding: 1.5rem; background: color-mix(in srgb, #22c55e 10%, transparent); border: 1px solid #22c55e; border-radius: 16px; }
    .result-card.has-errors { background: color-mix(in srgb, #f59e0b 10%, transparent); border-color: #f59e0b; }
    .result-icon mat-icon { font-size: 36px; width: 36px; height: 36px; color: #16a34a; }
    .result-card.has-errors .result-icon mat-icon { color: #b45309; }
    .result-body strong { font-size: 1rem; font-weight: 700; }
    .result-body p { margin: .5rem 0; font-size: .875rem; }
    .result-body ul { margin: .25rem 0; padding-left: 1.25rem; font-size: .8rem; }
    .result-body button { margin-top: .75rem; }
  `]
})
export class AdminImportComponent {
  store = inject(AdminStoreService);

  types = [
    { value: 'residents' as ImportType, label: 'Residents', icon: 'diversity_3' },
    { value: 'transactions' as ImportType, label: 'Transactions', icon: 'account_balance_wallet' },
  ];

  importType = signal<ImportType>('residents');
  fileName = signal('');
  previewRows = signal<ParsedRow[]>([]);
  previewCols = signal<string[]>([]);
  importing = signal(false);
  dragging = signal(false);
  result = signal<ImportResult | null>(null);

  currentColumns() {
    return this.importType() === 'residents' ? RESIDENT_COLUMNS : TRANSACTION_COLUMNS;
  }

  downloadTemplate() {
    const cols = this.currentColumns();
    const csv = cols.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.importType()}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.parseFile(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.parseFile(file);
  }

  private async parseFile(file: File) {
    this.fileName.set(file.name);
    this.result.set(null);
    const text = await file.text();
    const rows = this.parseCSV(text);
    if (rows.length > 0) {
      this.previewCols.set(Object.keys(rows[0]));
      this.previewRows.set(rows);
    }
  }

  private parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = this.splitCSVLine(line);
      const row: ParsedRow = {};
      headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim().replace(/^"|"$/g, ''); });
      return row;
    });
  }

  private splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
      else { current += char; }
    }
    result.push(current);
    return result;
  }

  async runImport() {
    this.importing.set(true);
    await new Promise(r => setTimeout(r, 600));
    const rows = this.previewRows();
    const errors: string[] = [];
    let success = 0;

    if (this.importType() === 'residents') {
      const records: Omit<Resident, 'id'>[] = [];
      rows.forEach((row, i) => {
        if (!row['ownerName'] || !row['flatNumber'] || !row['block']) {
          errors.push(`Row ${i + 2}: Missing required field (ownerName, flatNumber, or block)`);
          return;
        }
        records.push({
          flatNumber: row['flatNumber'],
          block: row['block'] || 'A',
          ownerName: row['ownerName'],
          tenantName: row['tenantName'] || null,
          contact: row['contact'] || '',
          email: row['email'] || '',
          parkingSlots: Number(row['parkingSlots']) || 0,
          occupancy: (row['occupancy'] as Resident['occupancy']) || 'Owner',
          status: (row['status'] as Resident['status']) || 'Active',
          duesAmount: Number(row['duesAmount']) || 0,
          joinedDate: row['joinedDate'] || new Date().toISOString().split('T')[0],
        });
        success++;
      });
      if (records.length) this.store.bulkImportResidents(records);
    } else {
      const records: Omit<Transaction, 'id'>[] = [];
      rows.forEach((row, i) => {
        if (!row['description'] || !row['amount']) {
          errors.push(`Row ${i + 2}: Missing required field (description or amount)`);
          return;
        }
        records.push({
          date: row['date'] || new Date().toISOString().split('T')[0],
          description: row['description'],
          category: row['category'] || 'Other',
          amount: Number(row['amount']) || 0,
          type: (row['type'] as Transaction['type']) || 'Income',
          status: (row['status'] as Transaction['status']) || 'Completed',
          method: row['method'] || 'Bank Transfer',
        });
        success++;
      });
      if (records.length) this.store.bulkImportTransactions(records);
    }

    this.importing.set(false);
    this.result.set({ success, errors });
  }

  reset() {
    this.previewRows.set([]);
    this.previewCols.set([]);
    this.fileName.set('');
    this.result.set(null);
  }
}

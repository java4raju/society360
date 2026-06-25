import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component as Cmp, Inject } from '@angular/core';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { DocItem } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Cmp({
  selector: 'app-doc-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="dlg">
      <div class="dhead" [attr.data-t]="data.type">
        <mat-icon>description</mat-icon>
        <div><h3>{{ data.name }}</h3><span>{{ data.type }} · {{ data.size }}</span></div>
      </div>
      <div class="preview">
        <div class="page">
          <div class="ph"></div>
          @for (l of lines; track l) { <div class="ln" [style.width.%]="l"></div> }
          <div class="ln" style="width:42%"></div>
        </div>
      </div>
      <p class="desc">{{ data.description }}</p>
      <div class="meta">
        <span><mat-icon>folder</mat-icon> {{ data.category }}</span>
        <span><mat-icon>person</mat-icon> {{ data.uploadedBy }}</span>
        <span><mat-icon>event</mat-icon> {{ data.date }}</span>
      </div>
      <div class="actions">
        <button mat-stroked-button mat-dialog-close><mat-icon>close</mat-icon> Close</button>
        <button mat-flat-button color="primary"><mat-icon>download</mat-icon> Download</button>
      </div>
    </div>
  `,
  styles: [`
    .dlg { padding:20px; width:min(520px, 86vw); }
    .dhead { display:flex; align-items:center; gap:12px; padding-bottom:14px; border-bottom:1px solid var(--s-border); }
    .dhead mat-icon { width:46px; height:46px; font-size:26px; display:grid; place-items:center; border-radius:12px;
      background: color-mix(in srgb, var(--s-primary) 14%, transparent); color: var(--s-primary); }
    .dhead h3 { font-size:1.05rem; } .dhead span { font-size:.78rem; color: var(--s-text-faint); }
    .preview { background: var(--s-surface-2); border:1px solid var(--s-border); border-radius:12px; padding:18px; margin:16px 0; }
    .page { background: var(--s-surface); border:1px solid var(--s-border); border-radius:8px; padding:18px; box-shadow: var(--s-shadow); }
    .ph { height:16px; width:55%; border-radius:5px; background: var(--s-primary); opacity:.8; margin-bottom:14px; }
    .ln { height:9px; border-radius:5px; background: color-mix(in srgb, var(--s-text-faint) 22%, transparent); margin-bottom:9px; }
    .desc { font-size:.86rem; }
    .meta { display:flex; flex-wrap:wrap; gap:14px; margin:12px 0; font-size:.78rem; color: var(--s-text-soft); }
    .meta mat-icon { font-size:15px; width:15px; height:15px; vertical-align:-3px; }
    .actions { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
  `]
})
export class DocPreviewDialog {
  lines = [92, 88, 95, 80, 90, 86];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DocItem) {}
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDialogModule, SkeletonLoaderComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header icon="folder" title="Documents" subtitle="Central repository of society records and contracts."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader variant="cards" [count]="6"></app-skeleton-loader>
    } @else {
      <div class="toolbar fade-in">
        <mat-form-field appearance="outline" class="search">
          <mat-label>Search documents</mat-label>
          <input matInput [ngModel]="search()" (ngModelChange)="search.set($event)" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <div class="chips">
          <button class="chip" [class.on]="category()===''" (click)="category.set('')">All</button>
          @for (c of categories(); track c) {
            <button class="chip" [class.on]="category()===c" (click)="category.set(c)">{{ c }}</button>
          }
        </div>
      </div>

      @if (filtered().length === 0) {
        <app-empty-state icon="folder_off" title="No documents found" message="Try a different search or category."></app-empty-state>
      } @else {
        <div class="grid fade-in">
          @for (d of filtered(); track d.id) {
            <div class="glass-card hoverable doc" (click)="open(d)">
              <div class="ic" [attr.data-t]="d.type"><mat-icon>description</mat-icon><span class="ext">{{ d.type }}</span></div>
              <div class="info">
                <h4>{{ d.name }}</h4>
                <span class="cat">{{ d.category }}</span>
                <div class="m"><span>{{ d.size }}</span><span>·</span><span>{{ d.date }}</span></div>
              </div>
              <mat-icon class="go">visibility</mat-icon>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [`
    .toolbar { display:flex; flex-direction:column; gap:10px; margin-bottom:8px; }
    .search { max-width:420px; }
    .chips { display:flex; flex-wrap:wrap; gap:8px; }
    .chip { border:1px solid var(--s-border); background: var(--s-surface); color: var(--s-text-soft);
      padding:6px 14px; border-radius:999px; font-size:.8rem; font-weight:600; cursor:pointer; transition: all .2s; font-family:inherit; }
    .chip:hover { border-color: var(--s-primary); } .chip.on { background: var(--s-primary); color:#fff; border-color: var(--s-primary); }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap:16px; margin-top:14px; }
    .doc { padding:16px; display:flex; align-items:center; gap:14px; cursor:pointer; }
    .ic { width:52px; height:60px; border-radius:10px; display:grid; place-items:center; position:relative; flex-shrink:0;
      background: color-mix(in srgb, var(--s-primary) 12%, transparent); color: var(--s-primary); }
    .ic[data-t="XLSX"]{ background: color-mix(in srgb,#10b981 14%,transparent); color:#10b981; }
    .ic[data-t="DOCX"]{ background: color-mix(in srgb,#3b82f6 14%,transparent); color:#3b82f6; }
    .ic mat-icon { font-size:26px; width:26px; height:26px; }
    .ext { position:absolute; bottom:5px; font-size:.55rem; font-weight:800; letter-spacing:.04em; }
    .info { flex:1; min-width:0; }
    .info h4 { font-size:.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .cat { font-size:.72rem; color: var(--s-primary); font-weight:600; }
    .m { display:flex; gap:6px; font-size:.74rem; color: var(--s-text-faint); margin-top:4px; }
    .go { color: var(--s-text-faint); }
    .doc:hover .go { color: var(--s-primary); }
  `]
})
export class DocumentsComponent {
  private repo = inject(SocietyRepository);
  private dialog = inject(MatDialog);

  loading = signal(true);
  docs = signal<DocItem[]>([]);
  search = signal('');
  category = signal('');

  categories = computed(() => Array.from(new Set(this.docs().map(d => d.category))));
  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.docs().filter(d =>
      (!q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)) &&
      (!this.category() || d.category === this.category()));
  });

  constructor() {
    this.repo.getDocuments().subscribe(d => { this.docs.set(d); this.loading.set(false); });
  }

  open(d: DocItem) {
    this.dialog.open(DocPreviewDialog, { data: d, panelClass: 'doc-dialog' });
  }
}

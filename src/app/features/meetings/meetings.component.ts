import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Meeting } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, MatIconModule, SkeletonLoaderComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header icon="groups" title="Meetings" subtitle="AGM and committee meetings, agendas and decisions."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader [count]="5"></app-skeleton-loader>
    } @else {
      <div class="timeline fade-in">
        @for (m of meetings(); track m.id) {
          <div class="tl-item">
            <div class="tl-marker" [attr.data-s]="m.status"><mat-icon>{{ icon(m) }}</mat-icon></div>
            <div class="glass-card hoverable mcard">
              <div class="mtop">
                <div>
                  <h4>{{ m.title }}</h4>
                  <div class="meta">
                    <span><mat-icon>event</mat-icon> {{ m.date }}</span>
                    <span><mat-icon>place</mat-icon> {{ m.location }}</span>
                    @if (m.attendees > 0) { <span><mat-icon>group</mat-icon> {{ m.attendees }} attendees</span> }
                  </div>
                </div>
                <div class="badges">
                  <span class="type">{{ m.type }}</span>
                  <app-status-badge [status]="m.status"></app-status-badge>
                </div>
              </div>
              <div class="cols">
                <div class="block">
                  <h5><mat-icon>list_alt</mat-icon> Agenda</h5>
                  <ul>@for (a of m.agenda; track a) { <li>{{ a }}</li> }</ul>
                </div>
                <div class="block">
                  <h5><mat-icon>gavel</mat-icon> Decisions</h5>
                  @if (m.decisions.length) {
                    <ul class="dec">@for (d of m.decisions; track d) { <li>{{ d }}</li> }</ul>
                  } @else {
                    <p class="pending">Decisions pending — meeting not yet held.</p>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .timeline { position:relative; padding-left:8px; }
    .timeline::before { content:''; position:absolute; left:21px; top:10px; bottom:10px; width:2px;
      background: linear-gradient(var(--s-primary), var(--s-violet), transparent); }
    .tl-item { display:flex; gap:18px; margin-bottom:20px; position:relative; }
    .tl-marker { width:44px; height:44px; border-radius:13px; display:grid; place-items:center; flex-shrink:0; z-index:1; color:#fff;
      background: linear-gradient(135deg, var(--s-primary), var(--s-violet)); box-shadow: var(--s-shadow); }
    .tl-marker[data-s="Scheduled"]{ background: linear-gradient(135deg, #06b6d4, #3b82f6); }
    .tl-marker[data-s="Cancelled"]{ background: linear-gradient(135deg, #ef4444, #f97316); }
    .mcard { flex:1; padding:18px; min-width:0; }
    .mtop { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
    .mtop h4 { font-size:1.05rem; }
    .meta { display:flex; flex-wrap:wrap; gap:14px; margin-top:6px; font-size:.78rem; color: var(--s-text-soft); }
    .meta mat-icon { font-size:15px; width:15px; height:15px; vertical-align:-3px; }
    .badges { display:flex; align-items:center; gap:8px; height:fit-content; }
    .type { font-size:.7rem; font-weight:700; text-transform:uppercase; color: var(--s-primary);
      background: color-mix(in srgb, var(--s-primary) 12%, transparent); padding:3px 9px; border-radius:6px; }
    .cols { display:grid; grid-template-columns: 1fr 1fr; gap:18px; border-top:1px solid var(--s-border); padding-top:14px; }
    h5 { display:flex; align-items:center; gap:6px; font-size:.82rem; color: var(--s-text-soft); margin-bottom:8px; }
    h5 mat-icon { font-size:16px; width:16px; height:16px; color: var(--s-primary); }
    ul { margin:0; padding-left:18px; }
    li { font-size:.83rem; color: var(--s-text); margin-bottom:5px; }
    ul.dec li::marker { color: var(--s-success); }
    .pending { font-size:.82rem; color: var(--s-text-faint); font-style:italic; }
    @media (max-width: 720px){ .cols { grid-template-columns:1fr; } }
  `]
})
export class MeetingsComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  meetings = signal<Meeting[]>([]);

  constructor() {
    this.repo.getMeetings().subscribe(m => {
      this.meetings.set([...m].sort((a, b) => b.date.localeCompare(a.date)));
      this.loading.set(false);
    });
  }

  icon(m: Meeting): string {
    if (m.status === 'Scheduled') return 'event_upcoming';
    if (m.status === 'Cancelled') return 'event_busy';
    return m.type === 'AGM' ? 'how_to_reg' : 'groups';
  }
}

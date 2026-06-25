import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SocietyRepository } from '../../core/repositories/society.repository';
import { Poll } from '../../shared/models/models';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, SkeletonLoaderComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header icon="how_to_vote" title="Polls & Voting" subtitle="Participate in community governance decisions."></app-page-header>

    @if (loading()) {
      <app-skeleton-loader [count]="4"></app-skeleton-loader>
    } @else {
      <div class="grid fade-in">
        @for (p of polls(); track p.id) {
          <div class="glass-card hoverable poll">
            <div class="ptop">
              <span class="cat">{{ p.category }}</span>
              <app-status-badge [status]="p.status"></app-status-badge>
            </div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.description }}</p>

            <div class="opts">
              @for (o of p.options; track o.id) {
                <button class="opt" [class.win]="isLeading(p, o.id)" [disabled]="p.hasVoted || p.status==='Closed'"
                        (click)="vote(p, o.id)">
                  <div class="opt-head">
                    <span class="lbl">
                      @if (p.votedOption === o.id) { <mat-icon>check_circle</mat-icon> }
                      {{ o.label }}
                    </span>
                    <span class="pct">{{ pct(p, o.votes) }}%</span>
                  </div>
                  <div class="bar"><div class="fill" [style.width.%]="pct(p, o.votes)"></div></div>
                  <span class="votes">{{ o.votes }} votes</span>
                </button>
              }
            </div>

            <div class="foot">
              <span><mat-icon>groups</mat-icon> {{ p.totalVotes }} total votes</span>
              <span><mat-icon>event</mat-icon> Ends {{ p.endDate }}</span>
            </div>
            @if (p.hasVoted) { <div class="voted"><mat-icon>verified</mat-icon> You have voted in this poll</div> }
            @else if (p.status === 'Active') { <div class="cta">Tap an option to cast your vote</div> }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .grid { display:grid; grid-template-columns: repeat(2,1fr); gap:18px; }
    .poll { padding:20px; }
    .ptop { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
    .cat { font-size:.7rem; font-weight:700; text-transform:uppercase; color: var(--s-violet);
      background: color-mix(in srgb, var(--s-violet) 12%, transparent); padding:3px 9px; border-radius:6px; }
    .poll h3 { font-size:1.1rem; }
    .poll p { font-size:.85rem; margin:6px 0 16px; }
    .opts { display:flex; flex-direction:column; gap:11px; }
    .opt { text-align:left; width:100%; border:1px solid var(--s-border); background: var(--s-surface-2);
      border-radius:12px; padding:11px 13px; cursor:pointer; transition: border-color .2s, transform .15s, background .2s; font-family:inherit; }
    .opt:not(:disabled):hover { border-color: var(--s-primary); transform: translateX(3px); }
    .opt:disabled { cursor: default; }
    .opt.win { border-color: color-mix(in srgb, var(--s-primary) 50%, transparent); background: color-mix(in srgb, var(--s-primary) 7%, var(--s-surface-2)); }
    .opt-head { display:flex; justify-content:space-between; align-items:center; }
    .lbl { font-size:.87rem; font-weight:600; color: var(--s-text); display:flex; align-items:center; gap:5px; }
    .lbl mat-icon { font-size:16px; width:16px; height:16px; color: var(--s-primary); }
    .pct { font-weight:800; font-size:.9rem; color: var(--s-primary); }
    .bar { height:8px; border-radius:999px; margin:8px 0 4px; background: color-mix(in srgb, var(--s-text-faint) 16%, transparent); overflow:hidden; }
    .fill { height:100%; border-radius:999px; background: linear-gradient(90deg, var(--s-primary), var(--s-violet)); transition: width .8s cubic-bezier(.2,.8,.2,1); }
    .votes { font-size:.72rem; color: var(--s-text-faint); }
    .foot { display:flex; justify-content:space-between; margin-top:16px; padding-top:14px; border-top:1px solid var(--s-border); font-size:.78rem; color: var(--s-text-soft); }
    .foot mat-icon { font-size:15px; width:15px; height:15px; vertical-align:-3px; }
    .voted { margin-top:12px; display:flex; align-items:center; gap:6px; font-size:.8rem; color: var(--s-success); font-weight:600; }
    .voted mat-icon { font-size:17px; width:17px; height:17px; }
    .cta { margin-top:12px; font-size:.78rem; color: var(--s-text-faint); text-align:center; }
    @media (max-width: 820px){ .grid { grid-template-columns:1fr; } }
  `]
})
export class PollsComponent {
  private repo = inject(SocietyRepository);

  loading = signal(true);
  polls = signal<(Poll & { votedOption?: string })[]>([]);

  constructor() {
    this.repo.getPolls().subscribe(p => { this.polls.set(p); this.loading.set(false); });
  }

  pct(p: Poll, votes: number): number {
    return p.totalVotes ? Math.round(votes / p.totalVotes * 100) : 0;
  }

  isLeading(p: Poll, optId: string): boolean {
    const max = Math.max(...p.options.map(o => o.votes));
    return p.options.find(o => o.id === optId)?.votes === max;
  }

  vote(poll: Poll & { votedOption?: string }, optId: string): void {
    if (poll.hasVoted || poll.status === 'Closed') return;
    this.polls.update(list => list.map(p => {
      if (p.id !== poll.id) return p;
      const options = p.options.map(o => o.id === optId ? { ...o, votes: o.votes + 1 } : o);
      return { ...p, options, totalVotes: p.totalVotes + 1, hasVoted: true, votedOption: optId };
    }));
  }
}

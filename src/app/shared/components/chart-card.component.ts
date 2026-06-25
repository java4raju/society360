import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnChanges, SimpleChanges,
  ViewChild, input, inject
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ThemeService } from '../../core/services/theme.service';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  template: `
    <div class="glass-card hoverable chart-card fade-in">
      <div class="ch-head">
        <div>
          <h3>{{ title() }}</h3>
          @if (subtitle()) { <p>{{ subtitle() }}</p> }
        </div>
      </div>
      <div class="ch-body"><canvas #canvas></canvas></div>
    </div>
  `,
  styles: [`
    .chart-card { padding: 20px; height: 100%; }
    .ch-head { margin-bottom: 14px; }
    .ch-head h3 { font-size: 1rem; }
    .ch-head p { font-size: .8rem; margin: 2px 0 0; }
    .ch-body { position: relative; height: 260px; }
  `]
})
export class ChartCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private theme = inject(ThemeService);

  title = input.required<string>();
  subtitle = input<string>('');
  type = input.required<ChartType>();
  data = input.required<ChartConfiguration['data']>();
  options = input<ChartConfiguration['options']>({});

  private chart?: Chart;

  ngAfterViewInit(): void { this.render(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['data'] || changes['type'])) {
      this.chart.destroy();
      this.render();
    }
  }

  ngOnDestroy(): void { this.chart?.destroy(); }

  private render(): void {
    if (!this.canvasRef) return;
    const dark = this.theme.theme() === 'dark';
    const grid = dark ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,60,0.06)';
    const text = dark ? '#b6b4cc' : '#5b5870';

    const base: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.type() === 'pie' || this.type() === 'doughnut',
          position: 'bottom',
          labels: { color: text, usePointStyle: true, padding: 16, font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: dark ? '#1b1b27' : '#1e1b2e',
          titleColor: '#fff', bodyColor: '#e7e7f0', padding: 12, cornerRadius: 10, displayColors: true
        }
      },
      scales: (this.type() === 'pie' || this.type() === 'doughnut') ? {} : {
        x: { grid: { color: grid }, ticks: { color: text, font: { family: 'Inter' } } },
        y: { grid: { color: grid }, ticks: { color: text, font: { family: 'Inter' } } }
      }
    };

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.type(),
      data: this.data(),
      options: { ...base, ...this.options() }
    });
  }
}

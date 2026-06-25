import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inr', standalone: true })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined, compact = false): string {
    if (value === null || value === undefined || isNaN(value)) return '₹0';
    if (compact) {
      const abs = Math.abs(value);
      if (abs >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
      if (abs >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
      if (abs >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    }
    return '₹' + value.toLocaleString('en-IN');
  }
}

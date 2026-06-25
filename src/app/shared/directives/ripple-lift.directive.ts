import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Adds a subtle tilt/lift micro-interaction on pointer move for premium feel.
 */
@Directive({ selector: '[appRippleLift]', standalone: true })
export class RippleLiftDirective {
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
  }

  @HostListener('pointerleave')
  onLeave(): void {
    this.el.nativeElement.style.transform = '';
  }
}

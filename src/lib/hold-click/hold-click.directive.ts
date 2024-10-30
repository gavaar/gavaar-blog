import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: '[gavHoldClick]',
  standalone: true,
})
export class GavHoldClick {
  gavHoldClick = input.required<{ click: Function; hold: Function }>();

  private timeoutRef?: ReturnType<typeof setTimeout>;

  @HostListener('pointerdown')
  protected onPointerDown(): void {
    this.timeoutRef = setTimeout(() => {
      this.timeoutRef = undefined;
      this.gavHoldClick().hold();
    }, 500);
  }

  @HostListener('pointerup')
  protected onPointerUp(): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = undefined;
      this.gavHoldClick().click();
    }
  }
}

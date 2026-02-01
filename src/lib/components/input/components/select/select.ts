import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output, signal, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { GavIcon } from "@lib/components";

@Component({
  selector: 'gav-input-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [GavIcon, NgTemplateOutlet],
  host: {
    '(click)': 'open.set(!open())',
  },
})
export class GavInputSelect {
  value = input.required<string | null>();
  options = input<{ key: string; value: string; }[]>([]);
  template = input<TemplateRef<{ $implicit: string }>>();
  selectOption = output<string>();
  
  private preview = inject(ElementRef);
  protected popup = viewChild<ElementRef>('popup');

  protected open = signal(false);

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsideClick(e: Event) {
    if (!this.popup()?.nativeElement.contains(e.target) && !this.preview?.nativeElement.contains(e.target) && this.open()) {
      e.preventDefault();
      this.open.set(false);
    }
  }

  protected onSelectOption(key: string) {
    this.open.set(false);
    this.selectOption.emit(key);
  }
}

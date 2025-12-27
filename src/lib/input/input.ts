import { ChangeDetectionStrategy, Component, Optional, Self, ViewEncapsulation, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

export enum GavInputType {
  Text = 'text',
  Textarea = 'textarea',
  Slider = 'slider',
}

@Component({
  selector: 'gav-input',
  imports: [ReactiveFormsModule],
  template: `
    @if (label()) {
      <label class="gav-input__label" [for]="label()">{{ label() }}</label>
    }
    @switch (type()) {
      @case (GavInputType.Text) {
        <input
          class="gav-input"
          [id]="label()"
          [disabled]="disabled"
          [value]="inputValue()"
          [placeholder]="placeholder()"
          (keyup)="onValueChange($event)" />
      }
      @case (GavInputType.Textarea) {
        <textarea
          class="gav-input"
          rows="3"
          maxlength="140"
          [id]="label()"
          [value]="inputValue()"
          [disabled]="disabled"
          [placeholder]="placeholder()"
          (keyup)="onValueChange($event)"
        ></textarea>
      }
      @case (GavInputType.Slider) {
        <input
          class="gav-input__slider"
          type="range"
          min="-3"
          max="3"
          [id]="label()"
          [disabled]="disabled"
          [value]="inputValue()"
          (pointerup)="!inputValue() && onChange(0)"
          (input)="onValueChange($event)" />
      }
      @default {
        <span>Input type not supported</span>
      }
    }
  `,
  styleUrl: './input.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavInput implements ControlValueAccessor {
  label = input('');
  placeholder = input('');
  type = input<GavInputType | string>(GavInputType.Text);

  protected disabled = false;
  protected GavInputType = GavInputType;
  protected inputValue = signal(null);

  constructor(@Optional() @Self() public ngControl: NgControl) {    
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  protected onValueChange(e: any) {
    e.preventDefault();
    const value = e.target.value;
    this.inputValue.set(value);
    this.onChange(value);
  }

  // ControlValueAccessor
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any) {
    this.inputValue.set(value);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

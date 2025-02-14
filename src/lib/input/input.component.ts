import { ChangeDetectionStrategy, Component, Optional, Self, ViewEncapsulation, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'gav-input',
  imports: [ReactiveFormsModule],
  template: `
    @if (label()) {
      <label class="gav-input__label" [for]="label()">{{ label() }}</label>
    }
    <input
      class="gav-input"
      [id]="label()"
      [disabled]="disabled"
      [value]="inputValue()"
      (keyup)="onValueChange($event)" />
  `,
  styles: [`
    gav-input {
      display: flex;
      flex-direction: column;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 95%;
        border-radius: 0.25rem;
      }
    }

    .gav-input__label {
      padding: 0.25rem 0.75rem;
    }

    .gav-input {
      width: 100%;
      border: 0;
      border-radius: 0.5rem 0.5rem 0.25rem 0.25rem;
      padding: 0.25rem 0.75rem;
      color: var(--text);
      background-color: var(--background);
      border-bottom: 1px solid var(--secondary);

      &[disabled] {
        background-color: var(--disabled);
      }

      &:not([disabled]) {
        &:hover {
          box-shadow: 0 0 0.5rem var(--secondary);
          transition: 0.25s ease-out;
        }
      }
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavInput implements ControlValueAccessor {
  label = input('');
  disabled = false;

  protected inputValue = signal('');

  constructor(@Optional() @Self() public ngControl: NgControl) {    
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  protected onValueChange(e: any) {
    e.preventDefault();
    const value = e.target.value;
    this.onChange(value);
  }

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

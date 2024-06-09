import { ChangeDetectionStrategy, Component, Optional, Self, ViewEncapsulation, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'gav-input',
  imports: [ReactiveFormsModule],
  standalone: true,
  template: `
    @if (label()) {
      <label for="gav-input">{{ label() }}</label>
    }
    <input
      id="gav-input"
      class="gav-input"
      [disabled]="disabled"
      [value]="inputValue()"
      (keyup)="onValueChange($event)" />
  `,
  styles: [`
    gav-input {
      display: flex;
      flex-direction: column;
    }

    .gav-input {
      width: 100%;
      border: 1px solid var(--text);
      border-radius: 0.5rem;
      padding: 0.25rem;
      color: var(--text);
      background-color: var(--background);
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavInputComponent implements ControlValueAccessor {
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

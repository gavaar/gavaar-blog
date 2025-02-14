import { ChangeDetectionStrategy, Component, Optional, Self, ViewEncapsulation, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'gav-textarea',
  imports: [ReactiveFormsModule],
  template: `
    @if (label()) {
      <label class="gav-textarea__label" for="gav-textarea">{{ label() }}</label>
    }
    <textarea
      id="gav-textarea"
      class="gav-textarea"
      [value]="textareaValue()"
      (keyup)="onValueChange($event)">
    </textarea>
  `,
  styles: [`
    gav-textarea {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .gav-textarea__label {
      padding: 0.25rem 0.75rem;
    }

    .gav-textarea {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 0.5rem;
      padding: 0.25rem 0.75rem;
      color: var(--text);
      background-color: var(--background);
      outline: none;

      &:hover {
        box-shadow: 0 0 0.5rem var(--secondary);
        transition: 0.25s ease-out;
      }
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavTextarea implements ControlValueAccessor {
  label = input('');
  disabled = false;

  protected textareaValue = signal('');

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
    this.textareaValue.set(value);
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

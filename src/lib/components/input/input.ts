import { ChangeDetectionStrategy, Component, Optional, Self, ViewEncapsulation, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { GavInputType, InputConfig } from './models';
import { GavInputSelect } from './components';

@Component({
  selector: 'gav-input',
  imports: [GavInputSelect, ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': '$event.stopPropagation()',
  },
})
export class GavInput implements ControlValueAccessor {
  type = input<GavInputType | GavInputType[keyof GavInputType]>(GavInputType.Text);
  options = input<InputConfig>({});

  protected disabled = false;
  protected GavInputType = GavInputType;
  protected inputValue = signal(null);

  constructor(@Optional() @Self() public ngControl: NgControl) {    
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  protected onInputChange(e: any) {
    e.preventDefault();

    switch (this.type()) {
      case GavInputType.Number:
      case GavInputType.Slider:
        this.onValueChange(+e.target.value);
        break;
      default:
        this.onValueChange(e.target.value);
        break;
    }
  }
  
  protected onValueChange(value: any) {
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

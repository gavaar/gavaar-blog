import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AsyncSubject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'gav-textarea',
  imports: [ReactiveFormsModule],
  standalone: true,
  template: `
    @if (label()) {
      <label for="gav-textarea">{{ label() }}</label>
    }
    <textarea id="gav-textarea" class="gav-textarea" [formControl]="textareaControl"></textarea>
  `,
  styles: [`
    gav-textarea {
      display: flex;
      flex-direction: column;
    }

    .gav-textarea {
      width: 100%;
      height: 100%;
      color: var(--text);
      background-color: var(--background);
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavTextareaComponent implements OnInit, OnDestroy {
  label = input('');
  initText = input('');
  textUpdates = output<string>();

  textareaControl = new FormControl('');

  private destroy$ = new AsyncSubject<void>();

  ngOnInit(): void {
    this.textareaControl.setValue(this.initText());
    this.textareaControl.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$),
      )
      .subscribe(value => this.textUpdates.emit(value || ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

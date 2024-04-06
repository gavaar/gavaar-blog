import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'psychology',
  standalone: true,
  template: `<span style="margin-top: 5rem">Psychology placeholder</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsychologyComponent {}

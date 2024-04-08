import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'psychology',
  standalone: true,
  template: `<span style="margin-top: 5rem">Psychology placeholder [WIP]</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsychologyComponent {}

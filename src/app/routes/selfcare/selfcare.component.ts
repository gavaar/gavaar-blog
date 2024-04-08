import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'selfcare',
  standalone: true,
  template: `<span style="margin-top: 5rem">Selfcare placeholder [WIP]</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelfcareComponent {}

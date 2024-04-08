import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gaming',
  standalone: true,
  template: `<span style="margin-top: 5rem">Gaming placeholder [WIP]</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamingComponent {}

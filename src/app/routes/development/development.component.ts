import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'development',
  standalone: true,
  template: `<span style="margin-top: 5rem">Development placeholder</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentComponent {}

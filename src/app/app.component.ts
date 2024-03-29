import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';

@Component({
  selector: 'gav-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <gav-header />

    <section>
      <router-outlet />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

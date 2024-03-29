import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../lib/header/header.component';

@Component({
  selector: 'gav-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <gav-header />

    <section>
      <h1>Welcome to {{title}}!</h1>
      <router-outlet />
      <footer></footer>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'gavaar';
}

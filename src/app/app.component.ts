import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter } from 'rxjs';

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

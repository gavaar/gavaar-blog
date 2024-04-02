import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { HttpClient } from '@angular/common/http';
import { concatMap, filter } from 'rxjs';
import { track } from './firebase';

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
export class AppComponent {
  constructor(http: HttpClient, router: Router) {
    http.get('https://hutils.loxal.net/whois').pipe(
      concatMap(whoIs => {
        return router.events.pipe(
          filter(r => r instanceof NavigationEnd),
          concatMap((v: any) => track({ ...whoIs, route: v['url'] } as any)),
        );
      }),
    )
    .subscribe();
  }
}

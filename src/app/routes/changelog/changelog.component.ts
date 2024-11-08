import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { readFbCollection } from '@app/firebase';
import { Changelog } from '@app/entities';
import { GavIcon, Icon } from '@lib/icon';
import { take, tap } from 'rxjs';
import { ViewsService } from '@app/services/views.service';

const FIRST_APP_VERSION = '0.0.1';

@Component({
  selector: 'changelog',
  imports: [DatePipe, GavIcon],
  standalone: true,
  template: `
    <h1>Changelog</h1>
    @if (changelog()) {
      @for (release of changelog(); track release.id) {
        <div>
          <div class="changelog__version">
            <h2><strong>{{ release.id }}</strong></h2>
            <small>{{ release.date.seconds * 1000 | date: 'yyyy-MM-dd HH:mm' }}</small>
          </div>

          @if (release.changes) {
            <h5>Changes</h5>
            <ul>
              @for (change of release.changes; track change) {
                <li>{{change}}.</li>
              }
            </ul>
          }

          @if (release.techChanges) {
            <details class="changelog__details">
              <summary class="changelog__details-summary">
                <gav-icon class="changelog__details-icon" [icon]="Icon.BackArrow"/>
                <h5 class="changelog__details-title">Tech Changes</h5>
              </summary>

              <ul>
                @for (change of release.techChanges; track change) {
                  <li><small>{{change}}.</small></li>
                }
              </ul>
            </details>
          }
        </div>

        <hr />
      }
    }
    
    @if (loading()) {
      <img class="changelog__loading" src="assets/images/loading/dancing.gif" alt="loading rolling abitoad" />
    } @else if (!firstVersionLoaded()) {
      <gav-icon class="changelog__load-more" [icon]="Icon.Changelog" text="Load more..." (click)="loadMore()" />
    }

  `,
  styleUrl: './changelog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent implements OnInit {
  protected changelog = signal<Changelog[] | null>(null);
  protected Icon = Icon;
  protected loading = signal(false);
  protected firstVersionLoaded = computed<boolean>(() => this.latestVersionLoaded()?.id === FIRST_APP_VERSION);
  private latestVersionLoaded = computed<Changelog | undefined>(() => this.changelog()?.at(-1));

  constructor(meta: Meta, viewService: ViewsService) {
    viewService.increaseViews('pages', 'changelog').subscribe();
    meta.updateTag({ name: 'title', content: 'Changelog - Gavaar\'s random writings' });
    meta.updateTag({ name: 'description', content: 'Gavaar\'s random writings changelog. Versions and changes.' });
  }

  ngOnInit(): void {
    this.loadMore();
  }

  protected loadMore(): void {
    this.loading.set(true);
    readFbCollection<Changelog>('changelog', { orderBy: 'date', limit: 12, startAfter: this.latestVersionLoaded()?.date })
      .pipe(take(1), tap(() => this.loading.set(false)))
      .subscribe(changelog => this.changelog.set((this.changelog() || []).concat(changelog)));
  }
}

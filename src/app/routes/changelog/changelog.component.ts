import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { readFbCollection, updateFbDocument } from '../../firebase';
import { DatePipe } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Changelog } from '../../entity';
import { environment } from '../../../environments/environment';
import { increment } from 'firebase/firestore/lite';

@Component({
  selector: 'changelog',
  imports: [DatePipe],
  standalone: true,
  template: `
    <h1>Changelog</h1>
    @if (changelog()) {
      @for (release of changelog(); track release.version) {
        <div>
          <div class="changelog__version">
            <h2>{{ release.version }}</h2>
            <small>{{ release.date.seconds * 1000 | date: 'yyyy-MM-dd HH:mm' }}</small>
          </div>
          <h5>Changes</h5>
          <ul>
            @for (change of release.changes; track change) {
              <li>{{change}}.</li>
            }
          </ul>

          @if (release.techChanges) {
            <h5>Tech Changes</h5>
            <ul>
              @for (change of release.techChanges; track change) {
                <li><small>{{change}}.</small></li>
              }
            </ul>
          }
        </div>

        <hr />
      }
    } @else {
      <span class="changelog__loading">loading...</span>
    }
  `,
  styleUrl: './changelog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogComponent {
  changelog = toSignal(readFbCollection<Changelog>('changelog', { orderBy: 'date', limit: 12 }));

  constructor(meta: Meta) {
    meta.updateTag({ name: 'title', content: 'Changelog - Gavaar\'s random writings' });
    meta.updateTag({ name: 'description', content: 'Gavaar\'s random writings changelog. Versions and changes.' });
    if (environment.production) {
      updateFbDocument(`views/changelog`, { [`default`]: increment(1) }).subscribe();
    }
  }
}

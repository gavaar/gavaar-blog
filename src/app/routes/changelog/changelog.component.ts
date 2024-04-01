import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { extractFbData } from '../../firebase';
import { DatePipe } from '@angular/common';

interface Changelog {
  version: `${number}.${number}.${number}`;
  date: { seconds: number; nanoseconds: number };
  changes: string[];
  techChanges: string[];
}

@Component({
  selector: 'changelog',
  imports: [DatePipe],
  standalone: true,
  template: `
    @if (changelog()) {
      @for (release of changelog(); track release.version) {
        <div>
          <div class="changelog__version">
            <h2>{{ release.version }}</h2>
            <small>{{ release.date.seconds * 1000 | date: 'yyyy-MM-dd MM:ss' }}</small>
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
})
export class ChangelogComponent {
  changelog = toSignal(extractFbData<Changelog>('changelog', { orderBy: 'date', limit: 12 }));
}

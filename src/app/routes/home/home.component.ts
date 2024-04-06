import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { GavCardLink, GavCardLinkComponent } from '../../components/card-link/card-link.component';
import { RouterLink } from '@angular/router';
import { CARDS_CONFIG } from './home.config';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    GavCardLinkComponent,
  ],
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  cardsConfig: (GavCardLink & { id: string })[] = CARDS_CONFIG;

  constructor(meta: Meta) {
    meta.updateTag({ name: 'title', content: 'About Francisco Santorelli. Gavaar\'s random writings' });
    meta.updateTag({ name: 'description', content: 'Francisco Santorelli. Web developer with a psychologist background, writing random stuff. Gavaar\'s random writings' });
  }
}

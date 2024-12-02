import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { GavCardLinkComponent } from '@app/components/card-link';
import { RouterLink } from '@angular/router';
import { CardConfig, CARDS_CONFIG, EXTERNAL_CONFIG, HIDDEN_CONFIG } from './home.config';

interface CardsConfig {
  original: CardConfig[];
  external: CardConfig[];
  hidden: CardConfig[];
}

@Component({
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
  cardsConfig: CardsConfig = {
    original: CARDS_CONFIG,
    external: EXTERNAL_CONFIG,
    hidden: HIDDEN_CONFIG,
  };

  constructor(meta: Meta) {
    meta.updateTag({ name: 'description', content: 'Multi-purpose app for writings, tracking, and other stuff' });
  }
}

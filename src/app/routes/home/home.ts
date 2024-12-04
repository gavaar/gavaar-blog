import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { GavCard } from '@app/components/gav-card';
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
    GavCard,
  ],
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  cardsConfig: CardsConfig = {
    original: CARDS_CONFIG,
    external: EXTERNAL_CONFIG,
    hidden: HIDDEN_CONFIG,
  };

  constructor(meta: Meta) {
    meta.updateTag({ name: 'description', content: 'Multi-purpose app for writings, tracking, and other stuff' });
  }
}

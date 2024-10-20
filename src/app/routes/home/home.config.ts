import { GavCardLink } from '@app/components/card-link';
import { BLOG_DATA, EXTERNAL_DATA, HIDDEN_DATA } from '../config';

export type CardConfig = (GavCardLink & { id: string });

export const CARDS_CONFIG: CardConfig[] = BLOG_DATA.map(data => {
  return {
    id: data.path!,
    backgroundImgUrl: data.bg || '',
    text: data.title,
  };
});

export const EXTERNAL_CONFIG: CardConfig[] = EXTERNAL_DATA.map(data => {
  return {
    id: data.path!,
    backgroundImgUrl: data.bg || '',
    text: data.title,
  };
});

export const HIDDEN_CONFIG: CardConfig[] = HIDDEN_DATA.map(data => {
  return {
    id: data.path!,
    backgroundImgUrl: data.bg || '',
    text: data.title,
  }
});

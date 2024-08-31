import { BLOG_DATA, EXTERNAL_DATA } from '@app/app.routes';
import { GavCardLink } from '@app/components/card-link';

export type CardConfig = (GavCardLink & { id: string });

export const CARDS_CONFIG: CardConfig[] = Object.values(BLOG_DATA).map(data => {
  return {
    id: data.routerLink!,
    backgroundImgUrl: data.bg,
    text: data.title,
  };
});

export const EXTERNAL_CONFIG: CardConfig[] = Object.values(EXTERNAL_DATA).map(data => {
  return {
    id: data.routerLink!,
    backgroundImgUrl: data.bg,
    text: data.title,
  };
});

import { BLOG_POST_ROUTES, EXTERNAL_ROUTES } from '@app/app.routes';
import { GavCardLink } from '@app/components/card-link';

export type CardConfig = (GavCardLink & { id: string });

export const CARDS_CONFIG: CardConfig[] = BLOG_POST_ROUTES.map(route => {
  return {
    id: route.path!,
    backgroundImgUrl: route.data?.['bgImg'],
    text: route.data?.['title'].split(' ')[0],
  };
});

export const EXTERNAL_CONFIG: CardConfig[] = EXTERNAL_ROUTES.map(route => {
  return {
    id: route.path!,
    backgroundImgUrl: route.data?.['bgImg'],
    text: route.data?.['title'].split(' ')[0],
  }
});

import { BLOG_POST_ROUTES } from '../../app.routes';
import { GavCardLink } from '../../components/card-link/card-link.component';

export const CARDS_CONFIG: (GavCardLink & { id: string })[] = BLOG_POST_ROUTES.map(route => {
  return {
    id: route.path!,
    backgroundImgUrl: route.data?.['bgImg'],
    text: route.data?.['title'].split(' ')[0],
  };
});

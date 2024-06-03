import { GavCardLink } from '../../components/card-link/card-link.component';

export const CARDS_CONFIG: (GavCardLink & { id: string })[] = [
  { id: 'car', backgroundImgUrl: 'career.jpg', text: 'Career' },
  { id: 'dev', backgroundImgUrl: 'development.jpg', text: 'Development' },
  { id: 'g', backgroundImgUrl: 'gaming.jpg', text: 'Games' },
  { id: 'p', backgroundImgUrl: 'psychology.jpg', text: 'Psychology' },
  { id: 's', backgroundImgUrl: 'selfcare.jpg', text: 'Self-care' },
];

import { Timestamp } from 'firebase/firestore/lite';

export interface BlogPost {
  id: string;
  category: string;
  assetURI: string;
  content: string;
  date: Timestamp;
  description: string;
  title: string;
  updated: Timestamp;
  views: number;
}

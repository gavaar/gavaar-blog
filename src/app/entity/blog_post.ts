import { InjectionToken } from '@angular/core';
import { Timestamp } from 'firebase/firestore/lite';

export const POST_CATEGORY = new InjectionToken<string>('post_category', { providedIn: 'root', factory: () => 'default' });

export interface BlogPost {
  id: string;
  category: string;
  assetURI: string;
  content: string;
  date: Timestamp;
  description: string;
  title: string;
  updated: Timestamp;
}

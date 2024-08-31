import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GavSidenavApi {
  open = signal<boolean>(false);
}

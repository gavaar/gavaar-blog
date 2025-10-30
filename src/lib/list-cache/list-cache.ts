import { computed, signal } from '@angular/core';
import { Observable } from 'rxjs';

export class GavListCache<T> {
  private listMap = signal<{ [id: string]: T }>({});

  list = computed(() => Object.values(this.listMap()));

  constructor(initializer: Observable<{ [id: string]: T }>) {
    initializer.subscribe(listMap => this.listMap.set(listMap));
  }

  get = (id: string): T | undefined => this.listMap()[id];
  put = (entity: T & { id: string }): void => this.listMap.update(list => ({ ...list, [entity.id]: entity }));
  delete = (id: string): T | undefined => {
    const entity = this.listMap()[id];
    if (entity) {
      const list = this.listMap();
      delete list[id];
      this.listMap.set(list);
      return entity;
    }

    return;
  };
}

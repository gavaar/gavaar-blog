import { computed, signal } from '@angular/core';
import { Observable } from 'rxjs';

export class GavListCache<T> {
  listMap = signal<{ [id: string]: T }>({});

  keys = computed(() => Object.keys(this.listMap()));
  list = computed(() => Object.values(this.listMap()));

  constructor(initializer: Observable<{ [id: string]: T }>) {
    initializer.subscribe(listMap => this.listMap.set(listMap));
  }

  get = (id?: string): T | undefined => id ? this.listMap()[id] : undefined;
  put = (entity: Partial<T> & { id: string }): void => {
    const list = this.listMap();
    const preUpdateEntity = list[entity.id] || {};
    const updatedEntity = { ...preUpdateEntity, ...entity } as T;
    list[entity.id] = updatedEntity;
    this.listMap.set({ ...list });
  }
  delete = (id: string): T | undefined => {
    const entity = this.listMap()[id];
    if (entity) {
      const list = this.listMap();
      delete list[id];
      this.listMap.set({ ...list });
      return entity;
    }

    return;
  };

  delete_substr(matcher: string): void {
    for (const id of this.keys()) {
      if (id.includes(matcher)) this.delete(id);
    }
  }
}

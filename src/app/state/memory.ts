import { signal, WritableSignal } from '@angular/core';
import { Memory, MemoryTypes } from './models';
import { getStorage, patchStorage, setStorage } from './local-storage.manager';

class MemoryService {
  private memory: { [T in keyof MemoryTypes]: WritableSignal<MemoryTypes[T]> } = {
    [Memory.Views]: signal(getStorage(Memory.Views)),
    [Memory.Config]: signal(getStorage(Memory.Config)),
    [Memory.HiddenRoutes]: signal(getStorage(Memory.HiddenRoutes)),
  };
  
  get<T extends Memory>(key: T): MemoryTypes[T] {
    return this.memory[key]();
  }

  set<T extends Memory>(key: T, value: MemoryTypes[T]): void {
    setStorage(key, value);
    this.memory[key].set(value);
  }

  patch<T extends Memory>(key: T, value: Partial<MemoryTypes[T]>): void {
    this.memory[key].set(patchStorage(key, value));
  }
  
  watch<T extends Memory>(key: T): WritableSignal<MemoryTypes[T]> {
    return this.memory[key];
  }
}

export const memory = new MemoryService();

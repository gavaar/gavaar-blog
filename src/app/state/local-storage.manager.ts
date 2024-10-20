import { Memory, MemoryTypes } from './models';

export const getStorage = <T extends Memory>(key: T): MemoryTypes[T] => {
  return JSON.parse(localStorage.getItem(key) || '{}');
};
export const patchStorage = <T extends Memory>(key: T, value: Partial<MemoryTypes[T]>): MemoryTypes[T] => {
  const mergedValue = { ...getStorage(key), ...value };
  localStorage.setItem(key, JSON.stringify(mergedValue));
  return mergedValue;
}
export const setStorage = <T extends Memory>(key: T, value: MemoryTypes[T]): void => {
  return localStorage.setItem(key, JSON.stringify(value));
}

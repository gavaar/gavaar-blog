export interface Changelog {
  version: `${number}.${number}.${number}`;
  date: { seconds: number; nanoseconds: number };
  changes: string[];
  techChanges: string[];
}

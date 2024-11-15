export enum Memory {
  Views = 'viewed',
  Config = 'config',
  HiddenRoutes = 'hiddenRoutes',
}

export interface MemoryTypes {
  [Memory.Views]: { [uri: string]: boolean };
  [Memory.Config]: {
    theme: 'light' | '';
    sidenavOpen: boolean;
  };
  [Memory.HiddenRoutes]: {
    rand: boolean;
    cook: boolean;
    beta: boolean;
  };
}

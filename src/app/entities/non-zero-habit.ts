interface NonZeroStats {
  done: number;
  doneWeighted: number;
  totalDays: number;
}

export interface NonZeroHabit {
  id: string;
  icon: string;
  title: string;
  description?: string;
  avgYear?: { [year: number]: NonZeroStats };
  avgMonths?: { [yearMonth: `${number}-${number}`]: NonZeroStats };
}

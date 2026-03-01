export type NonZeroDateString = `${number}-${number}-${number}`;
const DATE_HOUR_OFFSET = -6;
export class HabitUtils {
  static dateWithOffset({ year, month, date }: { year?: number; month?: number; date?: number } = {}): Date {
    const today = new Date();
    year ||= today.getFullYear();
    month ||= today.getMonth();
    date ||= today.getDate();

    return new Date(year, month, date, today.getHours() + DATE_HOUR_OFFSET);
  }

  static today(): NonZeroDateString {
    return this.dateToNonZero(this.dateWithOffset());
  }

  static yesterday(): NonZeroDateString {
    return this.dateToNonZero(this.xDaysAgo(1));
  }

  static nonZeroToDate(nzd: NonZeroDateString): Date {
    const [y,m,d] = nzd.split('-');
    return new Date(+y,+m,+d);
  }

  static dateToNonZero(date: Date): NonZeroDateString {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  static xDaysAgo(x: number): Date {
    const today = this.dateWithOffset();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - x);
  }

  static dateIsOlderThan(date: NonZeroDateString, pivot: NonZeroDateString): boolean {
    const [dateY, dateM, dateD] = date.split('-');
    const [pivotY, pivotM, pivotD] = pivot.split('-');

    return +pivotY >= +dateY &&
           +pivotM >= +dateM &&
           +pivotD >= +dateD;
  }
}

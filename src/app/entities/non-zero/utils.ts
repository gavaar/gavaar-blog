export type NonZeroDateString = `${number}-${number}-${number}`;

export class HabitUtils {
  static today(): NonZeroDateString {
    return this.dateToNonZero(new Date());
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
    const today = new Date();
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

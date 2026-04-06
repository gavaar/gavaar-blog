import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { HabitClient } from '@app/clients/non-zero/habit';
import { DayTracker, HabitCard, HabitEditCard } from './components';
import { SelectedDayState } from './state/selected-day.state';
import { GavLoading } from "@app/components";
import { GavRequireAuth } from '@app/directives';
import { HabitUtils } from '@app/entities/non-zero';
import { fromEvent, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'non-zero',
  templateUrl: './non-zero.html',
  styleUrl: './non-zero.scss',
  imports: [HabitCard, DayTracker, HabitEditCard, GavLoading, GavRequireAuth],
  providers: [SelectedDayState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonZero implements OnInit {
  private habitClient = inject(HabitClient);
  protected loading = computed(() => !this.habitClient.initialized());
  protected selectedDayService = inject(SelectedDayState);
  protected habits = this.habitClient.habits.list;
  protected editing: { [habitId: string]: boolean } = {};

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshHabits());
  }

  private refreshHabits(): void {
    if (this.selectedDayService.today !== HabitUtils.today()) {
      this.habitClient.forceReinitialization();
      this.selectedDayService.today = HabitUtils.today();
    }
  }
}

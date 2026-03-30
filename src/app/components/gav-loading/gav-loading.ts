import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'gav-loading',
    template: `<img class="gav-loading__image" src="assets/images/loading/dancing.gif" alt="loading rolling abitoad" />`,
    styleUrl: './gav-loading.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavLoading {}

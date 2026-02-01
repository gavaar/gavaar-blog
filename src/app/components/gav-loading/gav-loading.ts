import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'gav-loading',
    template: `<img class="gav-loading__image" src="assets/images/loading/dancing.gif" alt="loading rolling abitoad" />`,
    styles: [`
        gav-loading {
            display: contents;
        }
        .gav-loading__image {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            border-radius: 50%;
            box-shadow: 0 0 1rem var(--primary);
        }
    `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GavLoading {}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'bgImgUrl',
})
export class BgImgUrlPipe implements PipeTransform {
  transform(bgImgUrl: string, appendUrl = false): string {
    const url = bgImgUrl.startsWith('https://') ? bgImgUrl : `assets/images/${bgImgUrl}`;
    return appendUrl ? this.appendUrl(url) : url;
  }

  private appendUrl(value: string): string {
    return `url(${value})`;
  }
}

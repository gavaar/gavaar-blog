import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bgImgUrl' })
export class BgImgUrlPipe implements PipeTransform {
  transform(bgImgUrl: string, appendUrl = false): string {
    const url = bgImgUrl.startsWith('https://') ? bgImgUrl : `assets/images/${bgImgUrl}`;
    return appendUrl ? this.appendUrl(url) : url;
  }

  private appendUrl(value: string): string {
    return `url(${value})`;
  }
}

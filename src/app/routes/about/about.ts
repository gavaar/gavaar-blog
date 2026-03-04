import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ViewsTracker } from '@app/clients/views-tracker';
import { GavRichText } from '@lib/components';

const ABOUT_ME = `
I'm a Web Developer that believes the best code is written by humans.

Studied Psychology with an emphasis on Behavioral Analysis, and a dissertation on Consumer Psychology.

Transitioned to become a Developer in 2018 after moving to Spain. Learned through Codecademy and Coursera.

*I'm thankful to everyone that has tutored me along the way in both disciplines, as I would not be here without them.*

I believe to bridge the gap between Front-End development and User Experience by mixing my knowledge in Web Development and Behavioral Sciences.
I have a growing interest in the Rust ecosystem and it's applications.
Personal projects are mainly built with Rust / Typescript.

I like challenging myself and learning. Teaching is a way of learning and staying up to date.`;

@Component({
  selector: 'about',
  imports: [GavRichText],
  template: `
    <h1>About me</h1>
    <gav-rich-text [content]="aboutMe" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  aboutMe = ABOUT_ME;

  constructor(meta: Meta, viewService: ViewsTracker) {
    viewService.increaseViews('pages', 'about');
    meta.updateTag({ name: 'title', content: 'Gavaar | About me' });
    meta.updateTag({ name: 'description', content: 'Gavaar | Who am I' });
  }
}

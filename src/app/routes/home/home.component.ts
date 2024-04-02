import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'home',
  standalone: true,
  template: `
    <h1>Francisco Santorelli</h1>
    <p>
      I'm a web developer specialized in Front-End whom particularly enjoys working with Angular (Stockholm's Syndrome?).
      I have fun learning about everything that catches my curiosity, and a few of that will be put in here.
    </p>
    <p>
      I studied Psychology in the UCV (Venezuelan Central University -<i>translated from spanish</i>, best uni in the world btw) with a specialization in Behavioral Sciences.
      I find behavioral sciences to be very useful in day to day life. I also think it's a very fun topic to learn about.
      To oversimplify it: you learn how people gets programmed into their habits and misbehaviors.
    </p>
    <p>
      Nonetheless, that degree is useless.
    </p>
    <p>
      I looked into ratifying the degree in Spain, and I found out it was a big effort, plus I did not really like working as Psychologist.
      So I had to choose between investing time, money and effort into a career that I loved but didn't see myself working in,
      or.. not do that at all. And I did the latter. Fuck degrees, fuck college.
    </p>
    <p>
      I did find joy in solving puzzles and crashing my head against problems, so I decided to try to learn Javascript. I sucked at it. I probably still suck to be honest.
      Anyways, it now became my career. And now we're here.
    </p>
  `,
  styles: [
    `
      p:last-child {
        margin-bottom: 0;
      }
    `
  ],
})
export class HomeComponent {
  constructor(meta: Meta) {
    meta.updateTag({ name: 'title', content: 'About Francisco Santorelli. Gavaar\'s random writings' });
    meta.updateTag({ name: 'description', content: 'Francisco Santorelli. Web developer with a psychologist background, writing random stuff. Gavaar\'s random writings' });
  }
}

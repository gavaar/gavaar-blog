import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'home',
  standalone: true,
  template: `
    <h1>Francisco Santorelli</h1>
    <p>
      I'm a web developer specialized in Front-End whom particularly enjoys working with Angular (Stockholm's Syndrome?).
      I think of myself as a nerd (idk if that's a good thing). I attempt to understand and investigate about everything that catches my curiosity, and a few of that will be put in here.
    </p>
    <p>
      I studied Psychology in the UCV (Venezuelan Central University -<i>translated from spanish</i>) with a specialization in Behavioral Sciences. Did not do much with that though.
      I looked into ratifying my title in Spain. I found out it was a big effort, plus I did not really like the jobs that a Psychologist could do. So I decided that
      instead of doing that... I was going to... not do it (?).
    </p>
    <p>
      I did find joy in crashing my head against random problems, and the puzzles behind writing code. This eventually transformed into my career, and here we are.
    </p>
  `,
  styles: [
    `
      :host {
        padding: 0.5rem;

        p:last-child {
          margin-bottom: 0;
        }
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

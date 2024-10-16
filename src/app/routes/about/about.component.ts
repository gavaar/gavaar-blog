import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h1>About me</h1>
    <p>
      I'm a web developer who has mostly worked in Front-End (but do find joy in things like Rust).
      I have fun learning about things that catch my curiosity, and some of that will be put in this site.
    </p>

    <h3>My background</h3>
    <p>
      I studied Psychology at UCV (Venezuelan Central University -<i>translated from spanish</i>, best uni in the world btw) with a specialization in Behavioral Sciences.
      In a nutshell: you learn how people gets programmed into their habits and misbehaviors.
    </p>
    <p>
      Nonetheless, that degree (note: the degree and NOT the knowledge) is now useless to me.
    </p>
    <p>
      I moved into Spain and looked into ratifying said degree. I learned it was a very big effort and money enterprise, plus I did not really enjoy the job of a Clinical Psychologist back when I did it (nothing against it, it's just not for me).
    </p>
    <p>
      So I had to choose between investing time, money and effort into a career which I loved but didn't enjoy working in or..
    </p>
    <p>
      ...not do that at all. And I did the latter. Fuck my degree.
    </p>
    <p>
      I did find joy in solving puzzles and crashing my head against problems, so I decided to go and learn HTML, CSS & Javascript.
      <br />
      I sucked at it. I probably still suck to be honest.
      But it became my career. And now we're here. In my self-made bloggy-kinda site.
    </p>
    <p>
      I plan to use this site to write my thoughts down, create tools for my day to day life, etc.
      <br />
      It's my thoughts-dump, feel free to poke around.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}

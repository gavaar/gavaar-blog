import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ViewsService } from '@app/services/views.service';

@Component({
  standalone: true,
  selector: 'about',
  template: `
    <h1>About me</h1>
    <p>
      I'm a web developer with a passion for learning, who has mostly worked with Front-End (but do find joy in lower-level things such as Rust).
      <br />
      I thrive on curiosity and exploring new ideas and some of that will be put in this site.
    </p>

    <h3>My background</h3>
    <p>
      I studied Psychology at UCV (Universidad Central de Venezuela, which by the way is the best university in the world<sup>[1]</sup>).
      <br />
      I graduated with a specialization in Behavioral Sciences and disertation in Consumer Psychology.
      <br />
      Very fun stuff.
      <br />
      I'd summarize that knowledge into: <i>how people gets programmed into their habits and misbehaviors</i>.
    </p>
    <p>
      Nonetheless, that degree (emphasis: the degree. NOT the knowledge) is now useless to me.
    </p>
    <p>
      I moved into Spain and looked into ratifying said degree.
      <br />
      I quickly discovered it was a daunting and expensive goal.
      <br />
      Plus I did not really find joy in the role of a Clinical Psychologist — nothing against it, it just wasn't for me.
    </p>
    <p>
      So I had to choose between investing time, money and effort into a career which I loved but didn't find fulfilling or...
      <br />
      not do that at all and improvise. And I did the latter. Fuck my degree.
    </p>
    <p>
      I knew I could enjoy the development world so I decided to go and learn HTML, CSS & Javascript.
      <br />
      At first I sucked at it and got very frustrated.
      <br />
      Now I don't get frustrated.
      <br />
      Eventually this became my career, and am currently working as a Front-End Developer.
      <br />
      I ended up creating my self-made bloggy-kinda site (this) with that as well, which is nice.
    </p>
    <p>
      I plan to use this site to write my thoughts down, create tools for my day to day life, etc.
      <br />
      It'll be my brain-dump, feel free to poke around.
    </p>

    <small>[1] source: my biased opinion</small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  constructor(meta: Meta, viewService: ViewsService) {
    viewService.increaseViews('pages', 'about').subscribe();
    meta.updateTag({ name: 'title', content: 'Gavaar | About me' });
    meta.updateTag({ name: 'description', content: 'Gavaar | Who am I' });
  }
}

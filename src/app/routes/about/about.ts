import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ViewsTracker } from '@app/clients/views-tracker';

@Component({
  selector: 'about',
  template: `
    <h1>About me</h1>
    <p>
      I'm a web developer that enjoys learning.
      <br />
      The objective of this site is just a dump for some stuff that I'd rather not write on a piece of paper.
      <br />
      <small>Especially since I'm a web developer, I should know how to avoid writing on paper</small>
    </p>

    <h4>Some background</h4>
    <p style="margin-top: 0">
      I studied Psychology at UCV (Universidad Central de Venezuela, one of the best universities in the world<sup style="opacity: 0.75">[1]</sup>).
      <br />
      Graduated with a specialization in Behavioral Sciences with a disertation in Consumer Psychology.
      <br />
      <i>Very fun stuff.</i>
    </p>
    <p>
      Nonetheless, that degree (emphasis in <em>the degree</em>) is now useless to me.
    </p>
    <p>
      When I moved to Spain I looked into ratifying that degree.
      <br />
      I quickly discovered it was a multi-year, study-required and expensive goal.
      <br />
      In addition I did not find joy in the role of the Clinical Psychologist — nothing against it, it just wasn't for me.
    </p>
    <p>
      So my choices were between investing time, money and effort into that career that I was not eager to pursue
      <br />
      and not doing that at all without a plan whatsoever. So of course I did the latter.
      <br />
      <small>Fuck that college degree.</small>
    </p>
    <p>
      I ended up trying to learn HTML, CSS & Javascript.
      <br />
      At first I sucked at it and got very frustrated.
      <br />
      Now I know <em>how worse</em> I used to suck (I still do though a lil less), but don't get frustrated anymore.
      <br />
      Eventually I followed this career, and am currently trying to figure out how to properly adult.
    </p>
    <p>
      And that's how I'm here. Can't believe you read all that though.
    </p>

    <small>[1] A biased opinion</small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  constructor(meta: Meta, viewService: ViewsTracker) {
    viewService.increaseViews('pages', 'about').subscribe();
    meta.updateTag({ name: 'title', content: 'Gavaar | About me' });
    meta.updateTag({ name: 'description', content: 'Gavaar | Who am I' });
  }
}

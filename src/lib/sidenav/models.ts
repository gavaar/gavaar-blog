import { computed, signal } from '@angular/core';
import { GavIcon } from '@lib/icon';

type GavNavItemInput = { title: string; bg?: string; } & ({ portrait: string; icon?: never } | { portrait?: never; icon: GavIcon }) & ({ routerLink: string; click?: never } | { routerLink?: never; click: () => any });
export class GavNavItem {
  title: string;
  bg?: string;
  portrait?: string;
  routerLink?: string;
  icon?: GavIcon;

  constructor(opts: GavNavItemInput) {
    this.title = opts.title;
    this.bg = opts.bg;
    this.portrait = opts.portrait;
    this.routerLink = opts.routerLink;
    this.icon = opts.icon;
    this.click = opts.click || (() => null);
  }

  click: () => any;
}

type GavNavCategoryInput = { title?: string; icon?: GavIcon; items: GavNavItem[] };
export class GavNavCategory {
  title?: string;
  icon?: GavIcon;

  open = signal(true);

  items = computed(() => {
    const open = this.open();
    const items = this._items();

    return open ? items : [];
  });

  private _items = signal<GavNavItem[]>([]);

  constructor(opts: GavNavCategoryInput) {
    this.icon = opts.icon;
    this.title = opts.title;
    this._items.set(opts.items);
  }

  click = () => this.open.set(!this.open());
}

export class GavNavUncategorized extends GavNavCategory {
  constructor(opts: Pick<GavNavCategoryInput, 'items'>) {
    super({ items: opts.items })
  }
}
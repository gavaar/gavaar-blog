import { computed, Signal, signal } from '@angular/core';
import { Icon } from '@lib/components';

export type GavNavItemInput = {
  title: string;
  bg?: string;
  portrait?: string;
  icon?: Icon;
  hide?: Signal<boolean>;
} & 
({ path: string; click?: never } | { path?: never; click: () => any });
export class GavNavItem {
  title: string;
  bg?: string;
  portrait?: string;
  path?: string;
  icon?: Icon;
  hide?: Signal<boolean>;

  constructor(opts: GavNavItemInput) {
    this.title = opts.title;
    this.bg = opts.bg;
    this.portrait = opts.portrait;
    this.path = opts.path;
    this.icon = opts.icon;
    this.hide = opts.hide;
    this.click = opts.click || (() => null);
  }

  click: () => any;
}

type GavNavCategoryInput = {
  title?: string;
  icon?: Icon;
  items: GavNavItem[];
};
export class GavNavCategory {
  title?: string;
  icon?: Icon;
  hide = computed(() => {
    const allChildrenHidden = this._items().every(item => item.hide?.());
    return allChildrenHidden;
  });

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

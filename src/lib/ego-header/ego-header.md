# GavEgoHeaderComponent
Component
```typescript
import { GavEgoHeaderComponent } from '@lib/ego-header';
```

Template
```html
<gav-ego-header
  profileImgUrl="assets/me.jpg"
  backgroundImgUrl="assets/default_background.png"
  homeRoute="/home">

  <button class="gav-ego-header-left">
    I'm a button that will show on the left side of the header
  </button>
  <button class="gav-ego-header-right">
    I'm a button that will show on the right side of the header
  </button>

</gav-ego-header>
```

## Inputs
**profileImgUrl**: the profile image for the header (the one in the middle).
  - does not default to anything. it is **required**.

**backgroundImgUrl**: the backgroundUrl for the header.
  - does not default to anything. it is **required**.

**homeRoute**: the route to which clicking the image will route to. Default: `/`.

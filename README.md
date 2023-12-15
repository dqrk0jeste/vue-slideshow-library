# vue-slideshow-library

Simple component library for implementing slideshow-like pages in your web app. 

## Setup and usage

- Installing the package
```sh
npm install vue-slideshow-library
```

- Importing it in your project

```sh
import { Slideshow } from vue-slideshow-library
```
- Using it in a template

```sh
<Slideshow
    @scroll="(count) => console.log(count)"
    :slides="[<Slide>]"
    :background-color-transition-duration-in-miliseconds="<number>"
    :background-color-transition-mode="<mode or bezier curve>"
```

where Slide is

```sh
type Slide = {
  component: DefineComponent,
  props?: Object,
  backgroundColor?: string,
  transitionName?: string
}
```

## Other

- Component also provides a `scroll` emit every time a new slide is displayed, so you can use it to sync with some other featues of your app.
- Slides can be scrolled by mouse wheel, touch nad arrow keys.

## Contributing

- You can clone this repo and work on it if you want to make it better :).


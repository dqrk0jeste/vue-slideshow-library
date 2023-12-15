<script setup lang="ts">
import { ref, watch, computed, type Ref, type DefineComponent } from 'vue'
import { useElementBounding, useEventListener } from '@vueuse/core'

type Slide = {
  component: DefineComponent,
  props?: Object,
  backgroundColor?: string,
  transitionName?: string
}

const props = defineProps({
  slides: {
    type: Array<Slide>,
    required: true
  },
  backgroundColorTransitionDurationInMiliseconds: {
    type: Number,
    required: false,
    default: 500
  },
  backgroundColorTransitionMode: {
    type: String,
    required: false,
    default: 'ease'
  }
})

const slideshow: Ref<HTMLDivElement | null> = ref(null)
const scrollCount: Ref<number> = ref(0)

const { top } = useElementBounding(slideshow)

const firstElement = computed(() => scrollCount.value === 0)
const lastElement = computed(() => scrollCount.value === props.slides.length - 1)
const prevToLastElement = computed(() => scrollCount.value === props.slides.length - 2)
const nextToFirstElement = computed(() => scrollCount.value === 1)

let scrolledToLastElement = false
let scrolledToFirstElement = false

watch(top, () => {
  if(top.value <= 0 && (!lastElement.value || scrolledToLastElement)) {
    window.scrollTo(0, slideshow.value!.offsetTop)
  } else if(top.value >= 0 && (!firstElement.value || scrolledToFirstElement)) {
    window.scrollTo(0, slideshow.value!.offsetTop)
  }
})

const active = computed(() => top.value === 0)

let allowedScroll = true
let touchstart = 0
let touchend = 0

useEventListener(slideshow, 'wheel', (e: any) : void => {
  if(!allowedScroll || !active.value) return;
  if(e.wheelDeltaY < 0) {
    if(lastElement.value) return;
    if(prevToLastElement.value) {
      scrolledToLastElement = true
      setTimeout(() => {
        scrolledToLastElement = false
      }, 200)
    }
    scrollCount.value++
  } else {
    if(firstElement.value) return;
    if(nextToFirstElement.value) {
      scrolledToFirstElement = true
      setTimeout(() => {
        scrolledToFirstElement = false
      }, 200)
    }
    scrollCount.value--
  }
  allowedScroll = false
  setTimeout(() => {
    allowedScroll = true
  }, 200)
})

useEventListener(document, 'keydown', (e: KeyboardEvent) : void => {
  if(!allowedScroll || !active.value) return;
  if(e.key === 'ArrowDown') {
    if(lastElement.value) return;
    if(prevToLastElement.value) {
      scrolledToLastElement = true
      setTimeout(() => {
        scrolledToLastElement = false
      }, 200)
    }
    scrollCount.value++
  } else if(e.key === 'ArrowUp') {
    if(firstElement.value) return;
    if(nextToFirstElement.value) {
      scrolledToFirstElement = true
      setTimeout(() => {
        scrolledToFirstElement = false
      }, 200)
    }
    scrollCount.value--
  }
  allowedScroll = false
  setTimeout(() => {
    allowedScroll = true
  }, 200)
})

useEventListener(slideshow, 'touchstart', (e: TouchEvent): void => {
  if(!active.value) return;
  touchstart = e.changedTouches[0].screenY
})

useEventListener(slideshow, 'touchend', (e: TouchEvent): void => {
  if(!active.value) return
  touchend = e.changedTouches[0].screenY
  if(swipedDown()) {
    if(firstElement.value) return;
    if(nextToFirstElement.value) {
      scrolledToFirstElement = true
      setTimeout(() => {
        scrolledToFirstElement = false
      }, 200)
    }
    scrollCount.value--
  } else if(swipedUp()) {
    if(prevToLastElement.value) {
      scrolledToLastElement = true
      setTimeout(() => {
        scrolledToLastElement = false
      }, 200)
    }
    if(lastElement.value) return;
    scrollCount.value++
  }
})

function swipedUp() : boolean {
  const diff = touchend - touchstart
  return diff < - window.innerHeight / 10
}

function swipedDown() : boolean {
  const diff = touchend - touchstart
  return diff > window.innerHeight / 10
}

</script>

<template>
    <div ref="slideshow" class="slideshow" :style="{
      height: '100dvh',
      width: '100vw',
      zIndex: 0,
      backgroundColor: props.slides[scrollCount]?.backgroundColor || 'white',
      transition: `background-color ${ props.backgroundColorTransitionDurationInMiliseconds }ms ${ props.backgroundColorTransitionMode }`
    }">
      <Transition name="left" mode="out-in">
        <div :key="scrollCount">
          <component :is="props.slides[scrollCount].component" v-bind="props.slides[scrollCount].props"/>
        </div>
      </Transition>
  </div>
</template>
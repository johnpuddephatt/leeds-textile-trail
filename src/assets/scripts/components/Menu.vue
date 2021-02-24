<template>
  <nav ref="nav" class="nav">
    <div class="nav--inner">
      <div class="nav--entry" :class="selectedEntrySlug == story.slug ? 'selected' : ''" v-for="story in stories" :key="story.slug" :ref="`menu-${story.slug}`" @click="menuClicked(story.slug)" @keyup.enter="menuClicked(story.slug)">
          <div class="nav--entry--name" v-html="story.name"></div>
          <h3 class="nav--entry--title" v-html="story.title"></h3>
          <router-link v-if="story.active" :aria-label="`Read the story about ${ story.name }`" class="nav--entry--enter" tag="a" :to="{name: 'story', params: {slug: story.slug } }">
            View
          </router-link>
          <div class="nav--entry--soon" v-else>Coming soon</div>

          <p class="nav--entry--description">{{ story.teaser }}</p>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'Menu',
  props: ['stories', 'selectedEntrySlug', 'active'],
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
    selectedEntrySlug: function (slug) {
      let clickedMenuElement = this.$refs[`menu-${slug}`][0];
      if(clickedMenuElement) {
        this.$refs['nav'].scrollLeft = clickedMenuElement.offsetLeft - window.innerWidth/2 + clickedMenuElement.clientWidth/2;
      }
    }
  },
  methods: {
    menuClicked(selectedEntrySlug) {
      this.$emit('menu-clicked', selectedEntrySlug);
    },
  },
  mounted() {
    this.$refs['nav'].scrollLeft = this.$refs['nav'].firstElementChild.firstElementChild.offsetLeft;
  }
}
</script>

<style lang="scss">

@import '../../styles/base.scss';

$height: 1.5 * $spacing;

.nav {
  margin-top: -($height + $spacing);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  position: relative;
  z-index: 9999;

  &::after {
    content: '';
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    height: $spacing;
    background-color: white;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &--inner {
    padding-top: $spacing;
    display: flex;
    flex-direction: row;

    &::before,
    &::after {
      background-color: white;
      display: block;
      content: '';
      flex: 0 0 calc(50vw - 18em/2);
      transform: translateY($height);
    }
  }

  &--entry {
    transform: translateY($height);
    cursor: pointer;
    flex: 0 0 18em;
    width: 18em;
    transition: transform 0.25s;
    transform-origin: bottom center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #fff;
    border-right: 2px solid;
    border-image: linear-gradient(#e7abfa, #4f67f3, #de5bb5, #edb772, #dd5cb3) 30;
    padding: $spacing/2 $spacing $spacing;

    @include mq('small') {
      padding: $spacing/2 1.5 * $spacing $spacing;
    }

    &:first-child {
      border-left: 2px solid;
    }

    &--title {
      padding-right: $spacing/4;
      font-size: ms(1);
      color: $dark-gray;
      padding-top: $spacing/4;
      margin-bottom: auto;
      line-height: $line-height-tight;
    }

    &--name {
      color: $gray;

      transition: all 0.25s;
      font-size: ms(-1);
    }

    &--enter {
      display: block;
      top: 0;
      right: -$spacing/2;
      transform: translateY(0.45em);
      position: absolute;
      border-radius: 9999px;
      background-color: $brand-light-pink;
      color: $brand-blue;
      opacity: 0;
      text-align: center;
      padding: 0.25em 0.75em;
      transition: opacity 0.25s 0.25s, transform 0.25s 0.25s, background-color 0.25s;

      @include mq('small') {
        top: $spacing/4;
      }

      &:hover {
        background-color: $brand-pink;
      }
    }

    &--soon {
      font-size: ms(-1);
      display: block;
      top: $spacing/4;
      right: $spacing/2;
      padding: 0 $spacing/2;
      transform: translateY(0.45em);
      position: absolute;
      border-radius: 0.5em;
      background-color: $light-gray;
    }

    &--description {
      opacity: 0;
      transform: translateY(0.35em);
      transition: all 0.25s;
      font-size: ms(-1);
      line-height: $line-height-tight;
      margin-top: $spacing/2;
    }

    &::before {
      content: '';
      z-index: -1;
      position: absolute;
      top: -$spacing/2;
      bottom: 0;
      background-color: white;
      opacity: 0;
      border-left: 2px solid;
      border-right: 2px solid;
      border-image: linear-gradient(#e7abfa, #4f67f3, #de5bb5, #edb772, #dd5cb3) 30;
      box-shadow: $box-shadow;
      transition: all 0.25s;
      // left: -$spacing/2;
      left: -$spacing/2;
      right: -$spacing;

      @include mq('small') {
        left: -$spacing/2;
        right: -1.5 * $spacing;
      }
    }

    &.selected {
      z-index: 99;
      transform: scale(1.05) translateY(0);

      &::before {
        opacity: 1;
      }

      .nav--entry--button,
      .nav--entry--enter,
      p {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>
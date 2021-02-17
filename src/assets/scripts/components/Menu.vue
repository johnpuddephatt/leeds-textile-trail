<template>
  <nav ref="nav" class="nav">
    <div class="nav--inner">
      <div class="nav--entry" :class="selectedEntrySlug == story.slug ? 'selected' : ''" v-for="story in stories" :key="story.slug" :ref="`menu-${story.slug}`" @click="menuClicked(story.slug)" @keyup.enter="menuClicked(story.slug)">
          <h3 class="nav--entry--title" v-html="story.title"></h3>
          <div class="nav--entry--name" v-html="story.name"></div>
          <router-link class="nav--entry--button button" tag="a" :to="{name: 'story', params: {slug: story.slug} }">Open</router-link>
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

.nav {
  margin-top: -3.333 * $spacing;
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
      transform: translateY($spacing * 2.333);
    }
  }

  &--entry {
    transform: translateY($spacing * 2.333);
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
    border-right: 1px solid;
    border-image: linear-gradient(#e7abfa, #4f67f3, #de5bb5, #edb772, #dd5cb3) 30;
    padding: $spacing $spacing 0;

    @include mq('small') {
      padding: $spacing 1.5 * $spacing;
    }

    &:first-child {
      border-left: 1px solid;
    }

    &--title {
      font-size: ms(1);
      line-height: $line-height-tight;
    }

    &--name {
      color: $gray;
      opacity: 0;
      transform: translateY(0.35em);
      margin-top: auto;
      padding-top: $spacing/4;
      transition: all 0.25s;
    }

    &--button {
      margin-left: auto;
      margin-top: $spacing/2;
      opacity: 0;
      transform: translateY(0.35em);
      transition: all 0.25s;
    }

    &::before {
      content: '';
      z-index: -1;
      position: absolute;
      top: 0;
      bottom: 0;
      background-color: white;
      opacity: 0;
      border-left: 1px solid $new-gray;
      border-right: 1px solid $new-gray;
      border-image: linear-gradient(#e7abfa, #4f67f3, #de5bb5, #edb772, #dd5cb3) 30;
      box-shadow: $box-shadow;
      transition: all 0.25s;
      left: -$spacing/2;
      right: -$spacing/2;

      @include mq('small') {
        left: -$spacing;
        right: -$spacing;
      }
    }

    &.selected {
      z-index: 99;
      transform: scale(1.05) translateY(0);

      &::before {
        opacity: 1;
      }

      .nav--entry--name,
      .nav--entry--button {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>
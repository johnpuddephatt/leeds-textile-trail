<template>
    <div class="entry--outer">
      <div ref="inner" class="entry">
        <loading v-if="!entryLoaded"></loading>
        <div v-else class="container" v-click-outside="goHome">
          <router-link class="entry--back" :to="{ name: 'app'}">&larr; Back to map</router-link>
          <div class="entry--panel">
            <img v-if="!isImageLoaded && entry.image" src="/assets/images/placeholder.png" class="entry--image" width="1600" height="1179" />
            <transition name="fade" >
              <div v-show="isImageLoaded || !entry.image ">
                <img class="entry--image" width="1600" height="1179" :src="entry.image" @load="isImageLoaded = true" />
              </div>
            </transition>

            <h2 class="entry--title">{{ entry.title }}</h2>
            <p class="entry--name">{{ entry.name }}</p>
            <div class="entry--meta">
              <a target="_blank" :href="googleMapsLink" v-if="entry.location && entry.location_name" class="entry--address">{{ entry.location_name }}</a>
              <button @click="scrollToGallery" v-if="entry.photos && entry.photos.length">{{entry.photos.length}} photos</button>
            </div>

            <div class="entry--content" v-html="entry.content"></div>

            <gallery ref="gallery" id="photo-gallery" v-if="entry.photos && entry.photos.length" :photos="entry.photos"></gallery>

            <div class="entry--navigation">
              <router-link class="button entry--navigation--previous" v-if="entry.previous" aria-label="Read the previous story" tag="a" :to="{name: 'story', params: {slug: entry.previous } }">Previous story</router-link>
              <router-link class="button entry--navigation--next" v-if="entry.next" aria-label="Read the next story" tag="a" :to="{name: 'story', params: {slug: entry.next } }">Next story</router-link>
            </div>

          </div>
        </div>

      </div>
    </div>

</template>

<script>
import ClickOutside from 'vue-click-outside'
import Loading from './Loading.vue';
import Gallery from './Gallery.vue';

export default {
  name: 'Story',
  props: ['slug'],
  components: {
    Loading,
    Gallery
  },
  data() {
    return {
      entryLoaded: false,
      entry: {},
      errored: false,
      isImageLoaded: false,
      imageClass: null
    }
  },
  watch: {
    slug: function (slug) {
      this.isImageLoaded = false;
      this.entryLoaded = false;
      this.getEntry(slug)
    }
  },
  computed: {
    googleMapsLink: function() {
      return `https://www.google.com/maps/search/?api=1&query=${this.entry.location.coordinates[1]},${this.entry.location.coordinates[0]}`;
    }
  },
  methods: {
    getEntry(slug) {
      axios
        .get(`/api/story/${ slug }.json`)
        .then(response => {
          this.entry = response.data;
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => {
          setTimeout(()=>{
            this.entryLoaded = true;
            this.$refs.inner.scrollTop = 0;
          }, 500);

        })
    },
    goHome() {
      this.$router.push({name: 'app'});
    },
    scrollToGallery() {
      this.$refs.gallery.$el.scrollIntoView();
    }
  },
  mounted () {
    this.getEntry(this.slug);
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss">
@import '../../styles/base.scss';


.entry {
  position: absolute;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999999;
  background-color: white;
  width: 70vw;
  max-width: calc(#{map-get($breakpoints, 'small')} + #{$spacing}) ;

  @media screen and (orientation: portrait) {
    width: 100%;
  }

  &--outer {
    position: relative;
    background-color: rgba(15,25,70,0.7);
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    @media screen and (orientation: landscape) and (min-width: 800px) {
      padding: 0 $spacing;
    }
  }

  .container {
    position: relative;
    margin: 0 auto;
    padding: 2 * $spacing $spacing 0;
    @media screen and (orientation: landscape) and (min-width: 800px) {
      padding: 1px 4 * $spacing 0 6 * $spacing;
    }
  }


  &--name {
    font-family: Cooper;
    font-size: ms(2);
    margin-bottom: 0;

    @media screen and (orientation: portrait) {
      margin-top: $spacing;
    }

    &::before {
      content: '';
      height: 0.15rem;
      width: 24em;
      max-width: 80%;
      display: block;
      background-color: $brand-light-blue;
      border-radius: 9999px;
      margin-top: $spacing;
      margin-bottom: $spacing/2;
    }
  }

  &--meta {

  }

  &--title {
    font-size: ms(6);
    font-weight: 700;
    margin-bottom: 0;

    @include mq(small) {
      font-size: ms(8);
    }
  }

  &--image {
    margin: (-$spacing) (-1.5 * $spacing) (-$spacing/2);
    width: calc(100% + #{3 * $spacing});
    height: auto;
    max-width: none;

    @media screen and (orientation: portrait) {
      margin-bottom: $spacing/2;
    }
  }

  &--address {
    display: inline-block;

    &::before, &::after {
      vertical-align: bottom;
      content: '';
      display: inline-block;
      background-image: url(/assets/images/marker-icon-red.svg);
      width: 1em;
      height: 1.5em;
      margin-right: 0.25em;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &::after {
      vertical-align: sub;
      background-image: url(/assets/images/external_link.svg);
      width: 1em;
      height: 1.25em;
      margin-left: 0.25em;
    }
  }

  &--content {
    margin-top: $spacing;
    margin-bottom: 2 * $spacing;

    p {
      max-width: 34em;
    }

    blockquote {
      color: $brand-blue;
      font-weight: 700;
      font-style: italic;
      font-size: ms(1);

      p ~ p {
        font-style: normal;
        font-weight: 400;
        font-size: ms(0);
      }
    }
  }

  &--navigation {
    margin: $spacing 0;
    display: flex;
    flex-direction: row;
    max-width: 34em;

    &--next {
      margin-left: auto;
    }
  }

  &--back {
    position: absolute;
    top: $spacing;
    left: 4 * $spacing;
    color: $gray;
    display: inline-block;

    @media screen and (orientation: portrait) {
      margin-bottom: ms(0);
      left: $spacing;
    }
  }
}
</style>
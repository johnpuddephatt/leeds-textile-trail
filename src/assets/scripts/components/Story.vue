<template>
    <div class="entry-panel">
      <div class="entry-panel--inner">
        <loading v-if="!entryLoaded"></loading>
        <div v-else class="container" v-click-outside="goHome">
          <router-link class="back-link" :to="{ name: 'app'}">&larr; Back to map</router-link>
          <div class="panel">
            <img width="1600" height="1179" class="entry-image" :src="entry.image" />
            <h2 class="entry-title">{{ entry.title }}</h2>
            <button @click="scrollToGallery" v-if="entry.photos && entry.photos.length">{{entry.photos.length}} photos</button>
            <a target="_blank" :href="googleMapsLink" v-if="entry.location && entry.location_name" class="entry-address">{{ entry.location_name }}</a>
            <div class="entry-content" v-html="entry.content"></div>
            <gallery ref="gallery" id="photo-gallery" v-if="entry.photos && entry.photos.length" :photos="entry.photos"></gallery>
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
          }, 1000);

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

.entry-panel {
  position: relative;
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &--inner {
    position: absolute;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    max-width: map-get($breakpoints, 'small');
    z-index: 9999999;
    background-color: white;
  }

  // &::after {
  //   z-index: 1;
  //   background-color: rgba(0,0,0,0.5);
  //   position: fixed;
  //   z-index: 99999;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   content: '';
  // }


  @media screen and (orientation: landscape) and (min-width: 800px) {
    padding: 0 $spacing;
  }

  .container {
    position: relative;
    margin: 0 auto;
    padding: 0 $spacing;
    @media screen and (orientation: landscape) and (min-width: 800px) {
      padding: 0 2 * $spacing
    }
  }

  .panel {
  }

  .panel-heading {
    font-size: ms(2);
    font-weight: 700;
  }

  .entry-title {
    font-size: ms(3);
    @media screen and (orientation: landscape) and (min-width: 800px) {
      font-size: ms(5);
    }
    font-weight: 700;
    margin-bottom: 0;

    span {
      @media screen and (orientation: landscape) and (min-width: 800px) {
        display: inline-block;
        margin-right: ms(1);
      }
    }

    small {
      font-weight: 400;
      display: block;
      color: $gray;
      font-size: ms(2);
      vertical-align: baseline;
      @media screen and (orientation: landscape) and (min-width: 800px) {
        display: inline-block;
      }
    }
  }

  .entry-image {
      margin: 0 (-1.5 * $spacing) $spacing;
      width: calc(100% + #{3 * $spacing});
      height: auto;
      max-width: none;
  }

  .entry-address {
    display: inline-block;
    font-size: ms(0);
    margin-top: ms(-4);

    &::before, &::after {
      content: '';
      display: inline-block;
      background-image: url(/assets/images/marker-icon-red.svg);
      width: 0.75em;
      height: 1em;
      margin-right: .25em;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left bottom;
    }

    &::after {
      background-image: url(/assets/images/external_link.svg);
      margin-left: 0.25em;
    }
  }

  .entry-content {
    margin-top: 2 * $spacing;
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
}

.back-link {
  position: absolute;
  top: $spacing;
  left: 2 * $spacing;
  color: $gray;
  display: inline-block;

  @media screen and (orientation: portrait) {
    margin-bottom: ms(0);
  }
}
</style>
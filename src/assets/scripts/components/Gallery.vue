<template>
  <div class="gallery-wrapper" v-if="photos">
    <h3 class="gallery-title">Gallery</h3>
    <div class="gallery-scroller">
      <div class="gallery-item" v-for="(photo, key) in photos" @click="open = key">
        <img :src="photo.file"/>
      </div>
    </div>

    <transition name="slide">
      <div class="lightbox" v-if="open !== null" @click.stop="open = null" @keydown.esc="open = null" >
        <div class="lightbox-image">
          <img :src="photos[open].file"/>
        </div>

        <div class="lightbox-text">
          <div class="lightbox-text-inner">
            <div class="lightbox-info">

              <p>{{ photos[open].caption }}</p>
              <p v-if="photos[open].date"><strong>Date:</strong> {{ photos[open].date }}</p>
              <p v-if="photos[open].source"><strong>Source:</strong> {{ photos[open].source }}</p>
            </div>
          </div>
          <div class="lightbox-navigation">
            <button v-if="photos.length > 1" class="button previous" aria-label="Previous photo" :disabled="open == 0" @click.stop="open--">&larr;</button>
            <button v-if="photos.length > 1" class="button next" aria-label="Next photo" :disabled="open == (photos.length - 1)"  @click.stop="open++">&rarr;</button>
            <button class="button close" tabindex="1" @click="open = null">Close</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Gallery',
  props: ['photos'],
  components: {
  },
  data() {
    return {
      open: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
      document.addEventListener("keydown", (e) => {
        if(this.open){

          if (e.keyCode == 27) {
              this.open = null
          }

          if (e.keyCode == 37) {
            if(this.open > 0) {
              this.open--;
            }
          }

          if (e.keyCode == 39) {
            if(this.open < (this.photos.length - 1)) {
              this.open++;
            }
          }

        }
      });
  },
}
</script>

<style lang="scss">
@import '../../styles/base.scss';

.gallery-title {
  font-size: ms(3);
  margin-bottom: $spacing/2;
  margin-left: $spacing/2;
}

.gallery-wrapper {
  margin: 0 (-(ms(-2))) 2 * $spacing;

  &::after,
  &::before {
    content: "";
    pointer-events: none;
    position: absolute;
    display: block;
    left: -1px;
    top: 0;
    height: 100%;
    width: ms(0);
    @media screen and (orientation: landscape) and (min-width: 800px) {
      width: ms(2);
    }
    background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    z-index: 99;
  }

  &::after {
    left: auto;
    right: -1px;
    background: linear-gradient(270deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  }
}

.gallery-scroller {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  position: relative;
  cursor: grab;

  &.grabbing {
    cursor: grabbing;
  }
}

.gallery-scroller::-webkit-scrollbar {
  height: 0;
}

.gallery-item {
  position: relative;
  user-select: none;
  flex: 0 0 75%;
  overflow: hidden;
  border: solid ms(-2) transparent;
  background-clip: content-box;
  padding-top: 75%;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    flex: 0 0 30%;
    padding-top: 27%;
    border: solid ms(0) transparent;
  }

  &:hover img {
    opacity: 0.75;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
    max-width: none;
    max-height: none;
    transition: opacity 0.5s ease-in-out;
  }

  a {
    pointer-events: auto;
    cursor: pointer;
  }

  &.add {
    background-clip: padding-box;
    background-color: $light-blue;
    padding: ms(0);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

}


/* Unopened lightbox */
.lightbox {
  display: flex;
  position: fixed;
  z-index: 999999999;
  background-color: white;
  right: 0;
  top: 0;
  bottom: 0;
  width: 55vw;
  max-width: map-get($breakpoints, 'small');
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media screen and (orientation: portrait) {
    width: 100%;
  }
}

.lightbox-image {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    margin: auto;
    display: block;
  }
}

.lightbox-text {
  padding: ms(-2) 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
  padding: ms(0) 0 0;
}

.lightbox-text-inner {
  flex: 0 1 auto;
  overflow: auto;
  margin-top: auto;
  padding: 0 ms(2);
  @media screen and (orientation:portrait) {
    padding: 0 ms(0);
  }

  p {
    margin-bottom: ms(-4);
    &:first-child {
      margin-bottom: ms(1);
    }
    &:last-child {
      margin-bottom: ms(1);
    }
  }

}

/* Close button */

.lightbox-navigation {
  display: flex;
  gap: 12px;

  border-top: 1px solid $medium-gray;
  justify-content: space-between;
  padding: ms(-2) ms(0);
  @media screen and (orientation:portrait) {
    justify-content: flex-start;
    padding: ms(-2) ms(0);
  }

  .close {
    margin-left: auto;
  }
}
</style>
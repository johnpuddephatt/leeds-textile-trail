<template>
  <div v-if="stories.length" class="map-wrapper">
    <Map :stories="stories" @mouseover.native="active = 'map'" :active="active" :isLandscape="isLandscape()" :selectedEntrySlug="selectedEntrySlug" @marker-clicked="selectedEntrySlug = $event"></Map>
    <Menu :stories="stories" @mouseover.native="active = 'menu'" :active="active" :isLandscape="isLandscape()" :selectedEntrySlug="selectedEntrySlug" @menu-clicked="selectedEntrySlug = $event"></Menu>
    <transition name="slide-from-right" mode="out-in">
       <router-view></router-view>
     </transition>
   </div>
  <loading v-else></loading>
</template>

<script>
import Map from './Map.vue';
import Menu from './Menu.vue';
import Loading from './Loading.vue';

export default {
  name: 'Overview',
  props: [],
  components: {
    Map,
    Menu,
    Loading
  },
  data () {
    return {
      active: 'initial',
      stories: [],
      selectedEntrySlug: null,
      openedEntrySlug: null,
      errored: false,
      storiesLoaded: false,
      siteDataLoaded: false,
      site: {}
    }
  },
  watch: {
    openedEntrySlug: function(newSlug) {
      this.$router.push({ name: 'story', params: { slug: newSlug } })
    }
  },
  methods: {
    isLandscape() {
      return (document.documentElement.clientWidth > document.documentElement.clientHeight);
    }
  },
  mounted () {
    axios
      .get('/api/site.json')
      .then(response => {
        this.site = response.data
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.siteDataLoaded = true)

    axios
      .get('/api/stories.json')
      .then(response => {
        this.stories = response.data
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.storiesLoaded = true)
  }
}
</script>

<style lang="scss">
@import '../../styles/base.scss';

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 9999999999;
  background-color: rgba(255,255,255,0.95);
  padding: ms(8) ms(4);
  border-radius: ms(0);
  animation: popup 1s forwards;
  width: 100%;
  max-width: 680px;
  text-align: center;

  .dialog-inner {
    max-width: 400px;
    margin: 0 auto;
  }

  h3 {
    font-family: mikado;
    font-size: ms(6);
    font-weight: 900;
    font-style: italic;
    margin-bottom: ms(2);
  }

  .button {
    margin-top: ms(3);
  }
}

@keyframes popup {
  0% {
    transform: translate(-50%,-40%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%,-50%);
    opacity: 1;
  }
}

.dialog-wrapper {
  position: fixed;
  z-index: 9999999998;
  background-color: rgba(0,0,0,0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <l-map
    id="map"
    ref="map"
    :zoom="zoom"
    :center="center"
    :options="mapOptions"
    :inertia="true"
    :zoomAnimation="true"
    :noBlockingAnimations="true">
    <l-control-zoom position="topright" />
    <l-tile-layer :url="url" :attribution="attribution" />
    <l-tile-layer :url="url2" :attribution="attribution" />
    <l-control-attribution position="topleft" prefix="Website by Let’s Dance"></l-control-attribution>
    <v-icondefault :image-path="'/assets/images/'"></v-icondefault>
      <l-marker :ref="`marker-${story.slug}`" v-for="story in stories" :key="story.slug" :lat-lng="getLatLng(story)" @click="markerClicked(story.slug)" @keyup.enter="markerClicked(story.slug)" >
        <l-icon
          :iconSize="selectedEntrySlug == story.slug ? [53,80] : [35,53]"
          icon-url="/assets/images/marker-icon.svg"
        />
      </l-marker>
  </l-map>

</template>

<script>
import L from 'leaflet';
import { divIcon as DivIcon, point as Point } from "leaflet";
import { latLng } from "leaflet";
import { LIconDefault,LPopup, LIcon, LMap, LTileLayer, LMarker, LControlZoom, LControlAttribution } from 'vue2-leaflet';

export default {
  name: 'Map',
  props: ['stories', 'selectedEntrySlug', 'isLandscape'],
  components: {
    'v-icondefault': LIconDefault,
    LPopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LControlZoom,
    LControlAttribution
  },
  data () {
    return {
      zoom: 13,
      center: latLng(53.7988737,-1.59013),
      url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
      url2: 'https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png',
      

    	maxZoom: 16,
    	attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
      mapOptions: {
        scrollWheelZoom: window.self == window.top,
        zoomSnap: 0.5,
        zoomControl: false,
        attributionControl: false,
        zoomAnimationThreshold: 8,
      },
      showMap: true
    }
  },
  computed: {
  },
  watch: {

    $route (to, from) {
      if(to.name == 'app') {
        this.recenterMap();
      }
    },

    selectedEntrySlug: function (slug) {
      if(!this.mapActive) {
        this.$refs.map.mapObject.flyTo(this.$refs[ `marker-${slug}` ][0].latLng, this.maxZoom);
      }
    }
  },
  methods: {
    getLatLng(entry) {
      let latLngArray = [parseFloat(entry.location.coordinates[1]),parseFloat(entry.location.coordinates[0])];
      return latLngArray;
    },

    markerClicked(selectedEntrySlug) {
      this.$emit('marker-clicked', selectedEntrySlug);
    },

    recenterMap() {
      this.$refs.map.mapObject.flyTo(this.center, this.zoom);
    }
  }
}
</script>

<style lang="scss">
  @import '../../styles/base.scss';

  .leaflet-container {
    width: 100%;
    height: auto !important;
    flex: 1;
    border-bottom: $spacing solid white;
  }

  .leaflet-tile-pane {
    opacity: 0.75;
  }

  .leaflet-container :focus {
    outline: -webkit-focus-ring-color auto thin !important; /* Fallback for some browsers that don't support `revert`. */
    outline: revert !important;
  }


  .leaflet-marker-icon {
    &:focus {
      outline: 3px solid $brand-pink !important;
    }
  }

    // margin-top: -41px !important;
    // margin-left: -12.5px !important;
    // width: 25px !important;
    // height: 41px !important;
    //
    // &.large {
    //   width: 50px !important;
    //   height: 82px !important;
    //   margin-top: -82px !important;
    //   margin-left: -25px !important;
    // }

  .marker-cluster,
  .marker-cluster div {
    border-radius: 500px;
  }

  .marker-cluster.active {
    outline: 2px solid yellow;
  }

  .marker-cluster div {
    height: 30px;
    width: 30px;
    margin: 5px;
    text-align: center;
    line-height: 30px;
  }

  .my-marker-cluster-small div,
  .my-marker-cluster-medium div,
  .my-marker-cluster-large div {
    background-color: white;
  }

  .my-marker-cluster-small {
    background-color: lighten($brand-pink,5%);
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }

  .my-marker-cluster-medium {
    background-color: $brand-pink;
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }

  .my-marker-cluster-large {
    background-color: darken($brand-pink,10%);
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }



  // Popup
  // .leaflet-container a.leaflet-popup-close-button {

  // }

  .leaflet-popup-close-button {
    top: ms(0) !important;
    right: ms(0) !important;
    width: auto !important;
    height: auto !important;
    font: 30px/17px Tahoma, Verdana, sans-serif !important;
  }


  .leaflet-popup-content-wrapper {
      max-width: $sidebar-width;
      border: 1px solid $medium-gray;
      border-bottom: none;
      position: relative;
      width: 100vw;
      font-size: 1rem !important;
      padding: ms(0) ms(-2);
      // border-radius: 0 !important;
      box-shadow: 13px 19px 12px -7px rgba(0,0,0,0.2) !important;

      .popup--close {
        position: absolute;
        top: ms(0);
        line-height: 1;
        right: ms(0);
        font-size: ms(4);
        color: $gray;
      }

      .entry-title {
        text-transform: capitalize;
        font-size: ms(2);
        font-weight: 400;
        margin-bottom: ms(-1);
      }

      .entry-address {
        font-size: ms(-1);
        color: $gray;
        text-transform: capitalize;

        &::before {
          content: '';
          display: inline-block;
          background-image: url(/assets/images/marker-icon-red.svg);
          width: 0.75em;
          height: 1em;
          margin-right: .25em;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }
      }

      p {
        margin: 0 0 ms(0);
      }

      .entry-links {
        display: flex;
        flex-direction: row;

        > * + * {
          margin-left: ms(-6);
        }
      }

      .entry-link {
        margin-bottom: ms(0);

        a {
          display: inline-block;
          color: $dark-gray;
          background-color: $medium-gray;
          border-radius: 99999px;
          line-height: ms(4);
          padding: 0 ms(-2);
        }

      }

      .entry-social {
        margin-bottom: ms(0);
        display: inline-block;
        padding: ms(-4);
        background-color: $dark-gray;
        border-radius: 99999px;

        svg {
          display: block;
          width: ms(0);
          height: ms(0);

          path {
            fill: #fff
          }
        }

        &__ebay {
          padding: ms(-8);
          svg {
            width: ms(2);
            height: ms(2);
          }
        }
      }

      .popup-footer {
        border-top: 1px solid $light-gray;
        padding-top: ms(0);
      }
  }

  @media screen and (orientation: portrait) {
    .leaflet-popup {
      // display: none;
    }
  }

  .leaflet-overlay-pane svg path {
    stroke: $red !important;
    fill: transparentize($red, 0.5) !important;
  }

</style>
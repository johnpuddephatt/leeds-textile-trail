// import Vue from 'vue';
import Vue from 'vue/dist/vue.js';

import VueRouter from 'vue-router';
import 'leaflet/dist/leaflet.css';
import VueGtag from "vue-gtag";

Vue.use(VueRouter);

window.axios = require('axios');

import App from './components/App.vue';
import Story from './components/Story.vue';
import NotFound from './components/404.vue';

const routes = [
  {
    path: '/',
    component: App,
    name: 'app',
    children: [
      {
        path: ':slug',
        component: Story,
        props: true,
        name: 'story'
      },
    ]
  },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  routes, // short for `routes: routes`
  scrollBehavior: function (to) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  },
})

Vue.use(VueGtag, {
  config: { id: 'UA-48108307-2' },
  disableScriptLoad: true
}, router)

const app = new Vue({
  router
}).$mount('#app')
//
// const app = new Vue({
//   router,
//   render: (h) => {
//     return h();
//   },
// }).$mount('#app');
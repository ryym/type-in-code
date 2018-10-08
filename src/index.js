import Vue from 'vue';
import Vuex from 'vuex';
import {createStore} from './store';
import App from './App';

import './global.scss';

Vue.use(Vuex);

if (typeof hljs === 'undefined') {
  throw new Error('Highlight.js must be loaded');
}

const store = createStore({hljs});

if (process.env.NODE_ENV === 'development') {
  // For easy debugging.
  window._store = store;
}

new Vue({
  el: '#app',
  store,
  render: h => h(App),
});

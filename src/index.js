import Vue from 'vue';
import Vuex from 'vuex';
import {createStore} from './store';
import App from './App';

Vue.use(Vuex);

const store = createStore();

if (process.env.NODE_ENV === 'development') {
  // For easy debugging.
  window._store = store;
}

new Vue({
  el: '#app',
  store,
  render: h => h(App),
});

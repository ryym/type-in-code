import Vue from 'vue';
import Vuex from 'vuex';
import {createStore} from './store';
import App from './App';

Vue.use(Vuex);

new Vue({
  el: '#app',
  store: createStore(),
  render: h => h(App),
});

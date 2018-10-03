import Vue from 'vue';
import app from './App';

// XXX: temporary
// import '../proto/highlight.pack.js';

const App = Vue.extend(app);
new App().$mount('#app');

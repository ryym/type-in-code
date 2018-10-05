import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production';

export const createStore = () => {
  return new Vuex.Store({
    strict: debug,
    plugins: [createLogger()],

    state: {
      problem: {
        code: 'console.log("Hello, World!");',
        lang: 'javascript',
      },
    },
  });
};

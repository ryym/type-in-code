import Vuex from 'vuex';

// XXX: Currently unused.
// Maybe used later.

const debug = process.env.NODE_ENV !== 'production';

export const createStore = () => {
  return new Vuex.Store({
    strict: debug,
  });
};

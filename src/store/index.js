import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import {mutations} from './mutations';
import {actions} from './actions';
import {createGetters} from './getters';
import {newState} from './state';

const debug = process.env.NODE_ENV !== 'production';

export const createStore = ({hljs}) => {
  return new Vuex.Store({
    strict: debug,
    plugins: [createLogger()],
    state: newState(),
    mutations,
    actions,
    getters: createGetters(hljs),
  });
};

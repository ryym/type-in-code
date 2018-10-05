import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import {Base64} from 'js-base64';

const debug = process.env.NODE_ENV !== 'production';

const fetchProblemCode = async () => {
  const res = await fetch(
    // XXX: For now
    'https://api.github.com/repos/ryym/exercism/contents/javascript/simple-cipher/simple-cipher.js'
  );
  const json = await res.json();

  if (json.encoding !== 'base64') {
    throw new Error(`unsupported encoding: ${json.encoding}`);
  }

  return Base64.decode(json.content);
};
export const createStore = () => {
  return new Vuex.Store({
    strict: debug,
    plugins: [createLogger()],

    state: {
      pingCount: 0,
      problem: {
        code: '// Loading...',
        lang: 'javascript',
      },
    },

    mutations: {
      ping(state) {
        state.pingCount += 1;
      },

      setProblem(state, {lang, code}) {
        state.problem = {lang, code};
      },
    },

    actions: {
      pingAsync({commit}, ms = 1000) {
        setTimeout(() => commit('ping'), ms);
      },

      async fetchProblemCode({commit}) {
        const code = await fetchProblemCode();
        commit('setProblem', {code, lang: 'javascript'});
      },
    },
  });
};

import {findNextAsciiPos} from '../lib/input';

const setProblem = (state, {lang, code}) => {
  state.problem = {lang, code};
};

const startTyping = state => {
  state.startTime = Date.now();
  state.finishTime = null;
  state.input = '';
  state.nTypes = 0;
  state.missTypes = 0;
  state.cursorPos = findNextAsciiPos(state.problem.code, 0);
};

const addMissType = state => {
  state.missTypes += 1;
  state.missed = true;
};

const addInput = (state, {input, cursorPos}) => {
  state.missed = false;
  state.input = input;
  state.cursorPos = cursorPos;
  state.nTypes += 1;
};

const clearMissed = state => {
  state.missed = false;
};

const finishTyping = state => {
  state.finishTime = Date.now();
  state.nPlays += 1;
};

export const mutations = {
  ping(state) {
    state.pingCount += 1;
  },

  setProblem,
  startTyping,
  addMissType,
  clearMissed,
  addInput,
  finishTyping,
};

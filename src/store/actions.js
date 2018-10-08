import {fetchProblemCode as fetchCode} from '../lib/fetch-code';
import {CHAR_CODE, findNextAsciiPos, makeSpacePrefixes} from '../lib/input';

const fetchProblemCode = async ({commit}) => {
  // For now (prevent sending too many requests to GitHub).
  const lastProblem = localStorage.getItem('lastProblem');
  if (lastProblem) {
    console.log('Use cached problem from localStorage');
    commit('setProblem', JSON.parse(lastProblem));
    return;
  }

  const code = await fetchCode();

  // TODO: Replace tabs and full width spaces to spaces.
  // TODO: Replace CRLF to LF?
  const problem = {code, lang: 'javascript'};
  commit('setProblem', problem);
  localStorage.setItem('lastProblem', JSON.stringify(problem));
};

const startTyping = ({commit}) => {
  // I don't know why but We cannot focus the textarea
  // without delaying the 'startTyping' commit.
  requestAnimationFrame(() => commit('startTyping'));
};

const addMissType = ({commit}) => {
  commit('addMissType');
  setTimeout(() => {
    // XXX: Clear the missed state immediately to
    // remove the animation class from the cursor in code block.
    commit('clearMissed');
  }, 300);
};

const addInput = ({state, commit}, input) => {
  const finalCode = state.problem.code;
  let {cursorPos} = state;

  // Skip space prefixes.
  if (finalCode.charCodeAt(cursorPos) === CHAR_CODE.LF) {
    const spaces = makeSpacePrefixes(finalCode, cursorPos + 1);
    if (spaces) {
      cursorPos += spaces.length;
      input += spaces;
    }
  }

  // Skip un-inputtable characters.
  let nextPos = findNextAsciiPos(finalCode, cursorPos + 1);
  if (nextPos == null) {
    nextPos = finalCode.length;
  }
  if (nextPos - cursorPos > 1) {
    input += finalCode.substring(cursorPos + 1, nextPos);
  }

  commit('addInput', {input, cursorPos: nextPos});

  if (nextPos >= finalCode.length) {
    commit('finishTyping');
  }
};

export const actions = {
  pingAsync({commit}, ms = 1000) {
    setTimeout(() => commit('ping'), ms);
  },

  fetchProblemCode,
  startTyping,
  addMissType,
  addInput,
};

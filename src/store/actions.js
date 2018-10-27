import {fetchProblemCode as fetchCode} from '../lib/fetch-code';
import {CHAR_CODE, findNextAsciiPos, makeSpacePrefixes} from '../lib/input';

// TODO: Replace CRLF to LF?
const normalizeCode = code => {
  code = code.replace(/\t/g, '  ');
  if (code[code.length - 1] !== '\n') {
    code += '\n';
  }
  return code;
};

const fetchProblemCode = async ({commit}) => {
  const {sourceCode, langName} = await fetchCode();

  const code = normalizeCode(sourceCode);
  const problem = {code, lang: langName};
  commit('setProblem', problem);
};

const startTyping = ({commit}) => {
  // I don't know why but we cannot focus the textarea
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
  fetchProblemCode,
  startTyping,
  addMissType,
  addInput,
};

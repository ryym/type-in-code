export const createGetters = hljs => {
  return {
    finalHtml: ({problem}) => {
      const result = hljs.highlight(problem.lang, problem.code, true);
      return result.value;
    },

    inputHtml: state => {
      const result = hljs.highlight(state.problem.lang, state.input, true);
      return result.value;
    },

    inputPercentage: state => {
      const rate = state.input.length / state.problem.code.length;
      return Math.ceil(rate * 100);
    },

    started: state => {
      return state.startTime != null;
    },

    finished: state => {
      return state.finishTime != null;
    },

    isInGame: (_state, g) => {
      return g.started && !g.finished;
    },

    isCorrectInput: ({cursorPos, problem}) => input => {
      return input[cursorPos] === problem.code[cursorPos];
    },

    totalTime: ({startTime, finishTime}) => {
      if (startTime && finishTime) {
        return finishTime - startTime;
      }
      return null;
    },
  };
};

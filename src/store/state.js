export const newState = () => ({
  pingCount: 0,
  problem: {
    code: '// Loading...',
    lang: 'javascript',
  },
  nPlays: 0,

  ...newInputState(),
});

const newInputState = () => ({
  input: '',
  nTypes: 0,
  missTypes: 0,
  missed: false,
  cursorPos: null,
  startTime: null,
  finishTime: null,
});

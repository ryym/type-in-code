export const CHAR_CODE = {
  LF: 10,
};

export const findNextAsciiPos = (str, from) => {
  for (let i = from; i < str.length; i++) {
    const cc = str.charCodeAt(i);

    // Allow characters between space and tilde and line feeds.
    if ((32 <= cc && cc <= 126) || cc === CHAR_CODE.LF) {
      return i;
    }
  }
  return null;
};

export const makeSpacePrefixes = (str, from) => {
  let i = from;
  let spaces = '';
  while (str[i] === ' ' && i < str.length) {
    spaces += ' ';
    i += 1;
  }
  return spaces;
};

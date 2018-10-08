import {Base64} from 'js-base64';

export const fetchProblemCode = async () => {
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

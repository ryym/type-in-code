import {Base64} from 'js-base64';

// Fetch source code randomly from https://github.com/ryym/exercism for now.
// (Searching through several repositories requires GitHub account)

const langs = [
  {
    key: 'javascript',
    name: 'JavaScript',
    fileName: problemName => `${problemName}.js`,
  },
  {
    key: 'go',
    name: 'Go',
    fileName: problemName => `${problemName.replace(/-/g, '_')}.go`,
  },
  {
    key: 'ruby',
    name: 'Ruby',
    fileName: problemName => `${problemName.replace(/-/g, '_')}.rb`,
  },
  {
    key: 'rust',
    name: 'Rust',
    fileName: () => 'src/lib.rs',
  },
];

const getRandomInt = ceil => Math.floor(Math.random() * ceil);

const REPO_URL = 'https://api.github.com/repos/ryym/exercism/contents';

const fetchJson = async url => {
  const res = await fetch(url);
  return await res.json();
};

const fetchProblems = async langKey => {
  const cache = sessionStorage.getItem(`problems/${langKey}`);
  if (cache) {
    return JSON.parse(cache);
  }

  const dirContents = await fetchJson(`${REPO_URL}/${langKey}`);
  const problems = selectProblems(dirContents);
  sessionStorage.setItem(`problems/${langKey}`, JSON.stringify(problems));

  return problems;
};

const selectProblems = dirContents => {
  return dirContents.reduce((ps, item) => {
    if (item.type === 'dir') {
      ps.push({
        name: item.name,
        path: item.path,
      });
    }
    return ps;
  }, []);
};

export const fetchProblemCode = async () => {
  const lang = langs[getRandomInt(langs.length)];

  const problems = await fetchProblems(lang.key);
  const problem = problems[getRandomInt(problems.length)];
  const srcFileName = lang.fileName(problem.name);

  const srcURL = `${REPO_URL}/${lang.key}/${problem.name}/${srcFileName}`;
  const srcContent = await fetchJson(srcURL);
  if (srcContent.type !== 'file') {
    console.error(srcContent);
    throw new Error(`unexpected response from ${srcURL}`);
  }

  if (srcContent.encoding !== 'base64') {
    throw new Error(`unsupported encoding: ${srcContent.encoding}`);
  }

  return {
    sourceCode: Base64.decode(srcContent.content),
    langKey: lang.key,
    langName: lang.name,
  };
};

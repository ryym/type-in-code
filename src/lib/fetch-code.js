import {Base64} from 'js-base64';

// Fetch source code randomly from https://github.com/ryym/exercism for now.
// (Searching through several repositories requires GitHub account)

const langs = [
  {
    name: 'javascript',
    fileName: problemName => `${problemName}.js`,
  },
  {
    name: 'go',
    fileName: problemName => `${problemName}.go`,
  },
  {
    name: 'ruby',
    fileName: problemName => `${problemName.replace(/-/g, '_')}.rb`,
  },
  {
    name: 'rust',
    fileName: () => 'src/lib.rs',
  },
];

const getRandomInt = ceil => Math.floor(Math.random() * ceil);

const REPO_URL = 'https://api.github.com/repos/ryym/exercism/contents';

const fetchJson = async url => {
  const res = await fetch(url);
  return await res.json();
};

const fetchProblems = async langName => {
  const cache = sessionStorage.getItem(`problems/${langName}`);
  if (cache) {
    return JSON.parse(cache);
  }

  const dirContents = await fetchJson(`${REPO_URL}/${langName}`);
  const problems = selectProblems(dirContents);
  sessionStorage.setItem(`problems/${langName}`, JSON.stringify(problems));

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
  // const lang = langs[getRandomInt(langs.length)];
  const lang = langs.find(l => l.name === 'ruby');

  const problems = await fetchProblems(lang.name);
  const problem = problems[getRandomInt(problems.length)];
  const srcFileName = lang.fileName(problem.name);

  const srcURL = `${REPO_URL}/${lang.name}/${problem.name}/${srcFileName}`;
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
    langName: lang.name,
  };
};

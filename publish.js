// https://github.com/tschaub/gh-pages

const ghpages = require('gh-pages');

ghpages.publish('dest', err => {
  if (err) {
    console.error('Failed to publish', err);
  } else {
    console.log('pushed to gh-pages');
  }
});

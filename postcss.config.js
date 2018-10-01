module.exports = () => ({
  parser: 'postcss-scss',
  plugins: {
    autoprefixer: true,
    'postcss-nested': true,
  },
});

const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// UglifyJs stopped using uglify-es.
// https://github.com/webpack/webpack/issues/5858#issuecomment-423796350
const TerserJsPlugin = require('terser-webpack-plugin');

const ROOT = __dirname;
const SRC_ROOT = path.join(ROOT, 'src');
const DEST_DIR = path.join(ROOT, 'dest');

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.WEBPACK_DEV_PORT || 3000;

const byEnv = ({dev, test, prod}, defaultValue = null) => {
  switch (ENV) {
    case 'development':
      return dev;
    case 'production':
      return prod;
    default:
      return defaultValue;
  }
};

module.exports = {
  mode: byEnv({dev: 'development', prod: 'production'}),

  entry: [SRC_ROOT],

  resolve: {
    extensions: ['.vue', '.js'],
  },

  optimization: {
    minimizer: [
      new TerserJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
  },

  output: {
    path: DEST_DIR,
    filename: byEnv({
      dev: '[name].js',
      prod: '[name]-[hash].js',
    }),
    publicPath: '/',
  },

  devServer: {
    contentBase: DEST_DIR,
    port: PORT,
  },

  devtool: byEnv({
    dev: 'cheap-module-source-map',
    prod: false,
  }),

  module: {
    strictExportPresence: true,

    rules: [
      {
        test: /\.vue$/,
        include: SRC_ROOT,
        use: ['vue-loader'],
      },

      {
        test: /\.css$/,
        include: SRC_ROOT,
        use: [
          byEnv({
            dev: 'vue-style-loader',
            prod: MiniCssExtractPlugin.loader,
          }),
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),

    new CleanWebpackPlugin([DEST_DIR]),

    new HtmlWebpackPlugin({
      template: 'index.html',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${ENV}'`,
      },
    }),

    ...byEnv({
      dev: [],
      prod: [
        new MiniCssExtractPlugin({
          filename: '[name]-[contenthash].css',
        }),
      ],
    }),
  ],
};

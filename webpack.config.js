const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const glob = require('glob');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
      }),
    ],
  },
  parts.loadFonts({
    options: {
      name: '[name].[hash:8].[ext]',
    }
  }),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    performance: {
      hints: "warning",
      maxEntrypointSize: 50000,
      maxAssetSize: 450000,
    },
    output: {
      chunkFilename: "[name].[chunkhash:8].js",
      filename: "[name].[chunkhash:8].js",
    }
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.extractCSS({ use: ['css-loader', parts.autoprefix() ] }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};

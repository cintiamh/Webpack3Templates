# Webpack3Templates - Babel & HTML

Simple HTML pages with JavaScript supporting ES2015, CSS, and assets.

Start package.json file:
```
$ npm init -y
```

Create basic folder structure:
```
$ mkdir src
$ touch src/index.js
$ touch src/component.js
```

Install webapck:
```
$ npm i webpack -D
$ npm i webpack-dev-server -D
$ npm i html-webpack-plugin -D
$ npm i webpack-merge -D
$ touch webpack.config.js
$ touch webpack.parts.js
```

webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

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
]);

const productionConfig = merge([
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};
```

In package.json include:
```javascript
"scripts": {
    "start": "webpack-dev-server --env development",
    "build": "webpack --env production"
}
```

webpack.parts.js
```javascript
exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        historyApiFallback: true,
        // output errors only
        stats: 'errors-only',
        host,
        port,
        overlay: {
            errors: true,
            warnings: true,
        }
    }
});
```

Now you can run:
```
$ npm start
$ npm run build
```

## Eslint

The eslint --init will helps to create a .eslintrc file with the rules you choose.

```
$ npm i eslint -D
$ touch .eslintignore
$ ./node_modules/.bin/eslint --init
```

package.json
```javascript
"scripts": {
  "lint": "eslint . --ext .js --ext .jsx"
}
```

.eslintignore
```
build
node_modules
```

.eslintrc
```javascript
{
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true
    }
}
```

## Styling

```
$ npm i css-loader style-loader -D
$ touch src/main.css
```

webpack.parts.js
```javascript
exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
```

webpack.config.js
```javascript
const developmentConfig = merge([
  // ...
  parts.loadCSS(),
]);
```

### Loading Sass

```
$ npm i node-sass sass-loader -D
```

webpack.parts.js
```javascript
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
}
```

### Loading from node_modules directory

```css
@import "~bootstrap/less/bootstrap";
```

### Extract CSS

```
$ npm i extract-text-webpack-plugin -D
```

webpack.parts.js
```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// ...
exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
  });
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};
```

webpack.config.js
```javascript
const productionConfig = () => merge([
  parts.extractCSS({ use: 'css-loader' }),
]);
```

### Autoprefixing

```
$ npm i postcss-loader autoprefixer -D
```

webpack.parts.js
```javascript
exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
    ]),
  },
});
```

webpack.config.js
```javascript
const productionConfig = () => merge([
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
]);
```

### Eliminating unused CSS

```
$ npm i glob purifycss-webpack purify-css -D
```

webpack.parts.js
```javascript
const PurifyCSSPlugin = require('purifycss-webpack');

exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});
```

webpack.config.js
```javascript
const glob = require('glob');
// ...
const productionConfig = merge([
  // This has to be AFTER extractCSS
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
]);
```

## Loading images

```
$ npm i url-loader file-loader -D
```

* `url-loader`: inline images (smaller)
* `file-loader`: skip inlining (bigger)

webpack.parts.js
```javascript
exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options,
        },
      },
    ],
  },
});
```

webpack.config.js
```javascript
const productionConfig = merge([
  // ...
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    },
  }),
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);
```

## Loading Fonts

Just like with images:
```
$ npm i url-loader file-loader -D
```

webpack.parts.js
```javascript
exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,
        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});
```

webpack.config.js
```javascript
const commonConfig = merge([
  // ...
  parts.loadFonts({
    options: {
      name: '[name].[ext]',
    }
  }),
]);
```

## Loading JavaScript

```
$ npm i babel-loader babel-core babel-preset-env -D
$ npm i babel-plugin-transform-object-assign babel-plugin-transform-object-rest-spread babel-plugin-transform-runtime -D
$ touch .babelrc
```

webpack.parts.js
```javascript
exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    ],
  },
});
```

webpack.config.js
```javascript
const commonConfig = merge([
  // ...
  parts.loadJavaScript({ include: PATHS.app }),
]);
```

.babelrc
```javascript
{
  "presets": ["env"],
  "plugins": [
    "transform-object-rest-spread" ,
    "transform-object-assign",
    "transform-runtime"
  ]
}
```

## Source maps

webpack.parts.js
```javascript
exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});
```

* `eval-source-map` for development.
* `source-map` for production.

webpack.config.js
```javascript
const productionConfig = () => merge([
  parts.generateSourceMaps({ type: 'source-map' }),
  // ...
]);

const developmentConfig = () => merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  // ...
]);
```

## React

From: https://blog.hellojs.org/setting-up-your-react-es6-development-environment-with-webpack-express-and-babel-e2a53994ade

```
$ npm i -S react react-dom
$ npm i -D babel-preset-react react-hot-loader
$ npm i -D webpack-dev-middleware webpack-hot-middleware
```

.babelrc
```json
"scripts": {
  "presets": ["env", "react"]
}
```

## Express

```
$ npm i -S express
$ touch src/server.js
$ touch src/app.js
```

server.js
```javascript
const path = require('path')
const express = require('express')

module.exports = {
  app: function () {
    const app = express();
    const indexPath = path.join(__dirname, 'indexDep.html');
    const publicPath = express.static(path.join(__dirname, '../build'));

    app.use('/build', publicPath);
    app.get('/', function (_, res) { res.sendFile(indexPath) });

    return app;
  }
}
```

app.js
```javascript
const Server = require('./server.js')
const port = (process.env.PORT || 3000)
const app = Server.app()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.config.js')();
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPathdist
  }))
}

app.listen(port)
console.log(`Listening at http://localhost:${port}`)
```

Run:
```
$ node dist/app.js
```

package.json update scripts
```json
"scripts": {
  "start": "npm run build && node build/app.js",
  "dev": "node src/app.js",
  "start:old": "webpack-dev-server --env development",
  "build": "webpack --env production",
  "lint": "eslint . --ext .js --ext .jsx",
  "test": "karma start karma.conf.js",
  "test:watch": "npm run test -- --watch"
}
```

## Bundle Splitting

webpack.parts.js
```javascript
const webpack = require('webpack');

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});
```

webpack.config.js
```javascript
const productionConfig = () => merge([
  {
    entry: {
      vendor: ['react', 'react-dom'],
    },
  },
  // ...
  parts.extractBundles([
    {
      name: 'vendor'
    },
  ]),
]);
```

## Tyiding up

```
$ npm i clean-webpack-plugin -D
```

webpack.parts.js
```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.clean = (path) => ({
  plugins: [
    new CleanWebpackPlugin([path]),
  ],
});
```

webpack.config.js
```javascript
const productionConfig = () => merge([
  parts.clean(PATHS.build),
  // ...
]);
```

## Minifying

```
$ npm i uglifyjs-webpack-plugin -D
```

webpack.parts.js
```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

exports.minifyJavaScript = () => ({
  plugins: [
    new UglifyJsPlugin()
  ],
});
```

webpack.config.js
```javascript
const productionConfig = () => merge([
  // ...
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  // ...
]);
```

## Adding Hashes to Filenames

webpack.config.js
```javascript
const commonConfig = merge([
  // ...
  parts.loadFonts({
    options: {
      name: '[name].[hash:8].[ext]',
    }
  }),
  // ...
]);

const productionConfig = () => merge([
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
  // ...
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]',
    },
  }),
  // ...
]);
```

webpack.parts.js
```javascript
exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
  });
  // ...
};
```

## Testing

```
$ npm i -D mocha chai sinon
$ npm i -D karma karma-chai karma-mocha karma-webpack
$ npm i -D puppeteer karma-chrome-launcher
$ npm i -D karma-spec-reporter
$ npm i -D babel-plugin-istanbul karma-coverage
$ npm i -D yargs
$ mkdir tests
$ touch tests/cow.spec.js

# optional
$ ./node_modules/karma/bin/karma init karma.conf.js
```

package.json
```json
"scripts": {
  "test": "karma start karma.conf.js",
  "test:watch": "npm run test -- --watch"
}
```

karma.conf.js
```javascript
const path = require('path');
const argv = require('yargs').argv;
const parts = require('./webpack.parts');

const tests = './tests/**/*.spec.js';
const coveragePath = './artifacts';

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  process.env.BABEL_ENV = "karma";

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      tests
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      [tests]: ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'spec', 'coverage'],

    coverageReporter: {
      dir: coveragePath,
      reporters: [{ type: 'json', subdir: 'coverage' }, { type: 'lcov', subdir: 'coverage' }],
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !argv.watch,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: parts.loadJavaScript({
      include: [path.join(__dirname, 'src')]
    }),
  })
};
```

.babelrc
```javascript
{
  // ...
  "env": {
    "karma": {
      "plugins": [
        [
          "istanbul",
          { "exclude": ["tests/**/*.spec.js"] }
        ]
      ]
    }
  }
}
```

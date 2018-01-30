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

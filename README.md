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
```
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
$ touch webpack.config.js
```

In package.json include:
```javascript
"scripts": {
    "start": "webpack-dev-server --env development",
    "build": "webpack --env production"
}
```

Now you can run:
```
$ npm start
$ npm run build
```
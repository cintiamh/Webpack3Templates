const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts  = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

const commonConfig = {
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
};

const productionConfig = () => merge([
    parts.lintJavaScript()
]);

const developmentConfig = () => merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
]);

module.exports = (env) => {
    if (env === 'production') {
        return merge([commonConfig, productionConfig]);
    }
    return merge([commonConfig, developmentConfig]);
};

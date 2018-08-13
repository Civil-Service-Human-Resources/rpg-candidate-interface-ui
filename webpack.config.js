const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const DIST_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'public');

module.exports = {

    context: SRC_DIR,

    resolve: {
        modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
        extensions: [ '.js', '.jsx', '.json' ]
    },

    entry: {
        'bundle': './javascripts/main.js',
        'bundle.min': './javascripts/main.js'
    },

    devtool: "source-map",

    output: {
        path: DIST_DIR,
        filename: 'javascripts/[name].js'
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/,
                sourceMap: true
            })
        ]
    },

    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }

};
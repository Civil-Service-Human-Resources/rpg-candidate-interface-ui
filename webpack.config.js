const path = require('path');

const DIST_DIR = path.join(__dirname, 'public');
const SRC_DIR = path.join(__dirname, 'public');

module.exports = {

    context: SRC_DIR,

    entry: ['./javascripts/main.js'],

    output: {
        path: DIST_DIR,
        filename: 'javascripts/bundle.js'
    },

    watch: true,

    watchOptions: {
        ignored: /node_modules/
    }

};
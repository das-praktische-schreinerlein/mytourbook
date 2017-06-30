var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './dist/tsc-out/backend/server.js',
    target: 'async-node',
    output: {
        path: path.join(__dirname, 'dist/backend/'),
        filename: 'backend.js'
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] }
        ]
    },
    externals: nodeModules,
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/)
/**
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false })
**/
    ],
    devtool: 'sourcemap',
    node: {
        fs: 'empty'
    }
};

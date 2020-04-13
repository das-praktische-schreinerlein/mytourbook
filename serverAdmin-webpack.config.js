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
    entry: './dist/tsc-out/backend/serverAdmin.js',
    mode: 'production',
    target: 'async-node',
    output: {
        path: path.join(__dirname, 'dist/backend/'),
        filename: 'serverAdmin.js'
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel'] }
        ]
    },
    externals: nodeModules,
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/)
    ],
    devtool: 'sourcemap',
    node: {
        fs: 'empty'
    }
};

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        if (['.bin'].indexOf(x) === -1) {
            return true;
        }

        console.error("filter .bin: ", x);
        return false;
    })
    .forEach(function(mod) {
        if (mod.match(/redis/) || mod.match(/knex/) || mod.match(/sqlite/) ||
            mod.match(/mysql/) || mod.match(/vid-streamer/) || mod.match(/fluent-ffmpeg/)) {
            console.error("module as commonsjs: ", mod);
            nodeModules[mod] = 'commonjs ' + mod;
        }
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
            // exclude node_modules and server-main to prevent problem with strict-mode (for instance domino)
            { test: /\.js$/, exclude: /node_modules|mytbdev-server|mytbbeta-server|mytb-server/, loaders: ['babel-loader'] }
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

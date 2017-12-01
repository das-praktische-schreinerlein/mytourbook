const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1 && 'redis'.indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {  frontendserver: './src/frontendserver/frontendserver.ts' },
    resolve: { extensions: ['.js', '.ts', '.json'] },
    target: 'node',
    // this makes sure we include node_modules and other 3rd party libraries
    externals: {
        include: /(node_modules|main\..*\.js)/,
        exclude: /(.*redis.*)/
    },
     // nodeModules,
    output: {
        path: path.join(__dirname, 'dist/frontendserver/'),
        filename: 'frontendserver.js'
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            DIST_PROFILE: JSON.stringify("mytbdev/de/"),
            DIST_SERVER_PROFILE: JSON.stringify("mytbdev-server/de/")
        }),
        // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
        // for "WARNING Critical dependency: the request of a dependency is an expression"
        new webpack.ContextReplacementPlugin(
            /(.+)?angular(\\|\/)core(.+)?/,
            path.join(__dirname, 'src'), // location of your src
            {} // a map of your routes
        ),
        new webpack.ContextReplacementPlugin(
            /(.+)?express(\\|\/)(.+)?/,
            path.join(__dirname, 'src'),
            {}
        )
    ]
};

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const minimist = require ('minimist');

const nodeModules = {};
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

const argv = minimist(process.argv.slice(2));
const profile = argv['profile'];
let replacements = [];
let distPath = '';
if (profile === 'prod-de') {
    replacements = [
        {search: 'SERVER_BUNDLE', replace: '../mytb-server/de/main', flags: 'g'},
        {search: 'DIST_PROFILE', replace: 'mytb/de/', flags: 'g'},
        {search: 'DIST_SERVER_PROFILE', replace: 'mytb-server/de/', flags: 'g'}
    ];
    distPath = 'dist/frontendserver-de/';
} else if (profile === 'beta-de') {
    replacements = [
        {search: 'SERVER_BUNDLE', replace: '../mytbbeta-server/de/main', flags: 'g'},
        {search: 'DIST_PROFILE', replace: 'mytbbeta/de/', flags: 'g'},
        {search: 'DIST_SERVER_PROFILE', replace: 'mytbbeta-server/de/', flags: 'g'}
    ];
    distPath = 'dist/frontendserver-beta-de/';
} else if (profile === 'dev-de') {
    replacements = [
        {search: 'SERVER_BUNDLE', replace: '../mytbdev-server/de/main', flags: 'g'},
        {search: 'DIST_PROFILE', replace: 'mytbdev/de/', flags: 'g'},
        {search: 'DIST_SERVER_PROFILE', replace: 'mytbdev-server/de/', flags: 'g'}
    ];
    distPath = 'dist/frontendserver-dev-de/';
} else {
    console.error("unknown profile:", profile);
    process.exit(2);
}

module.exports = {
    entry: './dist/tsc-out-frontent/frontendserver.js',
    resolve: { extensions: ['.js', '.ts', '.json'] },
    mode: 'production',
    /**
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: '../',
    },
    **/
    target: 'async-node',
    // this makes sure we include node_modules and other 3rd party libraries
    externals: nodeModules,
    output: {
        path: path.join(__dirname, distPath),
        filename: 'frontendserver.js',
        libraryTarget: "commonjs"
    },
    module: {
        rules: [
            { test: /\.ts|\.js$/, loader: 'string-replace-loader', options: { multiple: replacements} },
            // exclude node_modules and server-main to prevent problem with strict-mode (for instance domino)
            { test: /\.js$/, exclude: /node_modules|mytbdev-server|mytbbeta-server|mytb-server/, loaders: ['babel-loader'] },
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
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

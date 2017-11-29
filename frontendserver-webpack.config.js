const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {  frontendserver: './src/frontendserver/frontendserver.ts' },
    resolve: { extensions: ['.js', '.ts'] },
    target: 'node',
    // this makes sure we include node_modules and other 3rd party libraries
    externals: [/(node_modules|main\..*\.js)/],
    output: {
        path: path.join(__dirname, 'dist/frontendserver/'),
        filename: '[name].js'
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

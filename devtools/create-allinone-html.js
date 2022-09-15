#!/usr/bin/env node

var inlineSource = require('inline-source');
var fs = require('fs');
var path = require('path');

const srcPath = path.resolve('dist/static/mytbviewer/de/index.viewer.html');
const destPath = path.resolve('dist/static/mytbviewer/de/index.viewer.full.html');

return inlineSource.inlineSource(srcPath, {
    compress: true,
    attribute: false,
    rootpath: path.dirname(srcPath),
    // Skip all css types and png formats
    ignore: [],
}).then(html => {
    // Do something with html
    fs.writeFileSync(destPath, html);
    console.log('DONE - inlining:', srcPath, destPath);
    process.exit(0);
}).catch(reason => {
    console.error('ERROR - inlining failed:', reason, srcPath, destPath);
    process.exit(-1);
});

#!/usr/bin/env node

var inlineSource = require('inline-source');
var fs = require('fs');
var path = require('path');

const myArgs = process.argv.slice(2);
let attribute = false;
if (myArgs.length < 2 || myArgs.length > 3) {
    console.error('ERROR - inlining failed - need src + dest-file', myArgs);
    process.exit(-1);
}

const srcPath = path.resolve(myArgs[0]);
const destPath = path.resolve(myArgs[1]);

if (myArgs.length === 3) {
    attribute = myArgs[2];
}

return inlineSource.inlineSource(srcPath, {
    compress: true,
    attribute: attribute,
    rootpath: path.dirname(srcPath),
    swallowErrors: false,
    ignore: [],
}).then(html => {
    fs.writeFileSync(destPath, html);
    console.log('DONE - inlining:', srcPath, destPath);
    process.exit(0);
}).catch(reason => {
    console.error('WARNING - inlining failed:', reason, srcPath, destPath);
    console.log('DO REPEAT - inlining after error:', srcPath, destPath);
    return inlineSource.inlineSource(srcPath, {
        compress: true,
        attribute: attribute,
        rootpath: path.dirname(srcPath),
        swallowErrors: true,
        ignore: [],
    }).then(html => {
        fs.writeFileSync(destPath, html);
        console.log('DONE - inlining ignoring errors:', srcPath, destPath);
        process.exit(0);
    }).catch(reason => {
        console.error('ERROR - inlining failed:', reason, srcPath, destPath);
        process.exit(-1);
    });
});

#!/usr/bin/env node
'use strict';

var inlineSource = require('inline-source');
var fs = require('fs');
var path = require('path');
var NodeCrypt = require('./nodewebcompressor').NodeCrypt;
var NodeCompressor = require('./nodewebcompressor').NodeCompressor;

var salt = 'salt';
var attribute = false;
var password;

var myArgs = process.argv.slice(2);
if (myArgs.length < 2 || myArgs.length > 5) {
    console.error('ERROR - inlining failed - need src, dest-file, [inline-attribute: default all] [additional path-end-patterns to ignore] [password]', myArgs);
    process.exit(-1);
}

var srcPath = path.resolve(myArgs[0]);
var destPath = path.resolve(myArgs[1]);
var dontCompressEndings = ['lz-string.min.js', 'webloader.js', 'config.js'];

if (myArgs.length >= 3) {
    attribute = myArgs[2] !== undefined && myArgs[2] !== null && myArgs[2] !== '' ? myArgs[2] : false;

    if (myArgs.length >= 4) {
        dontCompressEndings = dontCompressEndings.concat(myArgs[3].split(','));
    }

    if (myArgs.length >= 5) {
        password = myArgs[4] !== undefined && myArgs[4] !== null && myArgs[4] !== '' ? myArgs[4] : undefined;
    }
}

var cryptConfig = NodeCrypt.getDefaultCryptConfig();
cryptConfig.keyConfig.password = password;
cryptConfig.keyConfig.salt = salt;

var compressHandler = function handler(source, context) {
    if (source.fileContent && source.type === 'js') {
        for (var dontCompressEnding of dontCompressEndings) {
            if (source.filepath.endsWith(dontCompressEnding)) {
                console.log('inlining js uncompressed', source.filepath);
                return;
            }
        }

        source.content = NodeCompressor.compressDocument(cryptConfig, path.basename(source.filepath), source.fileContent);

        return;
    }

    console.log('inlining uncompressed', source.filepath);
};

var options = {
    compress: true,
    attribute: attribute,
    rootpath: path.dirname(srcPath),
    swallowErrors: false,
    ignore: ['ico'],
    handlers: [compressHandler],
    saveRemote: false
};


return inlineSource.inlineSource(srcPath, options).then(html => {
    fs.writeFileSync(destPath, html);
    console.log('DONE - inlining:', srcPath, destPath);
    process.exit(0);
}).catch(reason => {
    console.error('WARNING - inlining failed:', reason, srcPath, destPath);
    console.log('DO REPEAT - inlining after error:', srcPath, destPath);

    options.swallowErrors = true;

    return inlineSource.inlineSource(srcPath, options).then(html => {
        fs.writeFileSync(destPath, html);
        console.log('DONE - inlining ignoring errors:', srcPath, destPath);
        process.exit(0);
    }).catch(reason => {
        console.error('ERROR - inlining failed:', reason, srcPath, destPath);
        process.exit(-1);
    });
});

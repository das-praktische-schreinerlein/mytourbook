#!/usr/bin/env node

var inlineSource = require('inline-source');
var fs = require('fs');
var path = require('path');
var lzString = require('lz-string');

const myArgs = process.argv.slice(2);
let attribute = false;
if (myArgs.length < 2 || myArgs.length > 4) {
    console.error('ERROR - inlining failed - need src, dest-file, [inline-attribute: default all] [additional path-end-patterns to ignore]', myArgs);
    process.exit(-1);
}

const srcPath = path.resolve(myArgs[0]);
const destPath = path.resolve(myArgs[1]);
let dontCompressEndings = ['lz-string.min.js', 'config.js'];

if (myArgs.length >= 3) {
    attribute = myArgs[2];

    if (myArgs.length >= 4) {
        dontCompressEndings = dontCompressEndings.concat(myArgs[3].split(','));
    }
}

var compressHandler =function handler(source, context) {
    if (source.fileContent && source.type === 'js') {
        for (const dontCompressEnding of dontCompressEndings) {
            if (source.filepath.endsWith(dontCompressEnding)) {
                console.log('inlining js uncompressed', source.filepath);
                return;
            }
        }

        console.log('inlining js compressed', source.filepath);
        source.content = 'eval(LZString.decompressFromBase64("' + lzString.compressToBase64(source.fileContent) + '"));';
        return;
    }

    console.log('inlining uncompressed', source.filepath);
};

const options = {
    compress: true,
    attribute: attribute,
    rootpath: path.dirname(srcPath),
    swallowErrors: false,
    ignore: ['ico'],
    handlers: [compressHandler]
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

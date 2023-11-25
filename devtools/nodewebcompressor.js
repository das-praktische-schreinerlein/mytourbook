#!/usr/bin/env node
'use strict';

var lzString = require('lz-string');
var crypto = require('crypto');

var NodeCrypt = {
    getDefaultKeyConfig: function () {
        return {
            digest: 'sha256',
            iterations: 100,
            keylen: 256 / 8,
            password: undefined,
            salt: 'salt'
        };
    },

    getDefaultCryptConfig: function () {
        return {
            keyConfig: NodeCrypt.getDefaultKeyConfig(),
            algorithm: 'aes-256-cbc',
        };
    },

    encryptText: function (cryptConfig, text) {
        var textSrc = NodeCrypt.btoa(text);

        // if text isn't a multiple of 16 bytes, add necessary amount of "=" chars to make it so
        if (textSrc.length % 16 !== 0) {
            textSrc += '='.repeat(16 - (textSrc.length % 16));
        }

        var derivedKey = NodeCrypt.createKey(cryptConfig);
        var generatedIV = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv(cryptConfig.algorithm, derivedKey, generatedIV);

        var textInBytes = Buffer.from(textSrc);
        var encryptedTextInBytes = Buffer.concat([cipher.update(textInBytes), cipher.final()]);

        var encryptedTextInHex = NodeCrypt.bytesToHex(encryptedTextInBytes);
        var generatedIVInHex = NodeCrypt.bytesToHex(generatedIV);
        var cipherText = generatedIVInHex + ':' + encryptedTextInHex;

        return {
            iv: generatedIVInHex,
            ivRaw: JSON.stringify(Buffer.from(generatedIV)).replace(/"/g, ''),
            cipherText: cipherText,
            encryptedTextRaw: JSON.stringify(Buffer.from(encryptedTextInBytes)).replace(/"/g, '')
        };
    },

    decryptText: function (cryptConfig, cipherText) {
        var splitCipherText = cipherText.split(':');
        var ivInHex = splitCipherText[0];
        var iv = NodeCrypt.hexToBytes(ivInHex);
        var generatedIv = Buffer.from(iv);

        var derivedKey = NodeCrypt.createKey(cryptConfig);
        var decipher = crypto.createDecipheriv(cryptConfig.algorithm, derivedKey, generatedIv);

        var encryptedHex = splitCipherText[1];
        var encryptedBytes = NodeCrypt.hexToBytes(encryptedHex);
        var decryptedBytes = Buffer.concat([decipher.update(Buffer.from(encryptedBytes)), decipher.final()]);

        var decryptedTextSrc = decryptedBytes.toString();
        decryptedTextSrc = decryptedTextSrc.replace(/=/g, '');

        var decryptedText =  NodeCrypt.atob(decryptedTextSrc);

        return decryptedText;
    },

    btoa: function (str) {
        var buffer;

        if (str instanceof Buffer) {
            buffer = str;
        } else {
            buffer = Buffer.from(str.toString(), 'binary');
        }

        return buffer.toString('base64');
    },

    atob: function (str) {
        return Buffer.from(str, 'base64').toString('binary');
    },

    hexToBytes: function (hex) {
        var bytes = [];
        for (var c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }

        return bytes;
    },

    bytesToHex: function (bytes) {
        var hex = [];
        for (var i = 0; i < bytes.length; i++) {
            var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join('');
    },

    createKey: function(cryptConfig) {
        var derivedKey = crypto.pbkdf2Sync(cryptConfig.keyConfig.password, Buffer.from(cryptConfig.keyConfig.salt),
            cryptConfig.keyConfig.iterations,
            cryptConfig.keyConfig.keylen,
            cryptConfig.keyConfig.digest);

        return derivedKey;
    }
};

var NodeCompressor = {
    compressDocument: function (cryptConfig, filepath, fileContent) {
        if (cryptConfig.keyConfig.password !== undefined) {
            console.log('inlining js encrypted and compressed', filepath);
            var compressed = lzString.compressToBase64(fileContent);
            var encryptionResult = NodeCrypt.encryptText(cryptConfig, compressed);
            var decryptionResult = NodeCrypt.decryptText(cryptConfig, encryptionResult.cipherText);
            if (compressed !== decryptionResult) {
                console.error("ERROR - compressed and decryptionResult differ:", compressed.length, decryptionResult.length);
                console.debug("ERROR - compressed and decryptionResult differ:",
                    Buffer.from(compressed, 0, 20),
                    Buffer.from(decryptionResult, 0, 20));
                return;
            }

            return 'document.decompressJsSrc.push(' +
                '{"name" : "' + filepath + '",' +
                ' "crypted": true ,' +
                ' "src": "' + encryptionResult.cipherText + '"});';
        }

        console.log('inlining js uncrypted and compressed', filepath);
        var compressedBase64 = lzString.compressToBase64(fileContent);
        var decompressResult = lzString.decompressFromBase64(compressedBase64);
        if (fileContent !== decompressResult) {
            console.error("ERROR - fileContent and decompressResult differ:", fileContent.length, decompressResult.length);
            console.debug("ERROR - fileContent and decompressResult differ:",
                Buffer.from(compressedBase64, 0, 20),
                Buffer.from(decompressResult, 0, 20));
            return;
        }

        return 'document.decompressJsSrc.push(' +
            '{"name" : "' + filepath + '",' +
            ' "crypted": false,' +
            ' "src": "' + compressedBase64 + '"});';
    }
};

exports.NodeCrypt = NodeCrypt;
exports.NodeCompressor = NodeCompressor;

'use strict'

var WebCrypt = {
    getDefaultKeyConfig: function() {
        return {
            digest: 'SHA-256',
            iterations: 100,
            keylen: 256,
            password: undefined,
            salt: 'salt'
        };
    },

    getDefaultCryptConfig: function() {
        return {
            keyConfig: WebCrypt.getDefaultKeyConfig(),
            algorithm: 'aes-cbc'
        };
    },

    decryptText: async function(cryptConfig, cipherText, ivRaw, encryptedTextRaw) {
        if (cipherText === undefined || cipherText.length === 0) {
            return undefined;
        }

        var passphrasebytes = WebCrypt.encodeUtf8(cryptConfig.keyConfig.password);
        var pbkdf2salt = WebCrypt.encodeUtf8(cryptConfig.keyConfig.salt);

        var passphrasekey = await window.crypto.subtle.importKey(
            'raw',
            passphrasebytes,
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        ).catch( function(err) {
            console.error('ERROR - while creating passphrasekey', err);
            return;
        });

        if (!passphrasekey) {
            return;
        }

        var key = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: pbkdf2salt,
                iterations: cryptConfig.keyConfig.iterations,
                hash: cryptConfig.keyConfig.digest,
            },
            passphrasekey,
            { name: cryptConfig.algorithm, length: cryptConfig.keyConfig.keylen },
            true,
            ['decrypt']
        ).catch(function(err){
            console.error('ERROR - while creating key - passphrasekey, pbkdf2salt:', err, passphrasekey, pbkdf2salt);
            return;
        });

        if (!key) {
            return;
        }

        var splitCipherText = cipherText.split(':');
        var ivInHex = splitCipherText[0];
        var iv = WebCrypt.hexToBytes(ivInHex);
        var generatedIv = WebCrypt.byteToUint8Array(WebCrypt.hexToBytes(ivInHex));
        var encryptedHex = splitCipherText[1];
        var encryptedBytes = WebCrypt.byteToUint8Array(WebCrypt.hexToBytes(encryptedHex));

        var decryptedTextBuffer = await window.crypto.subtle.decrypt({ name: cryptConfig.algorithm, iv: generatedIv },
            key, encryptedBytes)
            .catch(function(err) {
                console.error('ERROR - while decrypt - err, key, iv, encryptedText:', err, key, iv, encryptedHex);
                console.debug('generatedIv, encryptedBytes:', generatedIv, encryptedBytes);
                console.debug('iv, generatedIv, ivRaw:', iv, generatedIv, ivRaw);
                console.debug('encryptedHex, encryptedBytes, encryptedTextRaw', encryptedHex, encryptedBytes, encryptedTextRaw);
                return;
            });

        if (!key) {
            return;
        }

        var decryptedTextSrc = WebCrypt.decodeUtf8(decryptedTextBuffer);
        decryptedTextSrc = decryptedTextSrc.replace(/=/g, '');

        var decryptedText = atob(decryptedTextSrc);

        return decryptedText;
    },

    hexToBytes: function(hex) {
        var bytes = [];
        for (var c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }

        return bytes;
    },

    byteToUint8Array: function(byteArray) {
        var uint8Array = new Uint8Array(byteArray.length);
        for(var i = 0; i < uint8Array.length; i++) {
            uint8Array[i] = byteArray[i];
        }

        return uint8Array;
    },

    encodeUtf8: function(src) {
        return new TextEncoder('utf-8').encode(src);
    },

    decodeUtf8: function(src) {
        return new TextDecoder('utf-8').decode(src);
    }
};

var WebLoader = {
    loadAllDocuments: async function(cryptConfig, decompressJsSrc) {
        console.log('START decompress srcs', decompressJsSrc.length);
        for (var i = 0; i < decompressJsSrc.length; i++) {
            var decompressJs = decompressJsSrc[i];
            var jsSrc = await WebLoader.decompressDocument(cryptConfig,decompressJs);
            if (!jsSrc) {
                console.debug('nothing to execute:',  i, decompressJs.name, null);
                continue;
            }

            console.debug('DO eval src bytes:', i, decompressJs.name, jsSrc.length);
            eval(jsSrc);
        }

        console.log('DONE decompress srcs', decompressJsSrc.length);
    },

    decompressDocument: async function(cryptConfig, decompressJs) {
        var decompressJsSrc = decompressJs.src;
        var jsSrc;
        if (decompressJs.crypted) {
            console.debug('decrypt src bytes:', decompressJs.name, decompressJs.iv, decompressJsSrc.length);

            var retry = true;
            var cryptedSrc = decompressJsSrc;
            while (retry) {
                if (cryptConfig.keyConfig.password === undefined) {
                    cryptConfig.keyConfig.password = window.prompt('Bitte geben Sie das Passwort ein:');
                    if (cryptConfig.keyConfig.password === null || cryptConfig.keyConfig.password === '') {
                        var cancel = window.confirm('Sie haben kein Passwort angegeben. Wollen Sie das Laden der Seite wirklich abbrechen?');
                        if (cancel) {
                            console.error('ERROR - user canceled passwort-retry', decompressJs.name);
                            window.alert('Das Laden der Seite wurde abgebrochen.');
                            retry = false;
                            throw new Error('ERROR - user canceled passwort-retry for ' + decompressJs.name);
                        }
                    }
                }

                decompressJsSrc = await WebCrypt.decryptText(cryptConfig, cryptedSrc, decompressJs.ivRaw, decompressJs.encryptedTextRaw);
                if (decompressJsSrc === undefined || decompressJsSrc === null || decompressJsSrc === '') {
                    console.error('ERROR - while loading resource', decompressJs.name, decompressJsSrc);
                    cryptConfig.keyConfig.password = undefined;
                    retry = true;
                    continue;
                }

                retry = false;
                break;
            }

            console.debug('decompress decrypted src bytes:', decompressJs.name, decompressJsSrc.length);
            jsSrc = LZString.decompressFromBase64(decompressJsSrc);
        } else {
            console.debug('decompress src bytes:', decompressJs.name, decompressJsSrc.length);
            jsSrc = LZString.decompressFromBase64(decompressJsSrc);
        }

        if (!jsSrc) {
            console.debug('decompressed src bytes to null:', decompressJs.name, null);
            return jsSrc;
        }

        console.debug('decompressed src bytes:', decompressJs.name, jsSrc.length);
        return jsSrc;
    },
};

var WebImageLoader = {
    loadInlineImages: function() {
        var images = document.getElementsByTagName('img');
        if (!images || images.length === 0) {
            console.warn('no images to inline found', images);
            return;
        }

        var inlineImages = [];
        for (var image of images) {
            if (image.currentSrc.startsWith('data:image')
                && (image.dataset.replacementsrc || image.dataset.replacementfilter)) {
                inlineImages.push(image);
            }
        }

        if (!inlineImages || inlineImages.length === 0) {
            console.warn('no inlineImages to inline found', images, inlineImages);
            return;
        }

        WebImageLoader.addReplaceInlineImageStyle(inlineImages);
    },

    addReplaceInlineImageStyle: function(imgElements) {
        var css = '';
        for (var imgElement of imgElements) {
            css += WebImageLoader.createReplaceInlineImageStyle(imgElement);
        }

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;

        document.getElementsByTagName('head')[0].appendChild(style);

        console.trace('add inlineimage-style', style, css);
    },

    createReplaceInlineImageStyle: function(imgElement) {
        var css = '';
        if (imgElement.dataset.replacementsrc) {
            css += 'img[src*="' + imgElement.dataset.replacementsrc + '"]' +
                ' { content: url(' + imgElement.currentSrc + '); padding-left: 0 !important;}\n';
        }

        if (imgElement.dataset.replacementfilter) {
            css += imgElement.dataset.replacementfilter +
                ' { content: url(' + imgElement.currentSrc + '); padding-left: 0 !important;}\n';
        }
        return css;
    }
};

document.WebCrypt = WebCrypt;
document.WebLoader = WebLoader;
document.WebImageLoader = WebImageLoader;

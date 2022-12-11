import * as Promise_serial from 'promise-serial';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import fs from 'fs';
import path from 'path';

// TODO generalize and move to commons
export class TourDocViewerManagerModule {
    public generateViewerHtmlFile(srcHtmlFile: string, jsonExportFiles: string[], targetHtmlFile: string, chunkSize: number,
                                  parent?: string): Promise<string> {
        const me = this;
        console.log('copy htmlViewer and inline json', srcHtmlFile, targetHtmlFile, jsonExportFiles);
        return FileUtils.copyFile(srcHtmlFile, targetHtmlFile, false, false, true, false)
            .then(() => {
                let html = '';
                try {
                    html = fs.readFileSync(targetHtmlFile, {encoding: 'utf8'});
                } catch (err) {
                    return Promise.reject(err);
                }

                html = me.htmlConfigConverter(html);

                const promises = [];
                for (const jsonExportFile of jsonExportFiles) {
                    const jsonDestDir = path.dirname(jsonExportFile);
                    const jsonBaseFile = path.basename(jsonExportFile).replace(path.extname(jsonExportFile), '');
                    promises.push(
                        function () {
                            return FileUtils.deleteFilesInDirectoryByPattern(jsonDestDir + '/' + jsonBaseFile, '.js')
                                .then(() => {
                                    console.log('split jsonExportFile', jsonExportFile);
                                    return FileUtils.splitJsonFile(jsonExportFile, jsonDestDir + '/' + jsonBaseFile,
                                        '.js',
                                        chunkSize,
                                        parent,
                                        me.jsonToJsTargetContentConverter)
                                }).then((files) => {
                                    for (const file of files) {
                                        html = me.htmlInlineFileConverter(html, file);
                                    }

                                    return Promise.resolve(files);
                                });
                        }
                    );
                }

                return Promise_serial(promises, {parallelize: 1}).then((files) => {
                    try {
                        console.log('write target with inlined files', targetHtmlFile, files);
                        fs.writeFileSync(targetHtmlFile, html);
                    } catch (err) {
                        return Promise.reject(err);
                    }

                    return Promise.resolve(targetHtmlFile);
                }).catch(reason => {
                    return Promise.reject(reason);
                });
            }).catch(reason => {
                return Promise.reject(reason);
            });
    }

    public jsonToJsTargetContentConverter(result: string, resultFileName: string): string {
        result = result.replace(/([`\\])/g, '\\$1');

        return `window.importStaticDataTDocsJsonP = \`\n`
            + result
            +  `\`\nvar script = document.createElement("script");
script.type='application/json';
script.id = '` + path.basename(resultFileName) + `';
var text = document.createTextNode(importStaticDataTDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);`;
    };

    public htmlConfigConverter(html: string): string {
        // removing samples from config
        html = html.replace(/staticTDocsFiles": \[.*"tracksBaseUrl/g,
            'staticTDocsFiles": ["assets/staticdata/samples-static.mytbtdocs_videos_export_chunk0.js"], "tracksBaseUrl');
        // configure assets-path
        html = html.replace(/"tracksBaseUrl": .* "videoBaseUrl": "assets\/staticdata\/"/,
            '"tracksBaseUrl": "./tracks/",    "picsBaseUrl": "./",    "videoBaseUrl": "./"');

        return html
    };

    public htmlInlineFileConverter(html: string, file: string): string {
        const fileName = path.basename(file);
        html = html.replace(/<\/head>/g,
            '\n  <script inlineexport type="text/javascript" src="' + fileName + '"></script>\n</head>');
        html = html.replace(/staticTDocsFiles": \[/,
            'staticTDocsFiles": ["' + fileName + '", ');

        return html;
    }


}

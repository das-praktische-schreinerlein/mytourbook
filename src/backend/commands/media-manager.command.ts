import * as fs from 'fs';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {AbstractCommand} from './abstract.command';
import {MediaManagerModule} from '../modules/media-manager.module';
import {utils} from 'js-data';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import * as os from 'os';

export class MediaManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const searchForm = new SDocSearchForm({ type: 'image', sort: 'dateAsc'});
        const writable = backendConfig['sdocWritable'] === true || backendConfig['sdocWritable'] === 'true';
        const dataService = SDocDataServiceModule.getDataService('sdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        const importDir = argv['importDir'];
        const outputDir = argv['outputDir'];
        const force = argv['force'];
        if (writable) {
            dataService.setWritable(true);
        }
        const imageManagerModule = new MediaManagerModule(backendConfig, dataService, os.tmpdir());

        let promise: Promise<any>;
        switch (action) {
            case 'readImageDates':
                promise = imageManagerModule.readImageDates(searchForm);

                break;
            case 'scaleImages':
                promise = imageManagerModule.scaleImages(searchForm);

                break;
            case 'generateSDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR [-force true/false]');
                    return promise;
                }

                promise = imageManagerModule.generateSDocRecordsFromMediaDir(importDir);
                promise.then(value => {
                    const responseMapper = new SDocAdapterResponseMapper(backendConfig);
                    const sdocs = [];
                    for (const sdoc of value) {
                        sdocs.push(responseMapper.mapToAdapterDocument({}, sdoc));
                    }
                    console.log(JSON.stringify({ sdocs: sdocs}, undefined, ' '));
                });

                break;
            case 'convertVideosFromMediaDirToMP4':
                if (importDir === undefined || outputDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR [--force true/false]',
                        argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR' +
                        ' [--force true/false]');
                    return promise;
                }

                promise = imageManagerModule.convertVideosFromMediaDirToMP4(importDir, outputDir, !force);
                promise.then(value => {
                    console.log('DONE converted files to mp4', value);
                });

                break;
            case 'scaleVideosFromMediaDirToMP4':
                if (importDir === undefined || outputDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR [--force true/false]',
                        argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR' +
                        ' [--force true/false]');
                    return promise;
                }

                promise = imageManagerModule.scaleVideosFromMediaDirToMP4(importDir, outputDir, 600, !force);
                promise.then(value => {
                    console.log('DONE scaled videos', value);
                });

                break;
            case 'generateVideoScreenshotFromMediaDir':
                if (importDir === undefined || outputDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR [--force true/false]',
                        argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR' +
                        ' [--force true/false]');
                    return promise;
                }

                promise = imageManagerModule.generateVideoScreenshotFromMediaDir(importDir, outputDir, 200, !force);
                promise.then(value => {
                    console.log('DONE created screenshot for videos', value);
                });

                break;
            case 'generateVideoPreviewFromMediaDir':
                if (importDir === undefined || outputDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR [--force true/false]',
                        argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputDir OUTPUTDIR' +
                        ' [--force true/false]');
                    return promise;
                }

                promise = imageManagerModule.generateVideoPreviewFromMediaDir(importDir, outputDir, 200, !force);
                promise.then(value => {
                    console.log('DONE created screenshot for videos', value);
                });

                break;
            case 'rotateVideo':
                const srcFile = argv['srcFile'];
                const rotate = argv['rotate'];
                if (srcFile === undefined || rotate === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE --rotate DEGREES', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --srcFile SRCFILE --rotate DEGREES [--force true/false]');
                    return promise;
                }

                promise = imageManagerModule.rotateVideo(srcFile, rotate);
                promise.then(value => {
                    console.log('DONE rotated videos', value);
                });

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }
}

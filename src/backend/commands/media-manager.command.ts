import * as fs from 'fs';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {TourDocMediaManagerModule} from '../modules/tdoc-media-manager.module';
import {utils} from 'js-data';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import * as os from 'os';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {CommonMediaManagerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-media-manager.command';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {FileSystemDBSyncType, ProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-media-manager.module';

export class MediaManagerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        argv['importDir'] = TourDocFileUtils.normalizeCygwinPath(argv['importDir']);
        argv['outputDir'] = TourDocFileUtils.normalizeCygwinPath(argv['outputDir']);

        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const writable = backendConfig['tdocWritable'] === true || backendConfig['tdocWritable'] === 'true';
        const dataService = TourDocDataServiceModule.getDataService('tdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        const importDir = argv['importDir'];
        if (writable) {
            dataService.setWritable(true);
        }
        const mediaManagerModule = new MediaManagerModule(backendConfig['imageMagicAppPath'], os.tmpdir());
        const tdocManagerModule = new TourDocMediaManagerModule(backendConfig, dataService, mediaManagerModule);
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);

        let promise: Promise<any>;
        let searchForm: TourDocSearchForm;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10)
        };
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        switch (action) {
            case 'readImageDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);
                break;
            case 'readVideoDates':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new TourDocSearchForm({ type: 'video', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: readMediaDates', searchForm, processingOptions);

                promise = tdocManagerModule.readAndUpdateMediaDates(searchForm, processingOptions);

                break;
            case 'scaleImages':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 5;
                searchForm = new TourDocSearchForm({ type: 'image', sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1});
                console.log('START processing: scaleImages', searchForm, processingOptions);

                promise = tdocManagerModule.scaleImagesToDefaultWidth(searchForm, processingOptions);

                break;
            case 'generateTourDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR [-force true/false]');
                    return promise;
                }

                console.log('START processing: generateTourDocRecordsFromMediaDir', importDir);

                promise = tdocManagerModule.generateTourDocRecordsFromMediaDir(importDir);
                promise.then(value => {
                    const responseMapper = new TourDocAdapterResponseMapper(backendConfig);
                    const tdocs = [];
                    for (const tdoc of value) {
                        tdocs.push(responseMapper.mapToAdapterDocument({}, tdoc));
                    }
                    console.log(JSON.stringify({ tdocs: tdocs}, undefined, ' '));
                });

                break;
            case 'findCorrespondingTourDocRecordsForMedia':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = utils.reject(action + ' missing parameter - usage: --importDir INPUTDIR');
                    return promise;
                }

                const additionalMappingsJson = argv['additionalMappingsFile'];
                console.log('START processing: findCorrespondingTourDocRecordsForMedia', additionalMappingsJson);

                let additionalMappings: {[key: string]: FileSystemDBSyncType};
                if (additionalMappingsJson) {
                    additionalMappings = {};
                    const additionalMappingsSrc = JSON.parse(fs.readFileSync(additionalMappingsJson, {encoding: 'utf8'}));
                    if (additionalMappingsSrc['files']) {
                        const possibleLocalPaths = [];
                        ['full', 'x100', 'x300', 'x600', 'x1400'].forEach(resolution => {
                            const path = backendConfig['apiRoutePicturesStaticDir'] + '/' +
                                (backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + resolution + '/';
                            possibleLocalPaths.push(path);
                            possibleLocalPaths.push(path.replace(/[\\\/]+/g, '/'));
                            possibleLocalPaths.push(path.toLowerCase());
                            possibleLocalPaths.push(path.replace(/[\\\/]+/g, '/').toLowerCase());
                        });
                        const fileRecords: FileSystemDBSyncType[] = additionalMappingsSrc['files'];
                        fileRecords.forEach(fileRecord => {
                            fileRecord.records.forEach(record => {
                                record.dir = record.dir.replace(/[\\\/]+/g, '/');
                                possibleLocalPaths.forEach(possibleLocalPath => {
                                    record.dir = record.dir.replace(possibleLocalPath, '');
                                });
                            });
                            const fileInfoKey = (fileRecord.file.dir + '/' + fileRecord.file.name).replace(/[\\\/]+/g, '/');
                            additionalMappings[fileInfoKey.toLowerCase()] = fileRecord;
                        });
                    }
                }

                promise = tdocManagerModule.findCorrespondingCommonDocRecordsForMedia(importDir, additionalMappings);
                promise.then(value => {
                    console.log(JSON.stringify({
                        tdocs: value,
                        fileBaseDir: importDir,
                        dbImageBaseDir: backendConfig['apiRoutePicturesStaticDir'] + '/' +
                            (backendConfig['apiRouteStoredPicturesResolutionPrefix'] || '') + 'full/',
                        dbVideoBaseDir: backendConfig['apiRouteVideosStaticDir'] + '/'
                            + (backendConfig['apiRouteStoredVideosResolutionPrefix'] || '') + 'full/'
                    }, undefined, ' '));
                });

                break;
            default:
                return commonMediadManagerCommand.process(argv);
        }

        return promise;
    }
}

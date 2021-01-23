import * as readdirp from 'readdirp';
import * as pathLib from 'path';
import {Mapper} from 'js-data';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {BackendConfigType} from './backend.commons';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import fs from 'fs';
import {
    MediaImportFileCheckType,
    MediaImportFileContainerType,
    MediaImportRecordContainerType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-musicfile-import.service';
import {Adapter} from 'js-data-adapter';
import * as Promise_serial from 'promise-serial';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';

export interface TourMediaImportContainerType {
    FILES: MediaImportFileContainerType;
    TRACK: MediaImportRecordContainerType | TourDocRecord;
    LOCATION: MediaImportRecordContainerType | TourDocRecord;
    IMAGE: MediaImportRecordContainerType | TourDocRecord;
    VIDEO: MediaImportRecordContainerType | TourDocRecord;
}

export class TourDocMediaFileImportManager  {
    protected readonly backendConfig: BackendConfigType;
    protected readonly dataService: TourDocDataService;

    constructor(backendConfig: BackendConfigType, dataService: TourDocDataService,
                protected skipCheckForExistingFilesInDataBase: boolean) {
        this.backendConfig = backendConfig;
        this.dataService = dataService;
    }

    public generateTourDocRecordsFromMediaDir(baseDir: string, mediaTypes: {}): Promise<TourDocRecord[]> {
        const me = this;
        const mapper: Mapper = this.dataService.getMapper('tdoc');
        const responseMapper = new TourDocAdapterResponseMapper(this.backendConfig);
        const fileExtensions = [];
        for (const mediaType in mediaTypes) {
            if (!mediaTypes.hasOwnProperty(mediaType)) {
                continue;
            }

            fileExtensions.push('*.' + mediaType);
        }
        const settings = {
            root: baseDir,
            entryType: 'files',
            // Filter files with js and json extension
            fileFilter: fileExtensions,
            // Filter by directory
            directoryFilter: [ '!.git', '!*modules' ],
            // Work with files up to 1 subdirectory deep
            depth: 10
        };
        const container: TourMediaImportContainerType = {
            FILES: {},
            IMAGE: {},
            LOCATION: {},
            TRACK: {},
            VIDEO: {}
        }

        return new Promise<TourDocRecord[]>((allresolve, allreject) => {
            readdirp(settings, function fileCallBack(fileRes) {
                const path = fileRes['path'].replace(/\\/g, '/');
                const extension = pathLib.extname(path).replace('.', '');
                if (mediaTypes[extension] === undefined) {
                    console.warn('SKIP file - unknown extension', extension, path);
                    return;
                }

                if (container.FILES[path]) {
                    return;
                }
                container.FILES[path] = fileRes;
            }, function allCallBack(errors) {
                me.generateTourDocForImportContainer(container, mediaTypes, mapper, responseMapper).then(records => {
                    return allresolve(records);
                }).catch(reason => {
                    return allreject(reason);
                });

                if (errors) {
                    errors.forEach(function (err) {
                        return allreject(err);
                    });
                }
            });
        });
    }

    private generateTourDocForImportContainer(container: TourMediaImportContainerType, mediaTypes: {},
                                              mapper: Mapper, responseMapper: TourDocAdapterResponseMapper): Promise<TourDocRecord[]> {
        const me = this;
        const funcs = [];
        const records: TourDocRecord[] = [];
        for (let path in container.FILES) {
            if (!container.FILES.hasOwnProperty(path)) {
                continue;
            }

            console.warn('check path', path);
            path = path.replace(/\\/g, '/');
            const extension = pathLib.extname(path).replace('.', '');
            const type = mediaTypes[extension];
            if (type === undefined) {
                console.warn('SKIP file - unknown mediaTypes', mediaTypes[extension], extension, path);
                continue;
            }

            funcs.push(function () {
                return new Promise<string>((processorResolve) => {
                    return me.checkMediaFile(path, type).then(checkFileResult => {
                        if (!checkFileResult.readyToImport) {
                            console.warn('SKIPPING file: ' + path, checkFileResult);
                            processorResolve(path);
                            return Promise.resolve();
                        }

                        return me.createRecordsForMediaData(mapper, responseMapper, path, records,
                            container, container.FILES[path]['stat'], type).then(() => {
                            processorResolve(path);
                            return Promise.resolve();
                        });
                    }).catch(err => {
                        console.error('error while checking file: ' + path, err);
                        processorResolve(path);
                        return Promise.resolve();
                    });
                });
            });
        }

        return Promise_serial(funcs, {parallelize: 1}).then(() => {
            return Promise.resolve(records);
        }).catch(function errorSearch(reason) {
            console.error('generateMediaDocRecordsFromMediaDir failed:', reason);
            return Promise.reject(reason);
        });
    }

    public createRecordsForMediaData(mapper: Mapper, responseMapper: GenericAdapterResponseMapper, path: string, records: TourDocRecord[],
                                     container: TourMediaImportContainerType, fileStats: fs.Stats, type: string): Promise<{}> {
        const file = pathLib.basename(path);
        const dir = pathLib.dirname(path);
        const date = fileStats.mtime;
        const values = {
            datestart_dt: date,
            dateend_dt: date,
            dateshow_dt: date
        };
        let trackName = dir || file;
        let locationName = dir || file;

        // normalize trackName
        let dateStr = '';
        const matcher = trackName.match(/(\d\d\d\d)(\d\d)(\d\d){0,1}-(.*)?/);
        if (matcher) {
            dateStr = (matcher[3] ? matcher[3] + '.' : '') + matcher[2] + '.' + matcher[1];
            locationName = (matcher[4] ? matcher[4] : 'Unbekannt');
        }

        // normalize locationName
        const words = locationName.split('-');
        locationName = '';
        for (let word of words) {
            word = word.substring(0, 1).toUpperCase() + word.substring(1);
            locationName = locationName.concat(word).concat(' ');
        }
        locationName = locationName.trim();
        trackName = (locationName + ' ' + dateStr).trim();

        let location: TourDocRecord = container.LOCATION[locationName];
        if (location === undefined) {
            location = <TourDocRecord>responseMapper.mapResponseDocument(mapper, {
                type_s: 'LOCATION',
                id: 'LOCATION_' + (records.length + 1),
                loc_id_i: records.length + 1,
                name_s: locationName,
                keywords_txt: 'KW_TODOKEYWORDS',
                desc_txt: 'TODODESC'
            }, {});
            records.push(location);
            container.LOCATION[locationName] = location;
        }
        values['loc_id_i'] = location.locId;

        let track: TourDocRecord = container.TRACK[trackName];
        if (track === undefined) {
            track = <TourDocRecord>responseMapper.mapResponseDocument(mapper, {
                type_s: 'TRACK',
                id: 'TRACK_' + (records.length + 1),
                track_id_i: records.length + 1,
                loc_id_i: location.locId,
                name_s: trackName,
                keywords_txt: 'KW_TODOKEYWORDS',
                desc_txt: 'TODODESC',
                dateshow_dt: date,
                datestart_dt: date,
                dateend_dt: date
            }, {});
            records.push(track);
            container.TRACK[trackName] = track;
        }
        values['track_id_i'] = track.trackId;
        if (DateUtils.parseDate(track.datestart).getTime() > DateUtils.parseDate(date).getTime()) {
            track.datestart = date;
        }
        if (DateUtils.parseDate(track.dateend).getTime() < DateUtils.parseDate(date).getTime()) {
            track.dateend = date;
        }

        if (type === 'IMAGE') {
            values['i_fav_url_txt'] = path;
            values['image_id_i'] = records.length + 1;
        }
        if (type === 'VIDEO') {
            values['v_fav_url_txt'] = path;
            values['video_id_i'] = records.length + 1;
        }
        values['type_s'] = type;
        values['id'] = type + '_' + (records.length + 1);
        values['name_s'] = trackName + ' ' + DateUtils.formatDateTime(date);
        const tdoc = <TourDocRecord>responseMapper.mapResponseDocument(mapper, values, {});
        container[type][path] = tdoc;
        records.push(tdoc);

        return Promise.resolve(values);
    }

    public checkMediaFile(path: string, type):
        Promise<MediaImportFileCheckType> {
        if (this.skipCheckForExistingFilesInDataBase) {
            return Promise.resolve({ readyToImport: true, hint: 'skipped database-check'});
        }

        const mapper: Mapper = this.dataService.getMapper(this.dataService.getBaseMapperName());
        const adapter: Adapter = this.dataService.getAdapterForMapper(this.dataService.getBaseMapperName());
        let query;

        switch (type.toLowerCase()) {
            case 'image':
                query = {
                    where: {
                        i_fav_url_txt: {
                            'in': [path]
                        },
                        type_txt: {
                            'in': ['image']
                        }
                    }
                };
                break;
            case 'video':
                query = {
                    where: {
                        v_fav_url_txt: {
                            'in': [path]
                        },
                        type_txt: {
                            'in': ['video']
                        }
                    }
                };
                break;
            default:
                return Promise.reject('unknown type for file:' + type);
        }

        return adapter.findAll(mapper, query, undefined)
            .then(value => {
                if (value.length > 0) {
                    return Promise.resolve({ readyToImport: false, hint: 'file already exits in database'});
                }

                return Promise.resolve({ readyToImport: true, hint: 'file not exits in database'});
            });
    }

}

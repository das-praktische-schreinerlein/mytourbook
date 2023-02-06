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
import {BaseMediaMetaRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basemediameta-record';
import * as ffmpeg from 'fluent-ffmpeg';
import {FfprobeData} from 'fluent-ffmpeg';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {DescValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {TourDocMediaMetaRecordFactory} from '../shared/tdoc-commons/model/records/tdocmediameta-record';

export interface TourMediaImportContainerType {
    FILES: MediaImportFileContainerType;
    TRACK: MediaImportRecordContainerType | TourDocRecord;
    LOCATION: MediaImportRecordContainerType | TourDocRecord;
    IMAGE: MediaImportRecordContainerType | TourDocRecord;
    VIDEO: MediaImportRecordContainerType | TourDocRecord;
}

// tslint:disable:no-console
export class TourDocMediaFileImportManager  {
    protected readonly backendConfig: BackendConfigType;
    protected readonly dataService: TourDocDataService;
    protected readonly mediaManager: MediaManagerModule;
    protected readonly jsonValidationRule = new DescValidationRule(false);

    constructor(backendConfig: BackendConfigType, dataService: TourDocDataService, mediaManager: MediaManagerModule,
                protected skipCheckForExistingFilesInDataBase: boolean) {
        this.backendConfig = backendConfig;
        this.dataService = dataService;
        this.mediaManager = mediaManager;
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

    public generateTourDocForImportContainer(container: TourMediaImportContainerType, mediaTypes: {},
                                             mapper: Mapper, responseMapper: TourDocAdapterResponseMapper): Promise<TourDocRecord[]> {
        const me = this;
        const funcs = [];
        const records: TourDocRecord[] = [];
        if (this.skipCheckForExistingFilesInDataBase) {
            console.warn('SKIP databasecheck', this.skipCheckForExistingFilesInDataBase);
        }

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
                return new Promise<string>((processorResolve, processorReject) => {
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
                        processorReject(err);
                        return Promise.reject();
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
        const mediaMeta = TourDocMediaMetaRecordFactory.createSanitized({ fileName: path});
        switch (type) {
            case 'IMAGE':
                const absoluteImagePath = (<BackendConfigType>this.backendConfig).apiRoutePicturesStaticDir + '/pics_full/' + path;
                return this.readExifForCommonDocImageFile(absoluteImagePath).then(exifData => {
                    return this.mapImageDataToMediaMetaDoc('new', absoluteImagePath, mediaMeta, exifData);
                }).then(() => {
                    return this.createRecordsForMediaMetaData(mapper, responseMapper, records, container, mediaMeta, type);
                });
            case 'VIDEO':
                const absoluteVideoPath = (<BackendConfigType>this.backendConfig).apiRouteVideosStaticDir + '/video_full/' + path;
                return this.readMetadataForCommonDocVideoFile(absoluteVideoPath).then(videoMetaData => {
                    return this.mapVideoDataToMediaMetaDoc('new', absoluteVideoPath, mediaMeta, videoMetaData);
                }).then(() => {
                    return this.createRecordsForMediaMetaData(mapper, responseMapper, records, container, mediaMeta, type);
                });
            default:
                return Promise.reject('unknown mediatype:' + type + ' for path:' + path);
        }
    }

    public createRecordsForMediaMetaData(mapper: Mapper, responseMapper: GenericAdapterResponseMapper, records: TourDocRecord[],
                                         container: TourMediaImportContainerType, mediaMeta: BaseMediaMetaRecordType, type: string): Promise<{}> {

        const date = DateUtils.parseDate(mediaMeta.recordingDate || mediaMeta.fileCreated);
        const mediaValues = {
            datestart_dt: date,
            dateend_dt: date,
            dateshow_dt: date
        };

        // location
        let locationName = pathLib.dirname(mediaMeta.fileName) || pathLib.basename(mediaMeta.fileName);
        let dateStr = '';
        const matcher = locationName.match(/(\d\d\d\d)(\d\d)(\d\d){0,1}-(.*)?/);
        if (matcher) {
            dateStr = (matcher[3] ? matcher[3] + '.' : '') + matcher[2] + '.' + matcher[1];
            locationName = (matcher[4] ? matcher[4] : 'Unbekannt');
        }

        const words = locationName.split('-');
        locationName = '';
        for (let word of words) {
            word = word.substring(0, 1).toUpperCase() + word.substring(1);
            locationName = locationName.concat(word).concat(' ');
        }
        locationName = locationName.trim();

        let location: TourDocRecord = container.LOCATION[locationName];
        if (location === undefined) {
            location = <TourDocRecord>responseMapper.mapResponseDocument(mapper, {
                type_s: 'LOCATION',
                id: 'LOCATION_' + (records.length + 1),
                loc_id_i: records.length + 1,
                name_s: locationName,
                keywords_txt: 'KW_TODOKEYWORDS',
                desc_txt: 'TODODESC',
                gpstracks_state_i: 0
            }, {});
            records.push(location);
            container.LOCATION[locationName] = location;
        }
        mediaValues['loc_id_i'] = location.locId;

        // trackdata
        const trackName = (locationName + ' ' + dateStr).trim();
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
                dateend_dt: date,
                gpstracks_state_i: 0
            }, {});
            records.push(track);
            container.TRACK[trackName] = track;
        }
        mediaValues['track_id_i'] = track.trackId;

        if (DateUtils.parseDate(track.datestart).getTime() > DateUtils.parseDate(date).getTime()) {
            track.datestart = date;
        }
        if (DateUtils.parseDate(track.dateend).getTime() < DateUtils.parseDate(date).getTime()) {
            track.dateend = date;
        }

        // mediadata
        switch (type) {
            case 'IMAGE':
                mediaValues['i_fav_url_txt'] = mediaMeta.fileName;
                mediaValues['image_id_i'] = records.length + 1;
                break;
            case'VIDEO':
                mediaValues['v_fav_url_txt'] = mediaMeta.fileName;
                mediaValues['video_id_i'] = records.length + 1;
                break;
        }

        mediaValues['type_s'] = type;
        mediaValues['id'] = type + '_' + (records.length + 1);
        mediaValues['name_s'] = trackName + ' ' + DateUtils.formatDateTime(date);

        mediaValues['mediameta_duration_i'] = mediaMeta.dur;
        mediaValues['mediameta_filesize_i'] = mediaMeta.fileSize;
        mediaValues['mediameta_filesize_i'] = mediaMeta.fileSize;
        mediaValues['mediameta_filecreated_dt'] = mediaMeta.fileCreated;
        mediaValues['mediameta_metadata_txt'] = mediaMeta.metadata;
        mediaValues['mediameta_recordingdate_dt'] = mediaMeta.recordingDate;
        mediaValues['mediameta_resolution_s'] = mediaMeta.resolution;

        const tdoc = <TourDocRecord>responseMapper.mapResponseDocument(mapper, mediaValues, {});
        container[type][mediaMeta.fileName] = tdoc;
        records.push(tdoc);

        return Promise.resolve(mediaValues);
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
                            'in': [path, path.toLowerCase()]
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
                            'in': [path, path.toLowerCase()]
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

    // TODO move to commons mediaFileImportManager
    public mapImageDataToMediaMetaDoc(reference: string, fullFilePath: string, mediaMeta: BaseMediaMetaRecordType,
                                      exifData: {}): boolean {
        let updateFlag = false;
        const fileNameDate = this.extractDateFromFileName(fullFilePath);
        if (fileNameDate) {
            console.debug('mapImageDataToMediaMetaDoc: use fileNameDate as recordingDate for id', reference,
                fileNameDate, fullFilePath);
        }

        if (exifData) {
            // see https://exiv2.org/tags.html
            const newResolution = this.extractImageResolution(exifData);
            if (mediaMeta.resolution !== newResolution) {
                console.debug('mapMetaDataToImageDoc: resolution changed for id old/new', reference, mediaMeta.resolution, newResolution);

                updateFlag = true;
                mediaMeta.resolution = newResolution;
            }

            const newRecordingDate = fileNameDate || this.extractImageRecordingDate(exifData);
            if (DateUtils.dateToLocalISOString(mediaMeta.recordingDate) !== DateUtils.dateToLocalISOString(newRecordingDate)) {
                console.debug('mapMetaDataToImageDoc: recordingDate changed for id old/new',
                    reference, mediaMeta.recordingDate, newRecordingDate);

                updateFlag = true;
                mediaMeta.recordingDate = DateUtils.dateToLocalISOString(newRecordingDate);
            }
        } else {
            mediaMeta.resolution = undefined;
            mediaMeta.recordingDate = fileNameDate;
            console.debug('mapMetaDataToImageDoc: metadata empty so reset resolution/recordingDate for id old/new', reference);
        }

        const metadata = this.prepareImageMetadata(exifData);
        updateFlag = this.mapMetaDataToCommonMediaDoc(fullFilePath, mediaMeta, metadata, reference) || updateFlag;

        return updateFlag;
    }

    // TODO move to commons mediaFileImportManager
    public mapVideoDataToMediaMetaDoc(reference: string, fullFilePath: string, mediaMeta: BaseMediaMetaRecordType,
                                      videoMetaData: FfprobeData): boolean {
        let updateFlag = false;
        const fileNameDate = this.extractDateFromFileName(fullFilePath);
        if (fileNameDate) {
            console.debug('mapVideoDataToMediaMetaDoc: use fileNameDate as recordingDate for id', reference,
                fileNameDate, fullFilePath);
        }

        if (videoMetaData) {
            const newResolution = this.extractVideoResolution(videoMetaData);
            if (mediaMeta.resolution !== newResolution) {
                console.debug('mapVideoDataToMediaMetaDoc: resolution changed for id old/new',
                    reference, mediaMeta.resolution, newResolution);

                updateFlag = true;
                mediaMeta.resolution = newResolution;
            }

            const newRecordingDate = fileNameDate || this.extractVideoRecordingDate(videoMetaData);
            if (DateUtils.dateToLocalISOString(mediaMeta.recordingDate) !== DateUtils.dateToLocalISOString(newRecordingDate)) {
                console.debug('mapVideoDataToMediaMetaDoc: recordingDate changed for id old/new', reference,
                    mediaMeta.recordingDate, newRecordingDate);

                updateFlag = true;
                mediaMeta.recordingDate = DateUtils.dateToLocalISOString(newRecordingDate);
            }

            const newDuration = this.extractVideoDuration(videoMetaData);
            if (mediaMeta.dur !== newDuration) {
                console.debug('mapVideoDataToMediaMetaDoc: duration changed for id old/new', reference, mediaMeta.dur, newDuration);

                updateFlag = true;
                mediaMeta.dur = newDuration;
            }
        } else {
            mediaMeta.dur = undefined;
            mediaMeta.resolution = undefined;
            mediaMeta.recordingDate = fileNameDate;
            console.debug('mapVideoDataToMediaMetaDoc: metadata empty so reset duration/resolution/recordingDate for id old/new',
                reference);
        }

        const metadata = this.prepareVideoMetadata(videoMetaData)
        updateFlag = this.mapMetaDataToCommonMediaDoc(fullFilePath, mediaMeta, metadata, reference) || updateFlag;

        return updateFlag;
    }

    // TODO move to commons mediaFileImportManager
    public mapMetaDataToCommonMediaDoc(mediaFilePath: string, mediaMeta: BaseMediaMetaRecordType, metadata: any,
                                       reference: string) {
        let updateFlag = false;
        const newMetadata = metadata
            ? this.jsonValidationRule.sanitize(
                this.jsonStringify(metadata, undefined, undefined, 20)
                    .replace('\\n', ' ')
                    .replace('\\r', '')
            )
            : undefined;

        const fileStats = fs.statSync(mediaFilePath)
        const newFilesize = fileStats
            ? fileStats.size
            : undefined;
        const newFilecreated = fileStats
            ? fileStats.mtime
            : undefined;

        if (mediaMeta.metadata !== newMetadata) {
            console.debug('mapMetaDataToCommonMediaDoc: metadata changed for id old/new', reference,
                '\n   OLD:\n', mediaMeta.metadata,
                '\n   NEW:\n', newMetadata);

            updateFlag = true;
            mediaMeta.metadata = newMetadata || ''; // set to empty string to identify metaadata as processed
        }

        if (mediaMeta.fileSize !== newFilesize) {
            console.debug('mapMetaDataToCommonMediaDoc: fileSize changed for id old/new', reference, mediaMeta.fileSize, newFilesize);

            updateFlag = true;
            mediaMeta.fileSize = newFilesize;
        }

        if (DateUtils.dateToLocalISOString(mediaMeta.fileCreated) !== DateUtils.dateToLocalISOString(newFilecreated)) {
            console.debug('mapMetaDataToCommonMediaDoc: fileCreated changed for id old/new', reference, mediaMeta.fileCreated,
                newFilecreated, DateUtils.dateToLocalISOString(mediaMeta.fileCreated), DateUtils.dateToLocalISOString(newFilecreated));

            updateFlag = true;
            mediaMeta.fileCreated = DateUtils.dateToLocalISOString(newFilecreated);
        }

        return updateFlag;
    }

    // TODO move to commons mediaFileImportManager
    public prepareVideoMetadata(videoMetaData: FfprobeData): FfprobeData {
        if (!videoMetaData) {
            return undefined;
        }

        if (BeanUtils.getValue(videoMetaData, 'format.filename')) {
            videoMetaData['format']['filename'] = undefined;
        }

        return videoMetaData;
    }

    // TODO move to commons mediaFileImportManager
    public extractVideoResolution(videoMetaData: FfprobeData) {
        return (videoMetaData.streams
            && videoMetaData.streams.length > 0
            && videoMetaData.streams[0].width > 0
            && videoMetaData.streams[0].height > 0)
            ? videoMetaData.streams[0].width + 'x' + videoMetaData.streams[0].height
            : undefined;
    }

    // TODO move to commons
    public extractVideoRecordingDate(videoMetaData: FfprobeData): Date {
        const creationDate = videoMetaData.format && videoMetaData.format.tags['creation_time']
            ? new Date(videoMetaData.format.tags['creation_time'])
            : undefined
        if (creationDate === undefined || creationDate === null) {
            return undefined
        }

        const localDate = new Date();
        localDate.setHours(creationDate.getUTCHours(), creationDate.getUTCMinutes(), creationDate.getUTCSeconds(), 0)
        localDate.setFullYear(creationDate.getUTCFullYear(), creationDate.getUTCMonth(), creationDate.getUTCDate());

        return localDate;
    }

    // TODO move to commons mediaFileImportManager
    public extractVideoDuration(videoMetaData: FfprobeData): number {
        return videoMetaData.format && videoMetaData.format.duration
            ? Math.ceil(videoMetaData.format.duration)
            : undefined;
    }

    // TODO move to commons mediaFileImportManager
    public prepareImageMetadata(exifData: {}): {} {
        if (!exifData) {
            return undefined;
        }

        if (BeanUtils.getValue(exifData, 'image.PrintIM')) {
            exifData['image']['PrintIM'] = undefined;
        }
        if (BeanUtils.getValue(exifData, 'exif.MakerNote')) {
            exifData['exif']['MakerNote'] = '...';
        }
        if (BeanUtils.getValue(exifData, 'exif.UserComment')) {
            exifData['exif']['UserComment'] = '...';
        }

        return exifData;
    }

    // TODO move to commons mediaFileImportManager
    public extractImageResolution(exifData: {}) {
        if  (BeanUtils.getValue(exifData, 'nativeImage.width') > 0
            && BeanUtils.getValue(exifData, 'nativeImage.height') > 0) {
            return BeanUtils.getValue(exifData, 'nativeImage.width')
                + 'x'
                + BeanUtils.getValue(exifData, 'nativeImage.height')
        }

        if  (BeanUtils.getValue(exifData, 'image.ImageWidth') > 0
            && BeanUtils.getValue(exifData, 'image.ImageHeight') > 0) {
            return BeanUtils.getValue(exifData, 'image.ImageWidth')
                + 'x'
                + BeanUtils.getValue(exifData, 'image.ImageHeight')
        }

        return (BeanUtils.getValue(exifData, 'exif.PixelXDimension') > 0
            && BeanUtils.getValue(exifData, 'exif.PixelYDimension') > 0)
            ? BeanUtils.getValue(exifData, 'exif.PixelXDimension')
            + 'x'
            + BeanUtils.getValue(exifData, 'exif.PixelYDimension')
            : undefined;
    }

    // TODO move to commons mediaFileImportManager
    public extractImageRecordingDate(exifData: {}): Date {
        let creationDate = BeanUtils.getValue(exifData, 'exif.DateTimeOriginal');
        if ((creationDate === undefined || creationDate === null) && BeanUtils.getValue(exifData, 'format.tags.creation_time')) {
            creationDate = new Date(BeanUtils.getValue(exifData, 'format.tags.creation_time'));
        }

        if (creationDate === undefined || creationDate === null) {
            return undefined
        }

        const localDate = new Date();
        localDate.setHours(creationDate.getUTCHours(), creationDate.getUTCMinutes(), creationDate.getUTCSeconds(), 0);
        localDate.setFullYear(creationDate.getUTCFullYear(), creationDate.getUTCMonth(), creationDate.getUTCDate());

        return localDate;
    }

    protected readExifForCommonDocImageFile(fileName: string): Promise<{}> {
        return this.mediaManager.readExifForImage(fileName);
    }

    protected readMetadataForCommonDocImageFile(fileName: string): Promise<{}> {
        return this.mediaManager.readMetadataForImage(fileName);
    }

    protected readMetadataForCommonDocVideoFile(fileName): Promise<FfprobeData> {
        return new Promise<FfprobeData>((resolve, reject) => {
            ffmpeg.ffprobe(fileName,
                function(err, metadata) {
                    if (err) {
                        reject('error while reading video-metadata: ' + err);
                    }

                    resolve(metadata);
                });
        });
    }

    public extractDateFromFileName(fileName: string): Date {
        if (fileName && fileName.length > 10) {
            const matcher = pathLib.parse(fileName).name.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
            if (matcher) {
                const fileNameDate = new Date();
                fileNameDate.setHours(Number(matcher[4]), Number(matcher[5]), Number(matcher[6]), 0)
                fileNameDate.setFullYear(Number(matcher[1]), Number(matcher[2]) - 1, Number(matcher[3]));
                return fileNameDate;
            }
        }

        return undefined;
    }

    // TODO move to BeanUtils
    public jsonStringify(object: any, whiteList ?: string[], blackList ?: string[], removeBuffersGreaterThan ?: number): string {
        if (!object) {
            return undefined;
        }

        return JSON.stringify(object, (key, value) => {
            if (value === null || value === undefined) {
                return undefined;
            }

            if (whiteList && whiteList.length > 0 && !whiteList.includes(key)) {
                return undefined;
            }

            if (blackList && blackList.length > 0 && blackList.includes(key)) {
                return undefined;
            }

            if (removeBuffersGreaterThan !== undefined && removeBuffersGreaterThan > -1 &&
                (
                    (value['type'] === 'Buffer' && value['data'] && value['data'].length > removeBuffersGreaterThan) ||
                    (Buffer.isBuffer(value) && value.length > removeBuffersGreaterThan)
                )) {
                return undefined;
            }

            if ((typeof value === 'string' || value instanceof String)) {
                value = value.trim();
            }

            return value;
        });
    }

}

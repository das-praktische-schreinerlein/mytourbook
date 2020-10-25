import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocServerPlaylistService} from './tdoc-serverplaylist.service';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocMediaFileExportManager} from './tdoc-mediafile-export.service';
import {
    CommonDocDocExportService,
    ExportProcessingResult,
    ExportProcessingResultMediaFileMappingsType,
    ExportProcessingResultRecordFieldMappingsType
} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {
    MediaExportProcessingOptions,
    MediaExportResolution
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';

export enum MediaExportResolutionProfiles {
    'all' = 'all',
    'prod'= 'prod',
    'fullonly' = 'fullonly',
    'default' = 'default'
}

export class TourDocExportService extends CommonDocDocExportService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService, TourDocServerPlaylistService> {
    protected readonly playlistService: TourDocServerPlaylistService;
    protected readonly dataService: TourDocDataService;
    protected readonly responseMapper: GenericAdapterResponseMapper;
    protected readonly mediaFileExportManager: TourDocMediaFileExportManager;

    constructor(backendConfig, dataService: TourDocDataService, playlistService: TourDocServerPlaylistService,
                mediaFileExportManager: TourDocMediaFileExportManager, responseMapper: TourDocAdapterResponseMapper) {
        super(backendConfig, dataService, playlistService, responseMapper);
        this.mediaFileExportManager = mediaFileExportManager;
    }

    public exportMediaRecordFiles(tdoc: TourDocRecord, processingOptions: MediaExportProcessingOptions,
                                  exportResults: ExportProcessingResult<TourDocRecord>[])
        : Promise<ExportProcessingResult<TourDocRecord>> {
        if (tdoc === undefined) {
            return Promise.reject('tdoc required');
        }

        const me = this;
        const imageResolutions: MediaExportResolution[] = [];
        const videoResolutions: MediaExportResolution[] = [];
        switch (processingOptions.resolutionProfile) {
            case undefined:
            case MediaExportResolutionProfiles.all:
            case MediaExportResolutionProfiles.default:
                imageResolutions.push(
                    { pathPrefix: 'pics_full'},
                    { pathPrefix: 'pics_x100'},
                    { pathPrefix: 'pics_x300'},
                    { pathPrefix: 'pics_x600'}
                );
                videoResolutions.push(
                    { pathPrefix: 'video_full'},
                    { pathPrefix: 'video_screenshot', fileNameSuffix: '.jpg'},
                    { pathPrefix: 'video_thumbnail', fileNameSuffix: '.gif'},
                    { pathPrefix: 'video_x600'}
                )
                break;
            case MediaExportResolutionProfiles.prod:
                imageResolutions.push(
                    { pathPrefix: 'pics_x100'},
                    { pathPrefix: 'pics_x300'},
                    { pathPrefix: 'pics_x600'}
                );
                videoResolutions.push(
                    { pathPrefix: 'video_screenshot', fileNameSuffix: '.jpg'},
                    { pathPrefix: 'video_thumbnail', fileNameSuffix: '.gif'},
                    { pathPrefix: 'video_x600'}
                )
                break;
            case MediaExportResolutionProfiles.fullonly:
                imageResolutions.push(
                    { pathPrefix: 'pics_full'}
                );
                videoResolutions.push(
                    { pathPrefix: 'video_full'}
                )
        }
        const mediaExportProcessingOptions: MediaExportProcessingOptions = {
            ...processingOptions,
            imageResolutions: imageResolutions,
            videoResolutions: videoResolutions
        }
        switch (tdoc.type) {
            case 'IMAGE':
                return me.mediaFileExportManager.exportMediaRecordFiles(tdoc, mediaExportProcessingOptions).then(
                    exportResult => {
                        exportResults.push(exportResult);
                        return Promise.resolve(exportResult);
                    })
            case 'VIDEO':
                return me.mediaFileExportManager.exportMediaRecordFiles(tdoc, mediaExportProcessingOptions).then(
                    exportResult => {
                        exportResults.push(exportResult);
                        return Promise.resolve(exportResult);
                    })
        }

        return Promise.reject('unknown type: ' + tdoc.type + ' for id: ' + tdoc.id);
    }

    protected generatePlaylistEntry(tdoc: TourDocRecord, file: string): string {
        switch (tdoc.type) {
            case 'IMAGE':
                return this.mediaFileExportManager.generatePlaylistEntry(tdoc, tdoc.get('tdocimages')[0], 'image', file);
            case 'VIDEO':
                return this.mediaFileExportManager.generatePlaylistEntry(tdoc, tdoc.get('tdocvideos')[0], 'video', file);
        }
    }

    protected checkIdToRead(doc: TourDocRecord, idsRead: {}): any[] {
        for (const type of ['IMAGE', 'VIDEO', 'TRACK', 'LOCATION', 'ROUTE', 'INFO', 'TRIP', 'NEWS']) {
            if (idsRead[type] === undefined) {
                idsRead[type] = {};
            }
        }

        const idsToRead = [];
        if (doc.imageId && !idsRead['IMAGE']['IMAGE_' + doc.imageId]) {
            idsToRead.push('IMAGE_' + doc.imageId);
        }
        if (doc.videoId && !idsRead['VIDEO']['VIDEO_' + doc.videoId]) {
            idsToRead.push('VIDEO_' + doc.videoId);
        }
        if (doc.trackId && !idsRead['TRACK']['TRACK_' + doc.trackId]) {
            idsToRead.push('TRACK_' + doc.trackId);
        }
        if (doc.routeId && !idsRead['ROUTE']['ROUTE_' + doc.routeId]) {
            idsToRead.push('ROUTE_' + doc.routeId);
        }
        if (doc.locId && !idsRead['LOCATION']['LOCATION_' + doc.locId]) {
            idsToRead.push('LOCATION_' + doc.locId);
        }
        if (doc.locIdParent && !idsRead['LOCATION']['LOCATION_' + doc.locIdParent]) {
            idsToRead.push('LOCATION_' + doc.locIdParent);
        }
        if (doc.tripId && !idsRead['TRIP']['TRIP_' + doc.tripId]) {
            idsToRead.push('TRIP_' + doc.tripId);
        }
        if (doc.newsId && !idsRead['NEWS']['NEWS_' + doc.newsId]) {
            idsToRead.push('NEWS_' + doc.newsId);
        }

        return idsToRead;
    }

    protected convertAdapterDocValues(mdoc: {},
                                      idMediaFileMappings: ExportProcessingResultMediaFileMappingsType,
                                      idRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType): {} {
        if (mdoc['id'] === undefined) {
            return mdoc;
        }

        if (idMediaFileMappings[mdoc['id']] !== undefined) {
            mdoc['a_fav_url_txt'] = idMediaFileMappings[mdoc['id']].audioFile;
            mdoc['i_fav_url_txt'] = idMediaFileMappings[mdoc['id']].imageFile;
            mdoc['v_fav_url_txt'] = idMediaFileMappings[mdoc['id']].videoFile;
        }

        if (idRecordFieldMappings[mdoc['id']] !== undefined) {
            mdoc = { ...mdoc, ...idRecordFieldMappings[mdoc['id']]};
        }

        return mdoc;
    }
}

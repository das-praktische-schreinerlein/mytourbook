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
import {TourDocLinkedRouteRecord} from '../shared/tdoc-commons/model/records/tdoclinkedroute-record';
import {TourDocLinkedInfoRecord} from '../shared/tdoc-commons/model/records/tdoclinkedinfo-record';
import {TourDocLinkedPlaylistRecord} from '../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {ProcessingOptions} from '@dps/mycms-commons/src/search-commons/services/cdoc-search.service';
import {ExportProcessingOptions} from '@dps/mycms-commons/src/search-commons/services/cdoc-export.service';

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

    public exportMediaFiles(searchForm: TourDocSearchForm,
                            processingOptions: MediaExportProcessingOptions & ProcessingOptions & ExportProcessingOptions): Promise<{}> {
        const me = this;
        const exportResults: ExportProcessingResult<TourDocRecord>[]  = [];
        const callback = function(mdoc: TourDocRecord): Promise<{}>[] {
            return [
                me.exportMediaRecordFiles(mdoc, processingOptions, exportResults)
            ];
        };

        return this.dataService.batchProcessSearchResult(searchForm, callback, {
            loadDetailsMode: undefined,
            loadTrack: true,
            showFacets: false,
            showForm: false
        }, processingOptions).then(() => {
            return me.generatePlaylistForExportResults(processingOptions, exportResults).then(() => {
                return me.exportRelatedDocsForExportedMediaFiles(processingOptions, searchForm, exportResults);
            });
        });
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
            case 'VIDEO':
                return me.mediaFileExportManager.exportMediaRecordFiles(tdoc, mediaExportProcessingOptions).then(
                    exportResult => {
                        exportResults.push(exportResult);
                        return Promise.resolve(exportResult);
                    });
            default:
                return me.mediaFileExportManager.exportMediaRecordFiles(tdoc, mediaExportProcessingOptions).then(
                    exportResult => {
                        exportResults.push(exportResult);
                        return Promise.resolve(exportResult);
                    }).catch(reason => {
                    console.warn('exportMediaRecordFiles of nonmedia failed - do it without media', tdoc, reason)
                    return new Promise<ExportProcessingResult<TourDocRecord>>( function( resolve) {
                        const exportResult: ExportProcessingResult<TourDocRecord> = {
                            record: tdoc,
                            exportFileEntry: undefined,
                            mediaFileMappings: undefined,
                            externalRecordFieldMappings: undefined
                        }

                        exportResults.push(exportResult);
                        return resolve(exportResult);
                    });
                });
        }
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
        for (const type of ['IMAGE', 'VIDEO', 'TRACK', 'LOCATION', 'ROUTE', 'INFO', 'TRIP', 'NEWS', 'PLAYLIST', 'DESTINATION']) {
            if (idsRead[type] === undefined) {
                idsRead[type] = {};
            }
        }

        const idsToRead = [];
        if (['IMAGE', 'VIDEO', 'TRACK', 'ROUTE', 'LOCATION', 'TRIP', 'INFO', 'DESTINATION'].includes(doc.type)) {
            if (doc.locId && !idsRead['LOCATION']['LOCATION_' + doc.locId]) {
                idsToRead.push('LOCATION_' + doc.locId);
            }
        }
        if (['IMAGE', 'VIDEO', 'TRACK', 'ROUTE', 'DESTINATION'].includes(doc.type)) {
            if (doc.routeId && !idsRead['ROUTE']['ROUTE_' + doc.routeId]) {
                idsToRead.push('ROUTE_' + doc.routeId);
            }
            if (doc.destinationId && !idsRead['DESTINATION']['DESTINATION_' + doc.destinationId]) {
                idsToRead.push('DESTINATION_' + doc.destinationId);
            }
        }
        if (['IMAGE', 'VIDEO', 'TRACK', 'TRIP', 'NEWS'].includes(doc.type)) {
            if (doc.trackId && !idsRead['TRACK']['TRACK_' + doc.trackId]) {
                idsToRead.push('TRACK_' + doc.trackId);
            }
            if (doc.tripId && !idsRead['TRIP']['TRIP_' + doc.tripId]) {
                idsToRead.push('TRIP_' + doc.tripId);
            }
            if (doc.newsId && !idsRead['NEWS']['NEWS_' + doc.newsId]) {
                idsToRead.push('NEWS_' + doc.newsId);
            }
        }
        if (['IMAGE'].includes(doc.type)) {
            if (doc.imageId && !idsRead['IMAGE']['IMAGE_' + doc.imageId]) {
                idsToRead.push('IMAGE_' + doc.imageId);
            }
        }
        if (['VIDEO'].includes(doc.type)) {
            if (doc.videoId && !idsRead['VIDEO']['VIDEO_' + doc.videoId]) {
                idsToRead.push('VIDEO_' + doc.videoId);
            }
        }

        if (doc.locIdParent && !idsRead['LOCATION']['LOCATION_' + doc.locIdParent]) {
            idsToRead.push('LOCATION_' + doc.locIdParent);
        }

        if (['TRACK'].includes(doc.type)) {
            const routes: TourDocLinkedRouteRecord[] = doc.get('tdoclinkedroutes');
            if (routes) {
                for (const route of routes) {
                    if (!idsRead['ROUTE']['ROUTE_' + route.refId]) {
                        idsToRead.push('ROUTE_' + route.refId);
                    }
                }
            }
        }

        if (['ROUTE', 'LOCATION'].includes(doc.type)) {
            const infos: TourDocLinkedInfoRecord[] = doc.get('tdoclinkedinfos');
            if (infos) {
                for (const info of infos) {
                    if (!idsRead['INFO']['INFO_' + info.refId]) {
                        idsToRead.push('INFO_' + info.refId);
                    }
                }
            }
        }

        const playlists: TourDocLinkedPlaylistRecord[] = doc.get('tdoclinkedplaylists');
        if (playlists) {
            for (const playlist of playlists) {
                if (!idsRead['PLAYLIST']['PLAYLIST_' + playlist.refId]) {
                    idsToRead.push('PLAYLIST_' + playlist.refId);
                }
            }
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

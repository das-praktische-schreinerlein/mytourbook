import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {
    CommonDocDocExportService,
    ExportProcessingResult,
    ExportProcessingResultMediaFileMappingsType,
    ExportProcessingResultRecordFieldMappingsType
} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {MediaExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {TourDocLinkedRouteRecord} from '../shared/tdoc-commons/model/records/tdoclinkedroute-record';
import {TourDocLinkedPlaylistRecord} from '../shared/tdoc-commons/model/records/tdoclinkedplaylist-record';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocServerPlaylistService} from './pdoc-serverplaylist.service';
import {PDocAdapterResponseMapper} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-adapter-response.mapper';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {ExportProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';

export class PDocExportService extends CommonDocDocExportService<PDocRecord, PDocSearchForm, PDocSearchResult,
    PDocDataService, PDocServerPlaylistService> {
    protected readonly playlistService: PDocServerPlaylistService;
    protected readonly dataService: PDocDataService;
    protected readonly responseMapper: GenericAdapterResponseMapper;

    constructor(backendConfig, dataService: PDocDataService, playlistService: PDocServerPlaylistService,
                responseMapper: PDocAdapterResponseMapper) {
        super(backendConfig, dataService, playlistService, responseMapper);
    }

    public exportMediaRecordFiles(pdoc: PDocRecord, processingOptions: MediaExportProcessingOptions,
                                  exportResults: ExportProcessingResult<PDocRecord>[])
        : Promise<ExportProcessingResult<PDocRecord>> {
        if (pdoc === undefined) {
            return Promise.reject('pdoc required');
        }

        return new Promise<ExportProcessingResult<PDocRecord>>( function( resolve) {
            const exportResult: ExportProcessingResult<PDocRecord> = {
                record: pdoc,
                exportFileEntry: undefined,
                mediaFileMappings: undefined,
                externalRecordFieldMappings: undefined
            }

            exportResults.push(exportResult);
            return resolve(exportResult);
        });
    }

    protected generatePlaylistEntry(tdoc: PDocRecord, file: string): string {
        return undefined;
    }

    protected generatePlaylistForExportResults(processingOptions: ProcessingOptions & ExportProcessingOptions,
                                               exportResults: ExportProcessingResult<PDocRecord>[]): Promise<{}> {
        return Promise.resolve('');
    }

    protected checkIdToRead(doc: PDocRecord, idsRead: {}): any[] {
        for (const type of ['PAGE']) {
            if (idsRead[type] === undefined) {
                idsRead[type] = {};
            }
        }

        const idsToRead = [];
        if (['PAGE'].includes(doc.type)) {
            const routes: TourDocLinkedRouteRecord[] = doc.get('tdoclinkedroutes');
            if (routes) {
                for (const route of routes) {
                    if (!idsRead['ROUTE']['ROUTE_' + route.refId]) {
                        idsToRead.push('ROUTE_' + route.refId);
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

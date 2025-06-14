import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {TourDocServerPlaylistService} from './tdoc-serverplaylist.service';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {
    CommonDocMediaFileExportManager,
    MediaExportProcessingOptions
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {ExportProcessingResult} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {BaseMediaRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basemedia-record';
import {MediaExportResolution, mediaType} from '@dps/mycms-server-commons/src/backend-commons/modules/cdoc-mediafile-export.service';
import {NameUtils} from '@dps/mycms-commons/dist/commons/utils/name.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';

export interface TourDocMediaExportProcessingOptions extends MediaExportProcessingOptions {
    pdfBase: string;
}

export class TourDocMediaFileExportManager extends CommonDocMediaFileExportManager<TourDocRecord> {
    public static readonly PROFILE_TRIP = 'trip';
    public static readonly PROFILE_LOCATION = 'location';

    protected dataService: TourDocDataService;
    protected tdocCache = {};

    constructor(baseDir: string, playlistService: TourDocServerPlaylistService, dataService: TourDocDataService) {
        super(baseDir, playlistService);
        this.dataService = dataService;
    }

    public exportMediaRecordFile(mdoc: TourDocRecord, mediaRecord: BaseMediaRecord, type: mediaType,
                                 resolution: MediaExportResolution, exportProcessingOptions: TourDocMediaExportProcessingOptions)
        : Promise<ExportProcessingResult<TourDocRecord>> {
        if (exportProcessingOptions.directoryProfile === TourDocMediaFileExportManager.PROFILE_TRIP
            || exportProcessingOptions.directoryProfile === TourDocMediaFileExportManager.PROFILE_LOCATION) {
            let id = undefined;
            let flgAddDate = false;
            let exportGroupTypeDir = undefined;
            if (exportProcessingOptions.directoryProfile === TourDocMediaFileExportManager.PROFILE_TRIP && mdoc['tripId']) {
                id = 'TRIP_' + mdoc['tripId'];
                exportGroupTypeDir = 'Trip';
            } else if (mdoc['locId']) {
                id = 'LOCATION_' + mdoc['locId'];
                flgAddDate = false;
                exportGroupTypeDir = 'Loc';
            }

            if (id !== undefined) {
                const cachedGroupByItem: TourDocRecord = this.tdocCache[id];
                if (cachedGroupByItem) {
                    mdoc['exportGroupName'] = this.calcGroupName(mdoc, cachedGroupByItem, flgAddDate);
                    mdoc['exportGroupTypeDir'] = exportGroupTypeDir;

                    return super.exportMediaRecordFile(mdoc, mediaRecord, type, resolution, exportProcessingOptions);
                }

                return this.dataService.getById(id).then((groupByItem) => {
                    mdoc['exportGroupName'] = this.calcGroupName(mdoc, groupByItem, flgAddDate);
                    mdoc['exportGroupTypeDir'] = exportGroupTypeDir;

                    return super.exportMediaRecordFile(mdoc, mediaRecord, type, resolution, exportProcessingOptions);
                });
            }
        }

        return super.exportMediaRecordFile(mdoc, mediaRecord, type, resolution, exportProcessingOptions);
    }

    public exportMediaRecordPdfFile(mdoc: TourDocRecord, exportProcessingOptions: TourDocMediaExportProcessingOptions)
        : Promise<ExportProcessingResult<TourDocRecord>> {
        if (mdoc.pdfFile === undefined || mdoc.pdfFile.length < 4) {
            console.log('SKIPPED - exportMediaRecordPdfFiles - no pdffile', mdoc.id, mdoc.name);
            return Promise.resolve({
                record: mdoc,
                exportFileEntry: undefined,
                mediaFileMappings: undefined,
                externalRecordFieldMappings: undefined
            });
        }

        const filePath = mdoc.type + '/' + mdoc.pdfFile;
        const srcPath = exportProcessingOptions.pdfBase + '/' + filePath;
        const destPath = exportProcessingOptions.exportBasePath + '/pdfs/' + filePath;

        return FileUtils.copyFile(srcPath, destPath, true, false).then(() => {
            console.log('DONE - exportMediaRecordPdfFiles ', destPath);
            const result: ExportProcessingResult<TourDocRecord> = {
                record: mdoc,
                exportFileEntry: 'pdfs/' + filePath,
                mediaFileMappings: undefined,
                externalRecordFieldMappings: undefined
            }

            return Promise.resolve(result);
        });
    }

    public generateMediaDirForProfile(tdoc: TourDocRecord, mediaRecord: BaseMediaRecord, type: mediaType,
                                      exportProcessingOptions: TourDocMediaExportProcessingOptions): string {
        if (mediaRecord === undefined) {
            return undefined;
        }

        if (tdoc['exportGroupName']) {
            const exportGroupTypeDir = tdoc['exportGroupTypeDir']
                ? NameUtils.normalizeFileNames(tdoc['exportGroupTypeDir']) + '/'
                : '';
            return exportGroupTypeDir + NameUtils.normalizeFileNames(tdoc['exportGroupName']);
        }

        return super.generateMediaDirForProfile(tdoc, mediaRecord, type, exportProcessingOptions);
    }

    protected getDetailImageRecords(tdoc: TourDocRecord): BaseImageRecord[] {
        return tdoc.get('tdocimages');
    }

    protected getDetailVideoRecords(tdoc: TourDocRecord): BaseVideoRecord[] {
        return tdoc.get('tdocvideos');
    }

    protected getDetailAudioRecords(tdoc: TourDocRecord): BaseAudioRecord[] {
        return tdoc.get('tdocaudios');
    }

    protected calcGroupName(mdoc: TourDocRecord, cachedGroupByItem: TourDocRecord, flgAddDate: boolean) {
        let groupName = cachedGroupByItem.name
            ? cachedGroupByItem.name
            : undefined;

        if (groupName && flgAddDate && mdoc.datestart) {
            const date: Date = DateUtils.parseDate(mdoc.datestart);
            groupName += ' ' +
                [date.getFullYear(),
                    '-',
                    StringUtils.padStart((date.getMonth() + 1).toString(), '00')
                ].join('');
        }

        return groupName;
    }

}

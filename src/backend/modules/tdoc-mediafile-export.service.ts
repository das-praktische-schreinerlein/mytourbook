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

export interface TourDocMediaExportProcessingOptions extends MediaExportProcessingOptions {
    pdfBase: string;
}

export class TourDocMediaFileExportManager extends CommonDocMediaFileExportManager<TourDocRecord> {
    protected readonly dataService: TourDocDataService;

    public exportMediaRecordPdfFiles(mdoc: TourDocRecord, exportProcessingOptions: TourDocMediaExportProcessingOptions)
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

    constructor(baseDir: string, playlistService: TourDocServerPlaylistService) {
        super(baseDir, playlistService);
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
}

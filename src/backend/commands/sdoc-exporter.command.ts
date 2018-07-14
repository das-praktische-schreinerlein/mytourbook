import {AbstractCommand} from './abstract.command';
import * as fs from 'fs';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {utils} from 'js-data';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';
import {CommonDocSearchForm} from '../shared/search-commons/model/forms/cdoc-searchform';
import {CommonDocRecord} from '../shared/search-commons/model/records/cdoc-entity-record';
import {CommonDocDataService} from '../shared/search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '../shared/search-commons/model/container/cdoc-searchresult';
import {GenericAdapterResponseMapper} from '../shared/search-commons/services/generic-adapter-response.mapper';

export class SDocExporterCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const perRun = 999;
        const typeOrder = ['location', 'news', 'trip', 'route', 'track', 'image', 'video'];

        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const serverConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            readOnly: false
        };

        const dataFileName = argv['f'] || argv['file'];
        if (dataFileName === undefined) {
            console.error('option --file expected');
            return;
        }
        const dataService: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
            CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        dataService.setWritable(false);
        const responseMapper: GenericAdapterResponseMapper = new SDocAdapterResponseMapper(serverConfig.backendConfig);

        fs.writeFileSync(dataFileName, '{"sdocs": [');
        let first = true;

        const replacer = function(key, value) {
            if (value === null) {
                return undefined;
            }

            return value;
        };


        const exportSearchResultToJson = function(searchForm: CommonDocSearchForm): Promise<any> {
            return dataService.search(searchForm, {
                showFacets: false,
                showForm: false,
                loadDetailsMode: 'full',
                loadTrack: true}).then(
                function searchDone(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>) {
                    let output = '';
                    for (const doc of searchResult.currentRecords) {
                        output += (first ? '\n  ' : ',\n  ') + JSON.stringify(responseMapper.mapToAdapterDocument({}, doc), replacer);
                        first = false;
                    }
                    fs.appendFileSync(dataFileName, output);

                    console.log('DONE ' + searchForm.pageNum + ' from ' + (searchResult.recordCount / searchForm.perPage + 1)
                        + ' for: ' + searchResult.recordCount, searchForm);
                    searchForm.pageNum++;
                    if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                        return exportSearchResultToJson(searchForm);
                    } else {
                        return utils.resolve(dataFileName);
                    }
                }
            ).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        const exportTypeToJson = function(types: string[], nr: number): Promise<any> {
            if (nr >= types.length) {
                fs.appendFileSync(dataFileName, ']}');
                return utils.resolve('DONE');
            }

            const globSearchForm = dataService.newSearchForm({});
            globSearchForm.perPage = perRun;
            globSearchForm.pageNum = 1;
            globSearchForm.type = types[nr];
            globSearchForm.sort = 'forExport';

            console.log('DO export ' + nr, globSearchForm);
            return exportSearchResultToJson(globSearchForm).then(value => {
                return exportTypeToJson(types, nr + 1);
            }).catch(function searchError(error) {
                console.error('error thrown: ', error);
                return utils.reject(error);
            });
        };

        return exportTypeToJson(typeOrder, 0);
    }
}

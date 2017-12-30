import {Router} from 'js-data-express';
import sm from 'sitemap';
import * as fs from 'fs';
import {GenericSearchResult} from '../shared/search-commons/model/container/generic-searchresult';
import {GenericSearchForm} from '../shared/search-commons/model/forms/generic-searchform';
import {BaseEntityRecord} from '../shared/search-commons/model/records/base-entity-record';
import {GenericSearchService} from '../shared/search-commons/services/generic-search.service';

export interface SitemapConfig {
    sitemapBaseUrl: string;
    showBaseUrl: string;
    locale: string;
    fileDir: string;
    fileBase: string;
    perPage: number;
    urlGenerator: any;
    sdocSearchForm: {};
}

export class SitemapGeneratorModule {
    public static generateSiteMapFiles(
        dataService: GenericSearchService<BaseEntityRecord, GenericSearchForm, GenericSearchResult<BaseEntityRecord, GenericSearchForm>>,
        sitemapConfig: SitemapConfig, searchForm: GenericSearchForm) {

        searchForm.perPage = sitemapConfig.perPage;
        searchForm.pageNum = 1;
        const pDocSiteMaps = [];

        const createSitemapIndex = function () {
            const sitemapIndex = sm.buildSitemapIndex({
                urls: pDocSiteMaps
            });
            const fileName = sitemapConfig.fileBase + sitemapConfig.locale + '.xml';
            fs.writeFileSync(sitemapConfig.fileDir + fileName, sitemapIndex.toString());
        };
        const createNextSitemap = function() {
            dataService.search(searchForm).then(
                function searchDone(searchResult: GenericSearchResult<BaseEntityRecord, GenericSearchForm>) {
                    const urls = [];
                    for (const doc of searchResult.currentRecords) {
                        for (const url of sitemapConfig.urlGenerator(sitemapConfig, doc)) {
                            urls.push(url);
                        }
                    }

                    const sitemap = sm.createSitemap({
                        urls: urls
                    });

                    const fileName = sitemapConfig.fileBase + sitemapConfig.locale + '_' + searchForm.pageNum + '.xml';
                    fs.writeFileSync(sitemapConfig.fileDir + fileName, sitemap.toString());
                    searchForm.pageNum++;
                    pDocSiteMaps.push(sitemapConfig.sitemapBaseUrl + fileName);
                    if (searchForm.pageNum < (searchResult.recordCount / searchForm.perPage + 1)) {
                        createNextSitemap();
                    } else {
                        createSitemapIndex();
                    }
                }
            ).catch(
                function searchError(error) {
                    console.error('error thrown: ', error);
                }
            );
        };

        createNextSitemap();
    }
}

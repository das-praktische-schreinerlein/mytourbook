import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {KeywordValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {CommonSqlPlaylistAdapter} from './common-sql-playlist.adapter';

export interface PlaylistActionTagForm extends ActionTagForm {
    payload: {
        playlistkey: string;
        set: boolean;
    };
}

export class CommonDocSqlActionTagPlaylistAdapter {

    private playlistValidationRule = new KeywordValidationRule(true);
    private readonly commonSqlPlaylistAdapter: CommonSqlPlaylistAdapter;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder, commonSqlPlaylistAdapter: CommonSqlPlaylistAdapter) {
        this.commonSqlPlaylistAdapter = commonSqlPlaylistAdapter;
    }

    public executeActionTagPlaylist(table: string, id: number, actionTagForm: PlaylistActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }

        const playlists = actionTagForm.payload.playlistkey;
        if (!this.playlistValidationRule.isValid(playlists)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playlists not valid');
        }

        return this.commonSqlPlaylistAdapter.setPlaylists(table, id, playlists, opts, actionTagForm.payload.set);
    }

}

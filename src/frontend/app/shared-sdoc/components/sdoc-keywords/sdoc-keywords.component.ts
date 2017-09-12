import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocContentUtils, StructuredKeyword} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-keywords',
    templateUrl: './sdoc-keywords.component.html',
    styleUrls: ['./sdoc-keywords.component.css']
})
export class SDocKeywordsComponent implements OnChanges {
    keywordKats: StructuredKeyword[] = [];

    blacklist = ['OFFEN', 'Mom', 'Pa', 'Dani', 'Micha', 'Verena',
        'Booga', 'Harry', 'Rudi', 'Pelle'];

    keywordsConfig: StructuredKeyword[] = [
        {name: 'Aktivität', keywords: ['Baden', 'Boofen', 'Bootfahren', 'Campen',
            'Fliegen', 'Gletscherbegehung', 'Kanu', 'Klettern', 'Klettersteig',
            'Radfahren', 'Schneeschuhwandern', 'Skaten', 'Wandern', 'Museumsbesuch',
            'Stadtbesichtigung', 'Besichtigung', 'Gassi', 'Hochtour', 'Spaziergang',
            'Wanderung']},
        {name: 'Kultur', keywords: ['Denkmal', 'Geschichte', 'Kunst', 'Museum',
            'Architektur', 'Burg', 'Dom', 'Kirche', 'Park', 'Schloss', 'Zoo']},
        {name: 'Jahreszeit', keywords: ['Frühling', 'Herbst', 'Sommer', 'Winter']},
        {name: 'Tourdauer', keywords: ['Kurztour', 'Mehrtagestour', 'Tagestour']},
        {name: 'Wetter', keywords: ['bedeckt', 'Eis', 'heiter', 'Regen', 'Schnee',
            'sonnig', 'Sonne', 'Mond', 'Sonnenaufgang', 'Sonnenuntergang']},
        {name: 'Landschaft', keywords: ['Kulturlandschaft', 'Landschaft', 'Dorf',
            'Stadt', 'Naturlandschaft', 'Natur']},
        {name: 'Natur', keywords: ['Alm', 'Aue', 'Bach', 'Fluss', 'Moor', 'See',
            'Teich', 'Wasserfall', 'Felsen', 'Felswand', 'Gletscherschau',
            'Höhle', 'Schlucht', 'Tal', 'Sandstrand', 'Steinstrand',
            'Steilküste', 'Blumen', 'Feld', 'Heide', 'Steppe', 'Wiese',
            'Bergwald', 'Strandwald', 'Wald', 'Seenlandschaft', 'Berge',
            'Hochgebirge', 'Mittelgebirge', 'Meer', 'Ozean']}
    ];

    @Input()
    public record: SDocRecord;

    constructor(private contentUtils: SDocContentUtils) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        this.keywordKats = [];
        if (this.record === undefined) {
            return;
        }
        this.keywordKats = this.contentUtils.getStructuredKeywords(
            this.keywordsConfig,
            this.record.keywords.split(', '),
            this.blacklist);
    }
}

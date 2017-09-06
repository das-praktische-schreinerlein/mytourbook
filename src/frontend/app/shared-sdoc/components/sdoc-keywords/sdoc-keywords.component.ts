import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';

@Component({
    selector: 'app-sdoc-keywords',
    templateUrl: './sdoc-keywords.component.html',
    styleUrls: ['./sdoc-keywords.component.css']
})
export class SDocKeywordsComponent implements OnChanges {
    keywordKats: {
        name: string,
        keywords: string[]
    }[] = [];

    blacklist = ['OFFEN', 'Mom', 'Pa', 'Dani', 'Micha', 'Verena',
        'Booga', 'Harry', 'Rudi', 'Pelle'];

    keywordsConfig = {
        'Aktivität': ['Baden', 'Boofen', 'Bootfahren', 'Campen',
            'Fliegen', 'Gletscherbegehung', 'Kanu', 'Klettern', 'Klettersteig',
            'Radfahren', 'Schneeschuhwandern', 'Skaten', 'Wandern', 'Museumsbesuch',
            'Stadtbesichtigung', 'Besichtigung', 'Gassi', 'Hochtour', 'Spaziergang',
            'Wanderung'],
        'Kultur': ['Denkmal', 'Geschichte', 'Kunst', 'Museum',
            'Architektur', 'Burg', 'Dom', 'Kirche', 'Park', 'Schloss', 'Zoo'],
        'Jahreszeit': ['Frühling', 'Herbst', 'Sommer', 'Winter'],
        'Tourdauer': ['Kurztour', 'Mehrtagestour', 'Tagestour'],
        'Wetter': ['bedeckt', 'Eis', 'heiter', 'Regen', 'Schnee',
            'sonnig', 'Sonne', 'Mond', 'Sonnenaufgang', 'Sonnenuntergang'],
        'Landschaft': ['Kulturlandschaft', 'Landschaft', 'Dorf',
            'Stadt', 'Naturlandschaft', 'Natur'],
        'Natur': ['Alm', 'Aue', 'Bach', 'Fluss', 'Moor', 'See',
            'Teich', 'Wasserfall', 'Felsen', 'Felswand', 'Gletscherschau',
            'Höhle', 'Schlucht', 'Tal', 'Sandstrand', 'Steinstrand',
            'Steilküste', 'Blumen', 'Feld', 'Heide', 'Steppe', 'Wiese',
            'Bergwald', 'Strandwald', 'Wald', 'Seenlandschaft', 'Berge',
            'Hochgebirge', 'Mittelgebirge', 'Meer', 'Ozean']
    };

    @Input()
    public record: SDocRecord;

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
        const keywords = this.record.keywords.split(', ');
        for (const keyword of this.blacklist) {
            if (keywords.indexOf(keyword) > -1) {
                // TODO remove
            }
        }

        for (const keywordKat in this.keywordsConfig) {
            const keywordFound = [];
            for (const keyword of this.keywordsConfig[keywordKat]) {
                if (keywords.indexOf(keyword) > -1) {
                    // TODO remove
                    keywordFound.push(keyword);
                }
            }
            if (keywordFound.length > 0) {
                this.keywordKats.push({ name: keywordKat, keywords: keywordFound});
            }
        }
    }
}

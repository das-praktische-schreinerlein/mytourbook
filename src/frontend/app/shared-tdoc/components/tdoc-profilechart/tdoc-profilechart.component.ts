import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {ChartElement} from '../visjs-profilechart/visjs-profilechart.component';

@Component({
    selector: 'app-tdoc-profilechart',
    templateUrl: './tdoc-profilechart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocProfileChartComponent extends AbstractInlineComponent {
    chartElements: ChartElement[] = [];

    @Input()
    public chartId: string;

    @Input()
    public height: string;

    @Input()
    public tdocs: TourDocRecord[];

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public chartElementsFound: EventEmitter<ChartElement[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, private contentUtils: TourDocContentUtils, private appService: GenericAppService,
                private platformService: PlatformService) {
        super(cd);
    }

    renderChart() {
        if (!this.tdocs) {
            this.chartElements = [];
            return;
        }

        const tmpList: ChartElement[] = [];
        for (let i = 0; i < this.tdocs.length; i++) {
            const record =  this.tdocs[i];
            for (const chartElement of this.contentUtils.createChartElementForTourDoc(record, StringUtils.calcCharCodeForListIndex(i + 1),
                this.showImageTrackAndGeoPos)) {
                tmpList.push(chartElement);
            }
        }
        this.chartElements = tmpList;
        this.chartElementsFound.emit(this.chartElements);

        this.cd.markForCheck();
    }

    protected updateData(): void {
        if (this.platformService.isClient()) {
            this.renderChart();
        }
    }
}

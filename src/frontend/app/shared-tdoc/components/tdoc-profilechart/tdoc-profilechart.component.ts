import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {ChartElement} from '../visjs-profilechart/visjs-profilechart.component';
import {MapContentUtils} from '../../services/map-contentutils.service';
import {MapDocRecord} from '../../../../shared/tdoc-commons/services/tdoc-data.utils';

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
    public docRecords: MapDocRecord[];

    @Input()
    public showImageTrackAndGeoPos ? = false;

    @Output()
    public chartElementsFound: EventEmitter<ChartElement[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, private contentUtils: MapContentUtils, private appService: GenericAppService,
                private platformService: PlatformService) {
        super(cd);
    }

    renderChart() {
        if (!this.docRecords) {
            this.chartElements = [];
            return;
        }

        const tmpList: ChartElement[] = [];
        for (let i = 0; i < this.docRecords.length; i++) {
            const record =  this.docRecords[i];
            for (const chartElement of this.contentUtils.createChartElementForDocRecord(record, StringUtils.calcCharCodeForListIndex(i + 1),
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

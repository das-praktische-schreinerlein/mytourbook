import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TourDocFlagObjectRecordType} from '../../../../shared/tdoc-commons/model/records/tdocflagobject-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';

export interface CommonDocObjectFlagsComponentConfig {
    allowedFlags: {[key: string]: string[]};
    modes: {[key: string]: string};
}

@Component({
    selector: 'app-cdoc-object-flags',
    templateUrl: './cdoc-object-flags.component.html',
    styleUrls: ['./cdoc-object-flags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocObjectFlagsComponent extends AbstractInlineComponent implements OnInit {
    protected allowedFlags: {[key: string]: string[]} = {};
    protected modes: {[key: string]: string} = {};

    @Input()
    public profile ? = '';

    @Input()
    public flagobjects: TourDocFlagObjectRecordType[];

    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                this.configureComponent(config);
                this.updateData();
            }
        });
    }

    protected getComponentConfig(config: {}): CommonDocObjectFlagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.cdoc-object-flags')) {
            return {
                allowedFlags: BeanUtils.getValue(config, 'components.cdoc-object-flags.allowedFlags'),
                modes: BeanUtils.getValue(config, 'components.cdoc-object-flags.modes'),
            };
        } else {
            console.warn('no valid allowedFlags found for components.cdoc-object-flags');
            return {
                allowedFlags: {},
                modes: {}
            };
        }
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.allowedFlags = componentConfig.allowedFlags;
        this.modes = componentConfig.modes;
    }

    protected updateData() {
        this.cd.markForCheck();
    }

    isVisible(): boolean {
        return this.modes[this.profile] && this.modes[this.profile] !== 'hidden' ;
    }

    isFlagVisible(flag: TourDocFlagObjectRecordType): boolean {
        return flag.value !== '0' && this.allowedFlags[this.profile] && this.allowedFlags[this.profile].includes(flag.name);
    }

    isShortMode(): boolean {
        return this.modes[this.profile] && this.modes[this.profile] === 'short';
    }
}

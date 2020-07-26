import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BaseExtendedObjectPropertyRecordType} from '../../../../shared/tdoc-commons/model/records/baseextendedobjectproperty-record';

export interface CommonDocExtendedObjectPropertiesComponentConfig {
    allowedExtendedObjectProperties: {[key: string]: string[]};
    modes: {[key: string]: string};
}

@Component({
    selector: 'app-cdoc-extended-object-properties',
    templateUrl: './cdoc-extended-object-properties.component.html',
    styleUrls: ['./cdoc-extended-object-properties.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocExtendedObjectPropertiesComponent extends AbstractInlineComponent implements OnInit {
    protected allowedExtendedObjectProperties: {[key: string]: string[]} = {};
    protected modes: {[key: string]: string} = {};

    @Input()
    public profile ? = '';

    @Input()
    public categories ?: string[] = [];

    @Input()
    public extendedObjectProperties: BaseExtendedObjectPropertyRecordType[];

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

    protected getComponentConfig(config: {}): CommonDocExtendedObjectPropertiesComponentConfig {
        if (BeanUtils.getValue(config, 'components.cdoc-extended-object-properties')) {
            return {
                allowedExtendedObjectProperties: BeanUtils.getValue(config, 'components.cdoc-extended-object-properties.allowedExtendedObjectProperties'),
                modes: BeanUtils.getValue(config, 'components.cdoc-extended-object-properties.modes'),
            };
        } else {
            console.warn('no valid allowedExtendedObjectProperties found for components.cdoc-extended-object-properties');
            return {
                allowedExtendedObjectProperties: {},
                modes: {}
            };
        }
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.allowedExtendedObjectProperties = componentConfig.allowedExtendedObjectProperties;
        this.modes = componentConfig.modes;
    }

    protected updateData() {
        this.cd.markForCheck();
    }

    isVisible(): boolean {
        return this.modes[this.profile] && this.modes[this.profile] !== 'hidden' ;
    }

    isFlagVisible(property: BaseExtendedObjectPropertyRecordType): boolean {
        return property.value !== '0' &&
            this.categories !== undefined && this.categories.length > 0 && this.categories.includes(property.category) &&
            this.allowedExtendedObjectProperties[this.profile] &&
            this.allowedExtendedObjectProperties[this.profile].includes(property.name);
    }

    isShortMode(): boolean {
        return this.modes[this.profile] && this.modes[this.profile] === 'short';
    }
}

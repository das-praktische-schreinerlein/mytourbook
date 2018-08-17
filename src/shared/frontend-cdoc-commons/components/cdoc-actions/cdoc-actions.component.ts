import {ChangeDetectorRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {DynamicComponentHostDirective} from '../../../angular-commons/components/directives/dynamic-component-host.directive';
import {ActionTagEvent} from '../cdoc-actiontags/cdoc-actiontags.component';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {ActionTagForm} from '../../../commons/utils/actiontag.utils';
import {CommonDocAlbumService} from '../../services/cdoc-album.service';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';
import {DynamicComponentService} from '../../../angular-commons/services/dynamic-components.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocDataService} from '../../../search-commons/services/cdoc-data.service';
import {GenericAppService} from '../../../commons/services/generic-app.service';

export interface CDocActionsComponentConfig {
    baseEditPath: string;
}

export class CDocActionsComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>, D extends CommonDocDataService<R, F, S>> extends AbstractInlineComponent {
    protected baseEditPath: string;

    @Input()
    public record: R;

    @Input()
    public type: string;

    @Output()
    public actionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    @ViewChild(DynamicComponentHostDirective)
    widgetHost: DynamicComponentHostDirective;

    protected childActionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    constructor(protected dynamicComponentService: DynamicComponentService, protected router: Router,
                protected cdocDataService: D, protected toastr: ToastsManager, vcr: ViewContainerRef,
                protected cdocAlbumService: CommonDocAlbumService, protected cd: ChangeDetectorRef,
                protected appService: GenericAppService) {
        super(cd);
        this.toastr.setRootViewContainerRef(vcr);
        this.configureActionListener();
    }

    protected getComponentConfig(config: {}): CDocActionsComponentConfig {
        return {
            baseEditPath: 'cdocadmin'
        };
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.baseEditPath = componentConfig.baseEditPath;
    }

    protected configureActionListener(): void {
        this.childActionTagEvent.asObservable().subscribe(actionTagEvent => {
            if (actionTagEvent.config.key === 'edit') {
                actionTagEvent.processed = true;
                actionTagEvent.error = undefined;
                this.actionTagEvent.emit(actionTagEvent);
                this.router.navigate([ this.baseEditPath, 'edit', 'anonym', actionTagEvent.record.id ] );
            } else if (actionTagEvent.config.key === 'createBy') {
                const payload = JSON.parse(JSON.stringify(actionTagEvent.config.payload));
                actionTagEvent.processed = true;
                actionTagEvent.error = undefined;
                this.actionTagEvent.emit(actionTagEvent);
                this.router.navigate([ this.baseEditPath, 'create', payload.type, actionTagEvent.record.id ] );
            } else if (actionTagEvent.config.type === 'albumtag') {
                const payload = JSON.parse(JSON.stringify(actionTagEvent.config.payload));
                const key = payload['albumkey'];
                if (actionTagEvent.set) {
                    this.cdocAlbumService.addToAlbum(key, <R>actionTagEvent.record);
                } else {
                    this.cdocAlbumService.removeFromAlbum(key, <R>actionTagEvent.record);
                }
                actionTagEvent.processed = true;
                actionTagEvent.error = undefined;
                actionTagEvent.result = actionTagEvent.record;
                this.updateData();
                this.actionTagEvent.emit(actionTagEvent);
            } else if (actionTagEvent.config.type === 'tag') {
                const payload = JSON.parse(JSON.stringify(actionTagEvent.config.payload));
                payload['set'] = actionTagEvent.set;
                payload['name'] = actionTagEvent.config.name;
                const actinTagForm: ActionTagForm = {
                    key: actionTagEvent.config.key,
                    payload: payload,
                    recordId: actionTagEvent.record.id,
                    type: actionTagEvent.config.type
                };

                const me = this;
                me.cdocDataService.doActionTag(<R>actionTagEvent.record, actinTagForm).then(cdoc => {
                    actionTagEvent.processed = true;
                    actionTagEvent.error = undefined;
                    actionTagEvent.result = cdoc;
                    me.actionTagEvent.emit(actionTagEvent);
                }).catch(reason => {
                    actionTagEvent.processed = true;
                    actionTagEvent.error = reason;
                    me.actionTagEvent.emit(actionTagEvent);
                    me.toastr.error('Es gibt leider Probleme - am besten noch einmal probieren :-(', 'Oje!');
                    console.error('cdocactions failed:', reason);
                });
            } else {
                this.actionTagEvent.emit(actionTagEvent);
            }
        });
    }

    protected updateData(): void {
        const config = this.appService.getAppConfig();
        this.configureComponent(config);

        const componentRef = this.dynamicComponentService.createComponentByName(this.type, this.widgetHost);
        if (componentRef === undefined || componentRef === null) {
            return;
        }

        (componentRef.instance)['type'] = this.type;
        (componentRef.instance)['actionTagEvent'] = this.childActionTagEvent;
        (componentRef.instance)['record'] = this.record;
    }
}

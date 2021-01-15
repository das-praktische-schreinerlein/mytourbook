import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Subscription} from 'rxjs';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {BackendHttpResponse, MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {
    CommonAdminCommandsListResponseType,
    CommonAdminCommandStateType,
    CommonAdminResponseResultState,
    CommonAdminResponseType
} from '../../../../shared/tdoc-commons/model/container/admin-response';
import {FormBuilder, FormGroup} from '@angular/forms';

export interface AdminJobAreaComponentConfig {
    jobsAllowed: boolean;
}

@Component({
    selector: 'app-admin-jobarea',
    templateUrl: './admin-jobarea.component.html',
    styleUrls: ['./admin-jobarea.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminJobAreaComponent extends AbstractInlineComponent
    implements OnInit, OnDestroy {

    protected appStateSubscription: Subscription;

    objectKeys = Object.keys;
    arrayIsArray = Array.isArray;
    availableCommands: {[key: string]: CommonAdminCommandsListResponseType} = {};
    commandsStates: {[key: string]: CommonAdminCommandStateType} = {};
    adminResponse: CommonAdminResponseType = this.createErrorsResponse('admindata not loaded');
    showLoadingSpinner = false;
    jobsAllowed = false;
    intervalRunning = false;
    interval = undefined;
    intervalTimeout = 5;
    public intervalFormGroup: FormGroup = this.fb.group({
        intervalTimeout: [5]
    });

    constructor(protected appService: GenericAppService, protected toastr: ToastrService, @Inject(LOCALE_ID) private locale: string,
                protected cd: ChangeDetectorRef, protected elRef: ElementRef, protected pageUtils: PageUtils,
                private backendHttpClient: MinimalHttpBackendClient, public fb: FormBuilder) {
        super(cd);
    }

    ngOnInit() {
        this.appStateSubscription = this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.configureComponent(this.appService.getAppConfig());
                return this.updateData();
            }
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.clearIntervall();
    }

    protected getComponentConfig(config: {}): AdminJobAreaComponentConfig {
        return {
            jobsAllowed: BeanUtils.getValue(config, 'services.adminJobArea.jobsAllowed')
        };
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.jobsAllowed = componentConfig.jobsAllowed &&
            this.appService.getAppConfig()['permissions']['adminWritable'] &&
            this.appService.getAppConfig()['adminBackendApiBaseUrl'];
    }

    protected updateData(): void {
        this.doCheckServerState();
        this.doRunInterval(true);
    }

    doStartCommand(command: string) {
        if (!this.jobsAllowed) {
            return;
        }

        const me = this;
        me.callAdminBackend('execcommand', {'preparedCommand': command}).then(response => {
            me.availableCommands = response.preparedCommands;
            me.commandsStates = response.commandsStates;
            me.adminResponse = response;
            me.cd.markForCheck();
        }).catch(function onError(reason: any) {
            me.availableCommands = {};
            me.commandsStates = {};
            me.createErrorsResponse(reason);
            me.cd.markForCheck();
        });
    }

    doCheckServerState() {
        if (!this.jobsAllowed) {
            return;
        }

        const me = this;
        me.callAdminBackend('status', {}).then(response => {
            me.availableCommands = response.preparedCommands;
            me.commandsStates = response.commandsStates;
            me.adminResponse = response;
            me.cd.markForCheck();
        }).catch(function onError(reason: any) {
            me.availableCommands = {};
            me.commandsStates = {};
            me.createErrorsResponse(reason);
            me.cd.markForCheck();
        });
    }

    onIntervalTimeoutChange(event: Event): boolean {
        const timeout = event.target['value'];
        if (timeout >= 1) {
            this.intervalTimeout = timeout;
            this.doRunInterval(false);
            this.doRunInterval(true);
        } else {
            console.warn('illegal Interval:' + timeout, event);
        }

        this.cd.markForCheck();

        return false;
    }

    doRunInterval(run: boolean): boolean {
        if (!this.jobsAllowed) {
            return false;
        }

        const me = this;
        if (run && !this.intervalRunning && this.interval === undefined) {
            this.interval = setInterval(args => {
                me.doCheckServerState();
            }, (me.intervalTimeout ? me.intervalTimeout : 999999) * 60000);
            me.intervalRunning = true;
        } else {
            me.clearIntervall();
            me.intervalRunning = false;
        }

        me.doCheckServerState();
        this.cd.markForCheck();

        return false;
    }

    private clearIntervall(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
    protected callAdminBackend(endpoint: string, params: {}): Promise<CommonAdminResponseType> {
        const me = this;
        const options = {
            basePath: this.appService.getAppConfig()['adminBackendApiBaseUrl'] + this.locale + '/',
            http: function (httpConfig) {
                return me.backendHttpClient.makeHttpRequest(httpConfig);
            }
        };

        this.showLoadingSpinner = true;
        return me.backendHttpClient.makeHttpRequest({
            method: 'post',
            url: options.basePath + endpoint,
            data: params,
            withCredentials: true }).then((res: BackendHttpResponse) => {
            me.showLoadingSpinner = false;
            const response: CommonAdminResponseType = res.json();
            return Promise.resolve(response);
        }).catch(function onError(reason: any) {
            me.showLoadingSpinner = false;
            console.error('loading admindata failed:', reason);
            return Promise.reject(reason);
        });
    }

    private createErrorsResponse(reason: string): CommonAdminResponseType {
        return {
            preparedCommands: {},
            resultMsg: reason,
            resultState: CommonAdminResponseResultState.ERROR,
            resultDate: new Date()
        }
    }

}

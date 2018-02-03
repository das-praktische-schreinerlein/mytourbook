/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocEditformComponent} from './sdoc-editform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';

describe('SDocEditformComponent', () => {
    let component: SDocEditformComponent;
    let fixture: ComponentFixture<SDocEditformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocEditformComponent],
            imports: [
                ReactiveFormsModule,
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                ToastsManager,
                TranslateService,
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                SDocSearchFormUtils,
                SearchFormUtils,
                SearchParameterUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocEditformComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

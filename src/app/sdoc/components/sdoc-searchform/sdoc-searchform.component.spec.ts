/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchformComponent} from './sdoc-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

describe('SDocSearchformComponent', () => {
    let component: SDocSearchformComponent;
    let fixture: ComponentFixture<SDocSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocSearchformComponent],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                SDocSearchFormUtils,
                SearchFormUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocSearchformComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

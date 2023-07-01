/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PdocInfoComponent} from './pdoc-info.component';
import {TranslateModule} from '@ngx-translate/core';
import {PDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/pdoc-dataservice-stubs';
import {TruncatePipe} from '@dps/mycms-frontend-commons/dist/angular-commons/pipes/truncate.pipe';

describe('PdocInfoComponent', () => {
    let component: PdocInfoComponent;
    let fixture: ComponentFixture<PdocInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PdocInfoComponent, TruncatePipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PdocInfoComponent);
        component = fixture.componentInstance;
        component.record = PDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

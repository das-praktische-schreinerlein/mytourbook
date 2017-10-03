import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {FormBuilder, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SDocRecordSchema} from '../../../../shared/sdoc-commons/model/schemas/sdoc-record-schema';
import {ToastsManager} from 'ng2-toastr';
import {SchemaValidationError} from 'js-data';

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css']
})
export class SDocEditformComponent implements OnInit {
    // initialize a private variable _record, it's a BehaviorSubject
    private _record = new BehaviorSubject<SDocRecord>(new SDocRecord({}));

    @Input()
    public set record(value: SDocRecord) {
        // set the latest value for _data BehaviorSubject
        this._record.next(value);
    };

    public get record(): SDocRecord {
        // get the latest value from _data BehaviorSubject
        return this._record.getValue();
    }

    @Output()
    public save: EventEmitter<SDocRecord> = new EventEmitter();

    // empty default
    public editFormGroup = this.fb.group({
        id: '',
        name: '',
        desc: ''
    });

    constructor(public fb: FormBuilder, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this._record.subscribe(
            sdocRecord => {
                const record: SDocRecord = sdocRecord;

                const config = {
                    id: [record.id, Validators.required],
                    name: [record.name, Validators.required],
                    descMd: [record.descMd, Validators.required],
                    keywords: [record.keywords]
                };
                const fields = record.toJSON();
                for (const key in fields) {
                    if (fields.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
                        config[key] = [fields[key]];
                    }
                }
                this.editFormGroup = this.fb.group(config);
            });
    }

    submitSave(event: Event) {
        const values = this.editFormGroup.getRawValue();

        // delete empty key
        for (const key in values) {
            if (values.hasOwnProperty(key) && values[key] === undefined || values[key] === null) {
                delete values[key];
            }
        }

        const errors: SchemaValidationError[] = SDocRecordSchema.validate(values);
        if (errors !== undefined && errors.length > 0) {
            let msg = '';
            errors.map((value: SchemaValidationError, index, array) => {
                msg += '- ' + value.path + ':' + value.expected + '<br>';
            });
            this.toastr.warning('Leider passen nicht alle Eingaben - Fehler:' + msg, 'Oje!');
            return false;
        }

        this.save.emit(values);
        return false;
    }
}

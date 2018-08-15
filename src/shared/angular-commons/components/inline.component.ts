import {ChangeDetectorRef, OnChanges, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../services/component.utils';

export abstract class AbstractInlineComponent implements OnChanges {
    constructor(protected cd: ChangeDetectorRef) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    protected abstract updateData(): void;
}

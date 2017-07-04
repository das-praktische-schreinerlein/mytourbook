import {SimpleChange} from '@angular/core';
import * as deepEqual from 'deep-equal';

export class ComponentUtils {
    public static hasNgChanged(changes: {[propKey: string]: SimpleChange}): boolean {
        let changed = false;
        for (const propName in changes) {
            const changedProp = changes[propName];
            const to = changedProp.currentValue;
            if (changedProp.isFirstChange()) {
                console.error(`Initial value of ${propName} set to ${to}`);
                return changed = true;
            } else {
                const from = changedProp.previousValue;
                if (!deepEqual(from, to)) {
                    console.error(`${propName} changed from ${from} to ${to}`);
                    return true;
                }
            }
        }

        return false;
    }
}

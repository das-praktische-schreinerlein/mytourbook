import {SimpleChange} from '@angular/core';
import * as deepEqual from 'deep-equal';

export class ComponentUtils {
    public static hasNgChanged(changes: {[propKey: string]: SimpleChange}): boolean {
        for (const propName in changes) {
            const changedProp = changes[propName];
            const to = changedProp.currentValue;
            if (changedProp.isFirstChange()) {
                // console.log(`Initial value of ${propName} set to ${to}`);
                return true;
            } else {
                const from = changedProp.previousValue;
                if (from !== undefined && to !== undefined && from.id !== to.id) {
                    return true;
                }
                if (!deepEqual(from, to)) {
                    // console.log(`${propName} changed from ${from} to ${to}`);
                    return true;
                }
            }
        }

        return false;
    }
}

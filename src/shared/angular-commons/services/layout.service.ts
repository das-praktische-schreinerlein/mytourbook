import {Injectable} from '@angular/core';
import {FromEventObservable} from 'rxjs/src/observable/FromEventObservable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export enum LayoutSize {
    VERYSMALL,
    SMALL,
    BIG,
    VERYBIG
}

export interface LayoutSizeData {
    layoutSize: LayoutSize;
    width: number;
    height: number;
}

@Injectable()
export class LayoutService {
    private layoutSizeObservable = new BehaviorSubject<LayoutSizeData>(this.calcLayoutSizeForWindow());

    constructor() {
        const $resizeEvent = FromEventObservable.create(window, 'resize');
        $resizeEvent.subscribe(data => {
            this.layoutSizeObservable.next(this.calcLayoutSizeForWindow());
        });
    }

    public getLayoutSizeData(): BehaviorSubject<LayoutSizeData> {
        return this.layoutSizeObservable;
    }

    protected calcLayoutSizeForWindow(): LayoutSizeData {
        if (window === undefined) {
            return {
                layoutSize: this.calcLayoutSizeForWidth(undefined),
                width: 900,
                height: 700
            };
        }

        return  {
            layoutSize: this.calcLayoutSizeForWidth(window.innerWidth),
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    protected calcLayoutSizeForWidth(width: number): LayoutSize {
        if (width === undefined) {
            return LayoutSize.BIG;
        }
        if (width < 400) {
            return LayoutSize.VERYSMALL;
        }
        if (width < 767) {
            return LayoutSize.SMALL;
        }
        if (width < 1300) {
            return LayoutSize.BIG;
        }

        return LayoutSize.VERYBIG;
    }
}

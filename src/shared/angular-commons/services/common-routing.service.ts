import {Injectable} from '@angular/core';
import {NavigationExtras, NavigationStart, Router, UrlTree} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

export enum RoutingState {
    DONE = 1,
    RUNNING = 2
}

@Injectable()
export class CommonRoutingService {
    private routingStateObservable = new BehaviorSubject<RoutingState>(RoutingState.DONE);

    constructor(private router: Router) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationStart) {
                this.setRoutingState(RoutingState.RUNNING);
            }
        });
    }

    getRoutingState(): Subject<RoutingState> {
        return this.routingStateObservable;
    }

    setRoutingState(newState: RoutingState) {
        this.routingStateObservable.next(newState);
    }

    public navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
        const result: Promise<boolean> = this.router.navigateByUrl(url, extras);

        return result;
    }

}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from '../utility';

@Injectable()
export class MockDataprofilesInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/data_profiles/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            const dps = utils.dataprofiles.findByOrganizationId(matches[1]);
                            return of(new HttpResponse({
                                status: 200,
                                body: dps
                            }));
                        }
                        case 'POST': {
                            const res = utils.dataprofiles.updateByOrganizationId(matches[1], request.body);
                            return of(new HttpResponse({
                                status: 200,
                                body: res
                            }));
                        }
                    }
                }

                return next.handle(request);
            }),
            materialize(),
            delay(500),
            dematerialize()
        );
    }
}

export let mockDataprofilesProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockDataprofilesInterceptor,
    multi: true
};

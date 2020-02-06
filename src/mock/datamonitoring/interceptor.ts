import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from '../utility';

@Injectable()
export class MockDatamonitoringInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/object_data/);
                if (matches) {
                    switch (request.method) {
                        case 'GET': {
                            const oid = request.params.get('object_id');
                            const from_time = request.params.get('from_time');
                            const to_time = request.params.get('to_time');
                            if (!oid || !from_time || !to_time) {
                                return throwError({
                                    'code': 'DATAMONITORING_FEW_PARAMS',
                                    'status': 400,
                                    'name': 'DATAMONITORING_FEW_PARAMS',
                                    'message': 'Too few params',
                                });
                            }
                            const dm = utils.datamonitoring.generateRandomData(matches[1], oid, from_time, to_time);
                            return of(new HttpResponse({
                                status: 200,
                                body: {
                                    total: dm.length,
                                    data: dm
                                }
                            }));
                        }
                    }
                }

                return next.handle(request);
            }),
            materialize(),
            delay(80),
            dematerialize()
        );
    }
}

export let mockDatamonitoringProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockDatamonitoringInterceptor,
    multi: true
};

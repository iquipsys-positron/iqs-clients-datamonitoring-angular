import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

import * as utils from '../utility';

const defaultError = {
    'code': 'DEVICEPROFILE_NOT_FOUND',
    'status': 400,
    'name': 'DEVICEPROFILE_NOT_FOUND',
    'message': 'Deviceprofile not found',
};

@Injectable()
export class MockDeviceprofilesInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(
            mergeMap(() => {
                const matches = request.url.match(/\/api\/v1\/organizations\/(.{32})\/devices\/profiles/);
                if (matches) {
                    const actionMatches = request.url.match(/\/api\/v1\/organizations\/.{32}\/devices\/profiles\/(.*)/);
                    if (!actionMatches) {
                        switch (request.method) {
                            case 'GET': {
                                const dps = utils.deviceprofiles.findByOrganizationId(matches[1]);
                                return of(new HttpResponse({
                                    status: 200,
                                    body: {
                                        total: dps.length,
                                        data: dps
                                    }
                                }));
                            }
                            case 'POST': {
                                const res = utils.deviceprofiles.create(request.body);
                                return of(new HttpResponse({
                                    status: 200,
                                    body: res
                                }));
                            }
                        }
                    } else {
                        if (actionMatches[1] === 'base' && request.method === 'GET') {
                            return of(new HttpResponse({
                                status: 200,
                                body: utils.deviceprofiles.getBaseDeviceProfiles()
                            }));
                        } else {
                            switch (request.method) {
                                case 'GET': {
                                    const dps = utils.deviceprofiles.findById(matches[1], actionMatches[1]);
                                    return of(new HttpResponse({
                                        status: 200,
                                        body: dps
                                    }));
                                }
                                case 'PUT': {
                                    const res = utils.deviceprofiles.update(actionMatches[1], request.body);
                                    if (res) {
                                        return of(new HttpResponse({
                                            status: 200,
                                            body: res
                                        }));
                                    } else {
                                        return throwError(defaultError);
                                    }
                                }
                                case 'DELETE': {
                                    const res = utils.deviceprofiles.delete(actionMatches[1]);
                                    if (res) {
                                        return of(new HttpResponse({
                                            status: 200,
                                            body: res
                                        }));
                                    } else {
                                        return throwError(defaultError);
                                    }
                                }
                            }
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

export let mockDeviceprofilesProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockDeviceprofilesInterceptor,
    multi: true
};

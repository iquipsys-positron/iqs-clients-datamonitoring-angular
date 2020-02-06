import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';

import { eventsListTranslations } from './events-list.strings';
import { EventValue } from '../../models';
import { trackBy } from '../../../common';
import { ValueType } from '../../../dataprofiles';

@Component({
    selector: 'iqs-events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss']
})
export class IqsDatamonitoringEventsListComponent implements OnInit, OnChanges {

    public timeIdx: number;
    public trackByDateVal = trackBy('dateVal');

    @Input() date: _moment.Moment;
    @Input() events: EventValue[];

    constructor(
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', eventsListTranslations.en, true);
        this.translate.setTranslation('ru', eventsListTranslations.ru, true);
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.events && this.date) {
            const dateVal = this.date.valueOf();
            this.timeIdx = this.events.findIndex(e => e.dateVal > dateVal) - 1;
            if (this.timeIdx === -2) {
                this.timeIdx = this.events.length - 1;
            }
        }
    }

    public formatValue(event: EventValue) {
        let ret: string;
        switch (event.type) {
            case ValueType.Boolean:
                ret = this.translate.instant('VALUE_TYPE_BOOLEAN_' + (event.value ? 'YES' : 'NO'));
                break;
            case ValueType.Float:
                ret = parseFloat(event.value.toFixed(4)).toString();
                break;
            default:
                ret = event.value.toString();
                break;
        }
        if (event.unit) {
            ret += ` (${event.unit})`;
        }
        return ret;
    }

}

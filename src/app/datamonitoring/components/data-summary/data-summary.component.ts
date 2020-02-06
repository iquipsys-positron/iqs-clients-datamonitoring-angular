import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';

import { ChartParam, ChartParamValue } from '../../models';
import { ValueType } from '../../../dataprofiles';
import { trackBy } from '../../../common';

const moment = _moment;

@Component({
    selector: 'iqs-data-summary',
    templateUrl: './data-summary.component.html',
    styleUrls: ['./data-summary.component.scss']
})
export class IqsDatamonitoringDataSummaryComponent implements OnInit, OnChanges {

    public summaries: ChartParamValue[];
    public trackByName = trackBy('name');

    @Input() date: _moment.Moment;
    @Input() params: ChartParam[];

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.date && this.params) {
            const dateVal = this.date.valueOf();
            const summaries: ChartParamValue[] = [];
            const now = moment();
            for (const param of this.params) {
                if (!param.values || !param.values.length) { continue; }
                let idx = param.values.findIndex(p => p.value[0] > dateVal);
                const summary: ChartParamValue = { name: param.name, value: null };
                if (idx === 0 || this.date.isAfter(now)) {
                    summary.value = '?';
                } else {
                    if (idx === -1) { idx = param.values.length; }
                    switch (param.type) {
                        case ValueType.Boolean:
                            summary.value = this.translate.instant('VALUE_TYPE_BOOLEAN_' + (param.values[idx - 1].value[1] ? 'YES' : 'NO'));
                            break;
                        case ValueType.Float:
                            summary.value = parseFloat(param.values[idx - 1].value[1].toFixed(4)).toString();
                            break;
                        default:
                            summary.value = param.values[idx - 1].value[1].toString();
                            break;
                    }
                    if (param.unit) {
                        summary.value += ` (${param.unit})`;
                    }
                }
                summaries.push(summary);
            }
            this.summaries = summaries;
        }
    }

}

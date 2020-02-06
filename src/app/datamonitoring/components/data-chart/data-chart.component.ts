import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import maxBy from 'lodash/maxBy';
import * as _moment from 'moment';

import { ChartParam } from '../../models';
import { ValueType } from '../../../dataprofiles';

const moment = _moment;

@Component({
    selector: 'iqs-data-chart',
    templateUrl: './data-chart.component.html',
    styleUrls: ['./data-chart.component.scss']
})
export class IqsDatamonitoringDataChartComponent implements OnInit, OnChanges {

    public options: any;
    public mergeOptions = { series: [] };
    public minHeight = 0;

    @Input() date: _moment.Moment;
    @Input() live: boolean;
    @Input() params: ChartParam[];
    @Input() single: boolean;

    @Output() dateChanged = new EventEmitter<string>();

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['single'] || (changes['params'] && changes['params'].firstChange)) {
            this._initOptions();
        }
        if (changes['params'] || changes['live'] || changes['date'] || changes['single']) {
            this._generateSeries();
        }
        this.minHeight = this.params.length * 300 + 52;
        if (changes['date'] && this.options) {
            if (this.options.xAxis && this.options.xAxis.length) {
                for (const xAxis of this.options.xAxis) {
                    xAxis['min'] = changes['date'].currentValue.clone().startOf('d').valueOf();
                    xAxis['max'] = changes['date'].currentValue.clone().endOf('d').valueOf();
                }
            }
        }
    }

    private _initOptions() {
        const keysCount = Object.keys(this.params).length;
        let idx = 0;
        this.options = {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any[]) => {
                    let res = '';
                    params = params.sort((a, b) => a.seriesIndex - b.seriesIndex).filter(p => p.seriesName !== 'live');
                    for (const param of params) {
                        const i = this.single ? param.seriesIndex : param.seriesIndex / 2;
                        const val = this.single
                            ? param.value[1].toFixed(2) + '%'
                            : (this.params[i].type === ValueType.Boolean
                                ? this.translate.instant(param.value[1] ? 'VALUE_TYPE_BOOLEAN_YES' : 'VALUE_TYPE_BOOLEAN_NO')
                                : param.value[1]);
                        res += '<div>' + param.marker + ' ' + param.name + ': ' + val + '</div>';
                    }
                    return res;
                },
                axisPointer: {
                    animation: false,
                    snap: false
                }
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100,
                    filterMode: 'none'
                }
            ],
            grid: [],
            xAxis: [],
            yAxis: [],
            series: []
        };
        if (this.single) {
            this.options.dataZoom[0].xAxisIndex = 0;
            this.options.legend = {
                data: this.params.map(p => p.name)
            };
            const xAxis = {
                type: 'time',
            };
            if (this.date) {
                xAxis['min'] = this.date.clone().startOf('d').valueOf();
                xAxis['max'] = this.date.clone().endOf('d').valueOf();
            }
            this.options.grid.push({
                left: 50,
                right: 50,
                top: 30,
                height: '85%'
            });
            this.options.xAxis.push(xAxis);
            this.options.yAxis.push({
                type: 'value'
            });
        } else {
            this.options.dataZoom[0].xAxisIndex = Array.apply(null, { length: keysCount }).map(Function.call, Number);
            for (const param of this.params) {
                const xAxis = {
                    gridIndex: idx,
                    type: 'time'
                };
                const yAxis = {
                    gridIndex: idx,
                    name: param.name,
                    nameAlign: 'center',
                    nameTextStyle: {
                        align: 'left',
                        fontFamily: 'Roboto',
                        padding: [0, 0, 0, param.name.length * 7]
                    },
                    type: 'value',
                };
                if (this.date) {
                    xAxis['min'] = this.date.clone().startOf('d').valueOf();
                    xAxis['max'] = this.date.clone().endOf('d').valueOf();
                }
                this.options.grid.push({
                    left: 50,
                    right: 50,
                    top: (idx * 95 / keysCount + 5) + '%',
                    height: (95 / keysCount - 10) + '%',
                });
                if (param.unit) {
                    yAxis.name += ` (${param.unit})`;
                }
                this.options.xAxis.push(xAxis);
                this.options.yAxis.push(yAxis);
                idx++;
            }
        }
    }

    private _generateSeries() {
        let idx = 0;
        const series = [];
        const now = moment();
        const currentDate = this.date && this.date.isSameOrBefore(now) ? this.date : now;
        const currentDateVal = currentDate.valueOf();
        const params: ChartParam[] = cloneDeep(this.params);
        for (const param of params) {
            if (param.values && param.values.length) {
                const i = param.values.findIndex(v => currentDateVal < v.value[0]);
                const item = {
                    name: currentDate.format('HH:mm:ss'),
                    value: [currentDateVal, 0]
                };
                if (i > 0) {
                    item.value[1] = param.values[i - 1].value[1];
                    param.values.splice(i, 0, item);
                } else if (i === -1) {
                    item.value[1] = param.values[param.values.length - 1].value[1];
                    param.values.push(item);
                }
            }
            // DATA
            const max = cloneDeep(maxBy(param.values, p => p.value[1])).value[1];
            const serie = {
                xAxisIndex: this.single ? 0 : idx,
                yAxisIndex: this.single ? 0 : idx,
                name: param.name,
                type: 'line',
                symbolSize: 8,
                hoverAnimation: true,
                data: this.single ? param.values.map(p => {
                    p.value[1] = p.value[1] / max * 100;
                    return p;
                }) : param.values
            };
            if (param.type === ValueType.Boolean) {
                serie['step'] = 'end';
            }
            series.push(serie);
            // DATE LINE
            if (!this.single) {
                series.push({
                    xAxisIndex: idx,
                    yAxisIndex: idx,
                    type: 'line',
                    name: 'live',
                    lineStyle: {
                        color: '#0F0'
                    },
                    showSymbol: false,
                    hoverAnimation: false,
                    data: [
                        { name: this.date.format('HH:mm:ss'), value: [this.date.valueOf(), 0] },
                        { name: this.date.format('HH:mm:ss'), value: [this.date.valueOf(), max] }
                    ]
                });
            }
            idx++;
        }
        if (this.single) {
            series.push({
                type: 'line',
                name: 'live',
                lineStyle: {
                    color: '#0F0'
                },
                showSymbol: false,
                hoverAnimation: false,
                data: [
                    { name: this.date.format('HH:mm:ss'), value: [this.date.valueOf(), 0] },
                    { name: this.date.format('HH:mm:ss'), value: [this.date.valueOf(), 100] }
                ]
            });
        }
        this.mergeOptions = { series };
    }

    public onChartInit(chart: any) {
        chart.getZr().on('click', params => {
            const pointInPixel = [params.offsetX, params.offsetY];
            const pointInGrid = chart.convertFromPixel('grid', pointInPixel);
            if (pointInGrid && pointInGrid.length) {
                const date = moment(pointInGrid[0]);
                if (date.isBetween(this.date.clone().startOf('d'), this.date.clone().endOf('d'))) {
                    this.dateChanged.emit(date.format('HH:mm'));
                }
            }
        });
        let leftButtonDown = false;
        chart.getZr().on('mousedown', params => {
            if (params.which === 1) { leftButtonDown = true; }
        });
        chart.getZr().on('mouseup', params => {
            if (leftButtonDown && params.which === 1) { leftButtonDown = false; }
        });
        chart.getZr().on('mousemove', params => {
            if (leftButtonDown) {
                const pointInPixel = [params.offsetX, params.offsetY];
            const pointInGrid = chart.convertFromPixel('grid', pointInPixel);
            if (pointInGrid && pointInGrid.length) {
                const date = moment(pointInGrid[0]);
                if (date.isBetween(this.date.clone().startOf('d'), this.date.clone().endOf('d'))) {
                    this.dateChanged.emit(date.format('HH:mm'));
                }
            }
            }
        });
    }

}

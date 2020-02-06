import { ValueType } from '../../dataprofiles';

export class ChartParamValue {
    // chart param name to display on 'X' axis
    public name: string;
    // chart param value; format: [x, y]
    public value: any;
}

export class ChartParam {
    // param id
    public id: number;
    // param type
    public typ: number;
    // param localized name
    public name?: string;
    // chart param values
    public values: ChartParamValue[];
    // param value type
    public type?: ValueType;
    // values unit
    public unit?: string;
}

export class EventValue {
    // event id
    public id: number;
    // date value
    public dateVal: number;
    // event type
    public typ: number;
    // event localized name
    public name?: string;
    // event value
    public value: number;
    // event value type
    public type?: ValueType;
    // event unit
    public unit?: string;
}

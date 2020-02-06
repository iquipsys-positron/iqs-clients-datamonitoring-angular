export class ObjectDataValue {
    public time: Date;
    public states?: any[];
    public commands?: any[];
    public events?: any[];
    public params?: any[];
}

export class ObjectData {
    public object_id: string;
    public organization_id: string;
    public start_time: Date;
    public end_time: Date;
    public values?: ObjectDataValue[];
}

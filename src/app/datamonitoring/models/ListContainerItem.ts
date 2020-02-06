export class ListContainerItemParam {
    public name: string;
    public value?: string;
}

export class ListContainerItem {
    public id: string;
    public title: string;
    public subtitle: string;
    public params?: ListContainerItemParam[];
}

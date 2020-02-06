import { ListContainerItem } from './ListContainerItem';

export class ListContainerItemsGroup {
    public id: string;
    public name: string;
    public items: ListContainerItem[];

    constructor() { this.items = []; }
}

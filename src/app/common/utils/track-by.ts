export function trackBy(propName: string) {
    return function (item: any) {
        return item && (item.hasOwnProperty(propName) || null) && item[propName];
    };
}

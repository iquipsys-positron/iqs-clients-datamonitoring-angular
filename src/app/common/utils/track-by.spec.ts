import { trackBy } from './track-by';

describe('[Datamonitoring] containers/list-container', () => {
    it('should track', () => {
        const trackById = trackBy('id');
        const TranckByUndefined = trackBy(undefined);
        expect(trackById(null)).toEqual(null);
        expect(trackById(<any>{ id: '5' })).toEqual('5');
        expect(TranckByUndefined(<any>{ id: '5' })).toEqual(null);
    });
});

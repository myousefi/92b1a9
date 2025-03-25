import { getBlueprintGraphUrl } from '../../services/api/apiClient';

describe('API Client', () => {
    describe('getBlueprintGraphUrl', () => {
        it('returns the correct URL for the blueprint graph endpoint', () => {
            const url = getBlueprintGraphUrl();
            expect(url).toBe('/api/v1/frontendchallengeserver/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph');
        });
    });
});

import {discover} from '../discover/index';
import 'mocha'
import {existsSync, readFileSync, unlinkSync} from 'fs';
import {expect} from 'chai';

describe('Landscape Discovery', () => {

    beforeEach(() => {
        if(existsSync('landscape.json')) {
            unlinkSync('landscape.json');
        }
    });

    describe('discover', () => {
        it('should create the landscape.json', () => {
            discover('integration-test/big-multi-module/tsconfig.json');
            const expected = readFileSync('integration-test/big-multi-module/expected-landscape.json', 'utf8');
            const generated = readFileSync('landscape.json', 'utf8');
            expect(JSON.parse(generated)).to.deep.equal(JSON.parse(expected));
        }).timeout(10000);
    });
});
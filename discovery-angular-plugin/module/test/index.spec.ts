import 'mocha'
import {existsSync, readFileSync, unlinkSync} from 'fs';
import {expect} from 'chai';
import {discoverAngularLandzcape} from "../discover/discovery";

describe('Landscape Discovery', () => {

    beforeEach(() => {
        if(existsSync('landscape.json')) {
            unlinkSync('landscape.json');
        }
    });

    describe('discover', () => {
        it('should create the landscape.json', () => {
            discoverAngularLandzcape('integration-test/big-multi-module/tsconfig.json');
            const expected = readFileSync('integration-test/big-multi-module/expected-landscape.json', 'utf8');
            const generated = readFileSync('integration-test/big-multi-module/big-landscape.json', 'utf8');
            expect(JSON.parse(generated)).to.deep.equal(JSON.parse(expected));
        }).timeout(10000);
    });
});
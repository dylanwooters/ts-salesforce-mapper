import * as chai from 'chai';
import {describe, it} from 'mocha';
import { mapToSalesforce, mapNestedToSalesforce } from '../src/SalesforceMapper';
import { Account } from './models/Account';
import { User } from './models/User';
import util from 'util';

const expect = chai.expect;

describe('SalesforceMapper Tests', () => {
    let user = new User('u-123', new Date(), 'Dale Cooper', '11 WhiteLodge Ln', 'Twin Peaks', 'WA', '98170', true, 'active');
    let account = new Account('a-987', 'Twin Peaks Sheriff Dept.', 'Agent Dale Cooper', [user]);

    it('should map a model to a salesforce object', () => {
        let sfObj = mapToSalesforce(user);
        console.log('Mapped Salesforce object: ', util.inspect(sfObj, false, null, true));
        expect(sfObj).to.be.a('Object');
    });

    it('should map a nested model to a salesforce object', () => {
        let sfObjNested = mapNestedToSalesforce(account);
        console.log('Mapped Salesforce object (nested): ', util.inspect(sfObjNested, false, null, true));
        expect(sfObjNested).to.be.a('Object');
    });
});

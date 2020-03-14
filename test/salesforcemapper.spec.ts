import * as chai from 'chai';
import {describe, it} from 'mocha';
import { mapToSalesforce, mapNestedToSalesforce, mapFromSalesforce } from '../src/SalesforceMapper';
import { Account } from './models/Account';
import { User } from './models/User';
import util from 'util';

const expect = chai.expect;

describe('SalesforceMapper Tests', () => {
    let user = new User('u-123', new Date(), 'Dale Cooper', '11 WhiteLodge Ln', 'Twin Peaks', 'WA', '98170', true, 'active');
    let account = new Account('a-987', 'Twin Peaks Sheriff Dept.', 'Agent Dale Cooper', [user]);

    it('should map an application model to a salesforce object', () => {
        let sfObj = mapToSalesforce(user);
        console.log('Mapped Salesforce object: ', util.inspect(sfObj, false, null, true));
        expect(sfObj).to.be.a('Object');
    });

    it('should map a nested application model to a salesforce object', () => {
        let sfObjNested = mapNestedToSalesforce(account);
        console.log('Mapped Salesforce object (nested): ', util.inspect(sfObjNested, false, null, true));
        expect(sfObjNested).to.be.a('Object');
    });

    it('should map a salesforce object to a model', () => {
        let sfObj = { Id: 'u-123',
            CreatedDate: new Date(),
            Full_Name__c: 'Saul Goodman',
            MailingStreet: '22 Hermanos St',
            MailingCity: 'Albuquerque',
            MailingState: 'NM',
            MailingPostalCode: '87113',
            Email_Verified__c: false,
            Status__c: 'pending' 
        };
        let model = mapFromSalesforce(user, sfObj);
        console.log('Mapped model: ', util.inspect(model, false, null, true));
        expect(model).to.be.a('Object');
    });

    it('should map a nested salesforce object to a model', () => {
        let sfObjNested = { 
            attributes: { type: 'Account', referenceId: 'AccountRef0' },
            Id: 'a-456',
            Name: 'Twin Peaks Sheriff Dept.',
            Account_Contact_Name__c: 'Agent Dale Cooper',
            Contacts:
                { records: [ { 
                    Id: 'u-654',
                    attributes: { type: 'Contact', referenceId: 'ContactRef0' },
                    CreatedDate: new Date(),
                    Full_Name__c: 'Dale Cooper',
                    MailingStreet: '11 WhiteLodge Ln',
                    MailingCity: 'Twin Peaks',
                    MailingState: 'WA',
                    MailingPostalCode: '98170',
                    Email_Verified__c: true,
                    Status__c: 'active' 
                } ] } 
        };
        let nestedModel = mapFromSalesforce(account, sfObjNested);
        console.log('Mapped model (nested): ', util.inspect(nestedModel, false, null, true));
        expect(nestedModel).to.be.a('Object');
    });
});

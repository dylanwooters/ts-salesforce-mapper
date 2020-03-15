import * as chai from 'chai';
import {describe, it} from 'mocha';
import { mapToSalesforce, mapNestedToSalesforce, mapFromSalesforce, getObj } from '../src/SalesforceMapper';
import { Account } from './models/Account';
import { User } from './models/User';
import util from 'util';
import * as jsforce from 'jsforce';
import * as fs from 'fs';
import * as path from 'path';

const expect = chai.expect;
let conn: any;
const compositeURL: string = '/services/data/v34.0/composite/tree/';

describe('SalesforceMapper Tests', () => {

    //connect to salesforce before tests
    before(() => {
        let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../keys/salesforce.json')).toString());
        conn = new jsforce.Connection({
            //you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl : 'https://na111.salesforce.com/'
        });
        return conn.login(creds.username, creds.password, (err: any, userInfo: any) => {
            if (err) { 
                throw err;
            }
        });
    });

    //logout after tests
    after(() => {
        return conn.logout();
    });

    //setup test data
    let user = new User('u-123', 'Dale', 'Cooper', 'Dale Cooper', '11 Owl Crest Blvd', 'Twin Peaks', 'WA', '98170', true, 'active');
    let account = new Account('a-987', 'Twin Peaks Sheriff Dept.', 'Agent Dale Cooper', [user]);
    
    let sfObj = { Id: 'u-123',
        Full_Name__c: 'Saul Goodman',
        MailingStreet: '22 Hermanos St',
        MailingCity: 'Albuquerque',
        MailingState: 'NM',
        MailingPostalCode: '87113',
        Email_Verified__c: false,
        Status__c: 'pending' 
    };

    let sfObjNested = { 
        attributes: { type: 'Account', referenceId: 'AccountRef0' },
        Id: 'a-111',
        Name: 'Better Call LLC',
        Account_Contact_Name__c: 'Saul Goodman, Esquire',
        Contacts:
            { records: [ { 
                Id: 'u-999',
                attributes: { type: 'Contact', referenceId: 'ContactRef0' },
                Full_Name__c: 'Saul Goodman',
                MailingStreet: '22 Hermanos St',
                MailingCity: 'Albuquerque',
                MailingState: 'NM',
                MailingPostalCode: '87113',
                Email_Verified__c: false,
                Status__c: 'pending' 
            } ] } 
    };

    //run tests
    it('should map an application model to a salesforce object', () => {
        let sfObj = mapToSalesforce(user);
        console.log('Mapped Salesforce object: ', util.inspect(sfObj, false, null, true));
        expect(sfObj).to.be.a('Object');
    });

    it('should create a mapped salesforce object in salesforce', (done) => {
        let sfObj = mapToSalesforce(user);
        conn.sobject(getObj(user)).create(sfObj, function(err: any, ret: any) {
            if (err) {
                throw err;
            }
            expect(ret.success).to.be.true;
            done();
        });
    });

    it('should map a nested application model to a salesforce object', () => {
        let sfObjNested = mapNestedToSalesforce(account);
        console.log('Mapped Salesforce object (nested): ', util.inspect(sfObjNested, false, null, true));
        expect(sfObjNested).to.be.a('Object');
    });

    //TODO: test throws duplicate error - need to fix
    // it('should create a mapped, nested salesforce object in salesforce', (done) => {
    //     let sfObjNested = mapNestedToSalesforce(account);
    //     let url = compositeURL + getObj(account);
    //     conn.requestPost(url, sfObjNested, {}, function(err: any, ret: any) {
    //         console.log(ret);
    //         if (err) {
    //             throw err;
    //         }
    //         expect(ret.hasErrors).to.be.false;
    //         done();
    //     });
    // });

    it('should map a salesforce object to a model', () => {
        let model = mapFromSalesforce(user, sfObj);
        console.log('Mapped model: ', util.inspect(model, false, null, true));
        expect(model).to.be.a('Object');
    });

    it('it should map an object from salesforce to a model', (done) => {
        conn.sobject(getObj(user)).retrieve('0033h000001sDwJAAU', function(err: any, ret: any) {
            if (err) {
                throw err;
            }
            let u = mapFromSalesforce(user, ret);
            console.log(u);
            expect(u).to.be.a('Object');
            done();
        })
    });

    it('should map a nested salesforce object to a model', () => {
        let nestedModel = mapFromSalesforce(account, sfObjNested);
        console.log('Mapped model (nested): ', util.inspect(nestedModel, false, null, true));
        expect(nestedModel).to.be.a('Object');
    });

    it('it should map a nested object from salesforce to a model', (done) => {
        var soql = "SELECT Id, Name, Account_Contact_Name__c, (SELECT Id, FirstName, LastName, MailingStreet, MailingCity, MailingState, MailingPostalCode, Email_Verified__C, Enrollment_Status__c, Full_Name__c from Contacts) FROM Account WHERE Id = '0013h000002ObkpAAC'";
        conn.query(soql, function(err: any, ret: any) {
            if (err || ret.totalSize < 1) {
                throw err;
            }
            let a = mapFromSalesforce(account, ret.records[0]);
            expect(a).to.be.a('Object');
            done();
        });
    });
});

import { User } from './User';
import { SalesforceProp, SalesforceObj, SalesforceChildren } from '../../src/SalesforceMapper';

@SalesforceObj("Account")
export class Account {

    public Id: string;
    
    @SalesforceProp("Name")
    public Name: string;

    @SalesforceProp("Account_Contact_Name__c")
    public AccountContactName: string;

    @SalesforceChildren
    @SalesforceProp("Contacts")
    public Users: User[];

    constructor(id: string, name: string, accountContactName: string, users: User[]) {  
        this.Id = id;
        this.Name = name;
        this.AccountContactName = accountContactName;
        this.Users = users;
    }

  }
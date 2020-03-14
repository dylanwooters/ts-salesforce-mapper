import { Account } from './Account';
import { SalesforceProp, SalesforceObj, SalesforceParent } from '../../src/SalesforceMapper';

@SalesforceObj("Contact")
export class User {
  public Id: string;

  @SalesforceProp("CreatedDate")
  public CreatedDate: Date;

  @SalesforceProp("Full_Name__c")
  public FullName: string;

  @SalesforceProp("MailingStreet")
  public Street: string;
  
  @SalesforceProp("MailingCity")
  public City: string;
  
  @SalesforceProp("MailingState")
  public State: string;
  
  @SalesforceProp("MailingPostalCode")
  public PostalCode: string;

  @SalesforceProp("Email_Verified__c")
  public EmailVerified: boolean;

  @SalesforceProp("Status__c")
  public Status: string; 

  @SalesforceParent
  @SalesforceProp("Account")
  public Account!: Account;


  constructor(id: string, 
    createdDate: Date, 
    fullName: string, 
    street: string, 
    city: string, 
    state: string, 
    postalCode: string,
    emailVerified: boolean,
    status: string
    ) {
        this.Id = id;
        this.CreatedDate = createdDate;
        this.FullName = fullName;
        this.Street = street;
        this.City = city;
        this.State = state;
        this.PostalCode = postalCode;
        this.EmailVerified = emailVerified;
        this.Status = status;
  }

  

}
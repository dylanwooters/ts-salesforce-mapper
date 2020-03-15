# ts-salesforce-mapper
This package maps Typescript classes to Salesforce objects, and vice-versa. You can use ts-salesforce-mapper when working directly with the [Salesforce REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_working_with_records.htm), or when using an API wrapper like the popular [jsforce](https://jsforce.github.io/start/) library.

**Why use this?** A couple reasons:
1) It's annoying to have to name your classes and properties to agree with Salesforce, for example "My_Custom_Field__c". Too many underscores.
2) It's good to have separation between your application and Salesforce, to avoid tight coupling.

**Table of Contents**
- [Installation](#installation)
- [Usage](#usage)
  - [Decorate your classes](#decorate-your-classes)
  - [Map to Salesforce and back again](#map-to-salesforce-and-back-again)
  - [Nested objects and composite requests](#nested-objects-and-composite-requests)
  - [Getting Salesforce object and property names](#getting-salesforce-object-and-property-names)
- [Examples](#examples)
- [A note on property initialization](#a-note-on-property-initialization)
- [Release Notes](#release-notes)

# Installation

`npm install ts-salesforce-mapper`

# Usage

## Decorate your classes

Add the `SalesforceObj` and `SalesforceProp` decorators to your classes, to denote the Salesforce-specific object and property names.

```
import { SalesforceProp, SalesforceObj } from '../../src/SalesforceMapper';

@SalesforceObj("Contact")
export class User {
  public Id: string;

  @SalesforceProp("FirstName")
  public FirstName: string;

  @SalesforceProp("LastName")
  public LastName: string;

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

  @SalesforceProp("Enrollment_Status__c")
  public Status: string; 

  constructor(id: string,
    firstName: string,
    lastName: string, 
    fullName: string, 
    street: string, 
    city: string, 
    state: string, 
    postalCode: string,
    emailVerified: boolean,
    status: string
    ) {
        this.Id = id;
        this.FirstName = firstName,
        this.LastName = lastName,
        this.FullName = fullName;
        this.Street = street;
        this.City = city;
        this.State = state;
        this.PostalCode = postalCode;
        this.EmailVerified = emailVerified;
        this.Status = status;
  }
}
```

## Map to Salesforce and back again
Instantiate your class:

```
let user = new User('u-123', 'Dale', 'Cooper', 'Agent Dale Cooper', '11 Owl Crest Blvd', 'Twin Peaks', 'WA', '98170', true, 'active');
```
And map to a Salesforce object:
``` 
let sfObj = mapToSalesforce(user);
console.log(sfObj);
// console output:
// { Id: 'u-123',
//  FirstName: 'Dale',
//  LastName: 'Cooper',
//  Full_Name__c: 'Agent Dale Cooper',
//  MailingStreet: '11 Owl Crest Blvd',
//  MailingCity: 'Twin Peaks',
//  MailingState: 'WA',
//  MailingPostalCode: '98170',
//  Email_Verified__c: true,
//  Enrollment_Status__c: 'active' }
```
Or map back from a Salesforce object to your class:
```
let sfObj = { Id: 'u-123',
    FirstName: 'Saul',
    LastName: 'Goodman',
    Full_Name__c: 'Saul Goodman',
    MailingStreet: '22 Hermanos St',
    MailingCity: 'Albuquerque',
    MailingState: 'NM',
    MailingPostalCode: '87113',
    Email_Verified__c: false,
    Enrollment_Status__c: 'pending' 
};

let model = mapFromSalesforce(user, sfObj);
console.log(model);
// console output:
// { Id: 'u-123',
//  FirstName: 'Saul',
//  LastName: 'Goodman',
//  FullName: 'Saul Goodman',
//  Street: '22 Hermanos St',
//  City: 'Albuquerque',
//  State: 'NM',
//  PostalCode: '87113',
//  EmailVerified: false,
//  Status: 'pending' }
```

## Nested objects and composite requests

You can use the `SalesforceParent` and `SalesforceChildren` decorators to build complex nested classes.

Then, use the `mapNestedToSalesforce` function to create a nested Salesforce object that can be used for a [composite API request](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_composite_sobject_tree_create.htm).

## Getting Salesforce object and property names

If you need the string Salesforce object or property names, you can use the `getSFObj` and `getSFProp` helper functions, like this:

```
console.log(getSFObj(user));
// console output:
// "Contact"
```

# Examples

For examples on how to use nested objects, as well as integrate with jsforce, check out the [test models](https://github.com/dylanwooters/ts-salesforce-mapper/tree/master/test/models) and [mocha tests](https://github.com/dylanwooters/ts-salesforce-mapper/blob/master/test/salesforcemapper.spec.ts).

# A note on property initialization

In order for the library to map correctly, all properties decorated with `SalesforceProp` must be initialized. This can be done through assignment in the constructor, or by setting the properties to undefined. See [this article](https://mariusschulz.com/blog/strict-property-initialization-in-typescript) for more info.

This mainly comes into play when you use the `mapFromSalesforce` function. You may sometimes want to supply a newly instantiated class as the target, like this:

```
//to instantiate an "empty" User, you can initialize all properties as undefined in the class definition
let user = new User();
user = mapFromSalesforce(user, sfObj);
```

# Release Notes

1.0 - Initial release.

import "reflect-metadata";

//PROPERTY REFLECTION
const propMetadataKey = "SfProp";

//property decorator
export function SalesforceProp(alias:string) {
    return function (target: any, key: string) {
        Reflect.defineMetadata(propMetadataKey, alias, target, key);
    }
}

//parent child decorators
export function SalesforceChildren(target: any, key: string)  {
    Reflect.defineMetadata(propChildKey, propChildKey, target, key);
}

export function SalesforceParent(target: any, key: string)  {
    Reflect.defineMetadata(propParentKey, propParentKey, target, key);
}

//supporting functions
export function getProp(target: any, key: string) {
    return Reflect.getMetadata(propMetadataKey, target, key);
}

export function isChildren(target: any, key: string) {
    return Reflect.hasMetadata(propChildKey, target, key);
}

export function isParent(target: any, key: string) {
    return Reflect.hasMetadata(propParentKey, target, key);
}

//CLASS REFLECTION
const objMetadataKey = "SfObj";
const propChildKey = "SfChild";
const propParentKey = "SfParent";

//class decorator
export function SalesforceObj(alias:string) {
    function addObj (constructor: any) {
    var proto = constructor.prototype;
    Reflect.defineMetadata(objMetadataKey, alias, proto);
    }
    return <any>addObj;
}

//supporting function
export function getObj(target: any) {
    return Reflect.getMetadata(objMetadataKey, target);
}

//MAPPING FUNCTIONS
//map from application model to Salesforce object
export function mapToSalesforce(target: any){
    let returnObj: any = new Object();

    for (var property in target) {
        if (target.hasOwnProperty(property) && target[property] != undefined) {
            var sfProp = getProp(target, property);
            if (sfProp != undefined) {
                returnObj[sfProp] = target[property];
            } else if (property == 'Id') {
                returnObj['Id'] = target[property];
            }
        }
    }
    return returnObj;
}

//map from application model to nested Salesforce object for composite request
export function mapNestedToSalesforce(target: any, child: boolean = false, childNum: number = 0) {
    let returnObj: any = {
        attributes: {
            type: getObj(target),
            referenceId: getObj(target) + 'Ref' + childNum
        }
    };

    for (var property in target) {
        if (target.hasOwnProperty(property) && target[property] != undefined) {
            var sfProp = getProp(target, property);
            if (sfProp != undefined && !isParent(target, property)) {
                if (isChildren(target, property) && target[property].length > 0) {
                    returnObj[sfProp] = {
                        records: []
                    };
                    for(let i=0; i<target[property].length; i++) { 
                        var childTarget = target[property][i];
                        returnObj[sfProp]['records'].push(mapNestedToSalesforce(childTarget, true, i));
                    }
                } else {
                    returnObj[sfProp] = target[property];
                }
            }
        }
    }
    if (!child) {
        returnObj = { 
            records: [ returnObj ] 
        };
    }
    
    return returnObj;
}

//map from Salesforce object to application model
export function mapFromSalesforce(target: any, sourceObj: any){

    let returnObj: any = new Object();

    for (var property in target) {
        if (target.hasOwnProperty(property)) {
            if (property == "Id") {
                returnObj[property] = sourceObj[property];
            } else {
                var sfProp = getProp(target, property);
                if (sfProp != undefined) {
                    if (isParent(target, property) && sourceObj[sfProp]) {
                        returnObj[property] = mapFromSalesforce(target[property], sourceObj[sfProp]);
                    }
                    else if (isChildren(target, property) && sourceObj[sfProp] && sourceObj[sfProp]['records'].length > 0) {
                        returnObj[property] = new Array();
                        for(let i=0; i<sourceObj[sfProp]['records'].length; i++) { 
                            var childTarget = target[property][0];
                            var childSourceRecord = sourceObj[sfProp]['records'][i];
                            returnObj[property].push(mapFromSalesforce(childTarget, childSourceRecord));
                        }
                    } else {
                        returnObj[property] = sourceObj[sfProp];
                    }
                }
            }
        }
    }
    return returnObj;
}
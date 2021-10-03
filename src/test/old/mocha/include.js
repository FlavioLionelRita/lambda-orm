// const assert = require('assert');
// const orm = require("../dist/orm.js");
// let dialect= 'mysql';

// describe('include', function() {
//     describe('include relation oneToMany', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => p.customer)
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CustomerID` AS id, c.`CompanyName` AS name, c.`ContactName` AS contact, c.`ContactTitle` AS phone, c.`Address` AS address, c.`City` AS city, c.`Region` AS region, c.`PostalCode` AS postalCode, c.`Country` AS country FROM `Customers` c WHERE  c.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include relation manyToOne', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => p.details)
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT o1.`OrderID` AS orderId, o1.`ProductID` AS productId, o1.`UnitPrice` AS unitPrice, o1.`Quantity` AS quantity, o1.`Discount` AS discount FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"orderId","type":"integer"},{"name":"productId","type":"integer"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"},{"name":"discount","type":"bool"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include relation manyToOne and oneToMany', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => [p.details,p.customer])
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT o1.`OrderID` AS orderId, o1.`ProductID` AS productId, o1.`UnitPrice` AS unitPrice, o1.`Quantity` AS quantity, o1.`Discount` AS discount FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"orderId","type":"integer"},{"name":"productId","type":"integer"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"},{"name":"discount","type":"bool"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"},{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CustomerID` AS id, c.`CompanyName` AS name, c.`ContactName` AS contact, c.`ContactTitle` AS phone, c.`Address` AS address, c.`City` AS city, c.`Region` AS region, c.`PostalCode` AS postalCode, c.`Country` AS country FROM `Customers` c WHERE  c.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include relation two levels', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product),p.customer])
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"product","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT p.`ProductID` AS id, p.`ProductName` AS name, p.`SupplierID` AS supplierId, p.`CategoryID` AS categoryId, p.`QuantityPerUnit` AS quantity, p.`UnitPrice` AS price, p.`UnitsInStock` AS inStock, p.`UnitsOnOrder` AS onOrder, p.`ReorderLevel` AS reorderLevel, p.`Discontinued` AS discontinued FROM `Products` p WHERE  p.`ProductID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"decimal"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"bool"}],"v":["list_id"]}],"r":{"name":"product","type":"oneToMany","from":"productId","to":{"entity":"Products","property":"id"}},"v":"list_id"}],"s":"SELECT o1.`OrderID` AS orderId, o1.`ProductID` AS productId, o1.`UnitPrice` AS unitPrice, o1.`Quantity` AS quantity, o1.`Discount` AS discount FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"orderId","type":"integer"},{"name":"productId","type":"integer"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"},{"name":"discount","type":"bool"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"},{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CustomerID` AS id, c.`CompanyName` AS name, c.`ContactName` AS contact, c.`ContactTitle` AS phone, c.`Address` AS address, c.`City` AS city, c.`Region` AS region, c.`PostalCode` AS postalCode, c.`Country` AS country FROM `Customers` c WHERE  c.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include relation three levels', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product.include(p=>p.category)),p.customer])
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"product","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"category","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CategoryID` AS id, c.`CategoryName` AS name, c.`Description` AS description FROM `Categories` c WHERE  c.`CategoryID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"description","type":"string"}],"v":["list_id"]}],"r":{"name":"category","type":"oneToMany","from":"categoryId","to":{"entity":"Categories","property":"id"}},"v":"list_id"}],"s":"SELECT p.`ProductID` AS id, p.`ProductName` AS name, p.`SupplierID` AS supplierId, p.`CategoryID` AS categoryId, p.`QuantityPerUnit` AS quantity, p.`UnitPrice` AS price, p.`UnitsInStock` AS inStock, p.`UnitsOnOrder` AS onOrder, p.`ReorderLevel` AS reorderLevel, p.`Discontinued` AS discontinued FROM `Products` p WHERE  p.`ProductID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"decimal"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"bool"}],"v":["list_id"]}],"r":{"name":"product","type":"oneToMany","from":"productId","to":{"entity":"Products","property":"id"}},"v":"list_id"}],"s":"SELECT o1.`OrderID` AS orderId, o1.`ProductID` AS productId, o1.`UnitPrice` AS unitPrice, o1.`Quantity` AS quantity, o1.`Discount` AS discount FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"orderId","type":"integer"},{"name":"productId","type":"integer"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"},{"name":"discount","type":"bool"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"},{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c1.`CustomerID` AS id, c1.`CompanyName` AS name, c1.`ContactName` AS contact, c1.`ContactTitle` AS phone, c1.`Address` AS address, c1.`City` AS city, c1.`Region` AS region, c1.`PostalCode` AS postalCode, c1.`Country` AS country FROM `Customers` c1 WHERE  c1.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include with selected fieds', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => [p.details.map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})) ,p.customer])
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"product","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"category","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CategoryID` AS id, c.`CategoryName` AS name, c.`Description` AS description FROM `Categories` c WHERE  c.`CategoryID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"description","type":"string"}],"v":["list_id"]}],"r":{"name":"category","type":"oneToMany","from":"categoryId","to":{"entity":"Categories","property":"id"}},"v":"list_id"}],"s":"SELECT p.`ProductID` AS id, p.`ProductName` AS name, p.`SupplierID` AS supplierId, p.`CategoryID` AS categoryId, p.`QuantityPerUnit` AS quantity, p.`UnitPrice` AS price, p.`UnitsInStock` AS inStock, p.`UnitsOnOrder` AS onOrder, p.`ReorderLevel` AS reorderLevel, p.`Discontinued` AS discontinued FROM `Products` p WHERE  p.`ProductID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"decimal"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"bool"}],"v":["list_id"]}],"r":{"name":"product","type":"oneToMany","from":"productId","to":{"entity":"Products","property":"id"}},"v":"list_id"}],"s":"SELECT o1.`OrderID` AS orderId, o1.`ProductID` AS productId, o1.`UnitPrice` AS unitPrice, o1.`Quantity` AS quantity, o1.`Discount` AS discount FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"orderId","type":"integer"},{"name":"productId","type":"integer"},{"name":"unitPrice","type":"decimal"},{"name":"quantity","type":"decimal"},{"name":"discount","type":"bool"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"},{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c1.`CustomerID` AS id, c1.`CompanyName` AS name, c1.`ContactName` AS contact, c1.`ContactTitle` AS phone, c1.`Address` AS address, c1.`City` AS city, c1.`Region` AS region, c1.`PostalCode` AS postalCode, c1.`Country` AS country FROM `Customers` c1 WHERE  c1.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
//     describe('include with selected fieds on two level', function() {
//         let expression =
//         `Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product).map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})),p.customer])
//         `;
//         let expected ={"n":"sentence","t":"SqlQuery","c":[{"n":"details","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[{"n":"product","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT p.`ProductID` AS id, p.`ProductName` AS name, p.`SupplierID` AS supplierId, p.`CategoryID` AS categoryId, p.`QuantityPerUnit` AS quantity, p.`UnitPrice` AS price, p.`UnitsInStock` AS inStock, p.`UnitsOnOrder` AS onOrder, p.`ReorderLevel` AS reorderLevel, p.`Discontinued` AS discontinued FROM `Products` p WHERE  p.`ProductID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"supplierId","type":"integer"},{"name":"categoryId","type":"integer"},{"name":"quantity","type":"decimal"},{"name":"price","type":"decimal"},{"name":"inStock","type":"decimal"},{"name":"onOrder","type":"decimal"},{"name":"reorderLevel","type":"decimal"},{"name":"discontinued","type":"bool"}],"v":["list_id"]}],"r":{"name":"product","type":"oneToMany","from":"productId","to":{"entity":"Products","property":"id"}},"v":"list_id"}],"s":"SELECT o1.`Quantity` AS quantity, o1.`UnitPrice` AS unitPrice, o1.`ProductID` AS productId FROM `Order Details` o1 WHERE  o1.`OrderID` IN (?) ","cols":[{"name":"quantity","type":"decimal"},{"name":"unitPrice","type":"decimal"},{"name":"productId","type":"integer"}],"v":["list_orderId"]}],"r":{"name":"details","type":"manyToOne","from":"id","to":{"entity":"OrderDetails","property":"orderId"}},"v":"list_orderId"},{"n":"customer","t":"SqlInclude","c":[{"n":"sentence","t":"SqlQuery","c":[],"s":"SELECT c.`CustomerID` AS id, c.`CompanyName` AS name, c.`ContactName` AS contact, c.`ContactTitle` AS phone, c.`Address` AS address, c.`City` AS city, c.`Region` AS region, c.`PostalCode` AS postalCode, c.`Country` AS country FROM `Customers` c WHERE  c.`CustomerID` IN (?) ","cols":[{"name":"id","type":"integer"},{"name":"name","type":"string"},{"name":"contact","type":"string"},{"name":"phone","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["list_id"]}],"r":{"name":"customer","type":"oneToMany","from":"customerId","to":{"entity":"Customers","property":"id"}},"v":"list_id"}],"s":"SELECT o.`OrderID` AS id, o.`CustomerID` AS customerId, o.`EmployeeID` AS employeeId, o.`OrderDate` AS orderDate, o.`RequiredDate` AS requiredDate, o.`ShippedDate` AS shippedDate, o.`ShipVia` AS shipViaId, o.`Freight` AS freight, o.`ShipName` AS name, o.`ShipAddress` AS address, o.`ShipCity` AS city, o.`ShipRegion` AS region, o.`ShipPostalCode` AS postalCode, o.`ShipCountry` AS country FROM `Orders` o WHERE o.`OrderID` = ? ","cols":[{"name":"id","type":"integer"},{"name":"customerId","type":"integer"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}],"v":["id"]};
//         it(expression, async function() {
//             let result = (await orm.lambda(expression).compile(dialect,'northwind')).serialize();
//             assert.strictEqual(JSON.stringify(result),JSON.stringify(expected));
//         });
//     });
// });

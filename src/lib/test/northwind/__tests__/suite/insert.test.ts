/* eslint-disable no-template-curly-in-string */
import { orm } from '../../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/northwind.env' })
	await orm.init('./config/northwind.yaml')
})

describe('insert', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Categories.insert({name:name,description:description})')).toStrictEqual('Categories.insert({name:name,description:description})')
		expect(orm.normalize('Categories.insert()')).toStrictEqual('Categories.insert({name:name,description:description})')
		expect(orm.normalize('Categories.insert([name, description])')).toStrictEqual('Categories.insert({name:name,description:description})')
		expect(orm.normalize('Categories.insert(entity)')).toStrictEqual('Categories.insert({name:entity.name,description:entity.description})')
		expect(orm.normalize('Orders.insert()')).toStrictEqual('Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country})')
		expect(orm.normalize('Orders.insert().include(p => p.details)')).toStrictEqual('Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>p.details.insert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}))')
		expect(orm.normalize('Orders.insert().include(p => [p.details, p.customer])')).toStrictEqual('Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>p.details.insert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}))')
		expect(orm.normalize('Categories.insert(() => ({ name: name, description: description }))')).toStrictEqual('Categories.insert({name:name,description:description})')
		expect(orm.normalize('Categories.insert(p=>{name:p.name,description:p.description})')).toStrictEqual('Categories.insert({name:p.name,description:p.description})')
		expect(orm.normalize('Categories.insert(p=> [p.name,p.description])')).toStrictEqual('Categories.insert({name:name,description:description})')
		expect(orm.normalize('Categories.bulkInsert()')).toStrictEqual('Categories.bulkInsert({name:name,description:description})')
		expect(orm.normalize('Orders.bulkInsert().include(p => p.details)')).toStrictEqual('Orders.bulkInsert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>p.details.bulkInsert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}))')
		expect(orm.normalize('Orders.bulkInsert().include(p => [p.details, p.customer])')).toStrictEqual('Orders.bulkInsert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>p.details.bulkInsert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}))')
	})
	test('model', () => {
		expect(orm.model('Categories.insert({name:name,description:description})')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.insert()')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.insert([name, description])')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.insert(entity)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Orders.insert()')).toStrictEqual([{'name':'id','type':'integer'},{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}])
		expect(orm.model('Orders.insert().include(p => p.details)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Orders.insert().include(p => [p.details, p.customer])')).toStrictEqual([{'name':'id','type':'integer'},{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]},{'name':'customer','type':'Customers','children':[{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}]}])
		expect(orm.model('Categories.insert(() => ({ name: name, description: description }))')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.insert(p=>{name:p.name,description:p.description})')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.insert(p=> [p.name,p.description])')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.bulkInsert()')).toStrictEqual([{'name':'id','type':'integer'},{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Orders.bulkInsert().include(p => p.details)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Orders.bulkInsert().include(p => [p.details, p.customer])')).toStrictEqual([{'name':'id','type':'integer'},{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]},{'name':'customer','type':'Customers','children':[{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}]}])
	})
	test('parameters', () => {
		expect(orm.parameters('Categories.insert({name:name,description:description})')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.insert()')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.insert([name, description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.insert(entity)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.description','type':'string'}])
		expect(orm.parameters('Orders.insert()')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}])
		expect(orm.parameters('Orders.insert().include(p => p.details)')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.parameters('Orders.insert().include(p => [p.details, p.customer])')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]},{'name':'customer','type':'Customers','children':[{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}]}])
		expect(orm.parameters('Categories.insert(() => ({ name: name, description: description }))')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.insert(p=>{name:p.name,description:p.description})')).toStrictEqual([{'name':'p.name','type':'string'},{'name':'p.description','type':'string'}])
		expect(orm.parameters('Categories.insert(p=> [p.name,p.description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.bulkInsert()')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Orders.bulkInsert().include(p => p.details)')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.parameters('Orders.bulkInsert().include(p => [p.details, p.customer])')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]},{'name':'customer','type':'Customers','children':[{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'}]}])
	})
	test('constraints', () => {
		expect(orm.constraints('Categories.insert({name:name,description:description})')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.insert()')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.insert([name, description])')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.insert(entity)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Orders.insert()')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}]})
		expect(orm.constraints('Orders.insert().include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.insert().include(p => [p.details, p.customer])')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]},{"entity":"Customers","constraints":[{"message":"Cannot be null property id in entity Customers","condition":"isNotNull(id)"},{"message":"Cannot be null property name in entity Customers","condition":"isNotNull(name)"}]}]})
		expect(orm.constraints('Categories.insert(() => ({ name: name, description: description }))')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.insert(p=>{name:p.name,description:p.description})')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.insert(p=> [p.name,p.description])')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.bulkInsert()')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Orders.bulkInsert().include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.bulkInsert().include(p => [p.details, p.customer])')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]},{"entity":"Customers","constraints":[{"message":"Cannot be null property id in entity Customers","condition":"isNotNull(id)"},{"message":"Cannot be null property name in entity Customers","condition":"isNotNull(name)"}]}]})
	})
	test('getInfo', () => {
		expect(orm.getInfo('Categories.insert({name:name,description:description})',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.insert()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.insert([name, description])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.insert(entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Orders.insert()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)","children":[]})
		expect(orm.getInfo('Orders.insert().include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?)","children":[]}]})
		expect(orm.getInfo('Orders.insert().include(p => [p.details, p.customer])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?)","children":[]},{"entity":"Customers","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES(?,?,?,?,?,?,?,?,?)","children":[]}]})
		expect(orm.getInfo('Categories.insert(() => ({ name: name, description: description }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.insert(p=>{name:p.name,description:p.description})',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.insert(p=> [p.name,p.description])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES(?,?)","children":[]})
		expect(orm.getInfo('Categories.bulkInsert()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Categories(CategoryName,Description) VALUES ?","children":[]})
		expect(orm.getInfo('Orders.bulkInsert().include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES ?","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES ?","children":[]}]})
		expect(orm.getInfo('Orders.bulkInsert().include(p => [p.details, p.customer])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES ?","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES ?","children":[]},{"entity":"Customers","dialect":"MySQL","source":"MySQL","sentence":"INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES ?","children":[]}]})
	})
})
import { orm } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './src/test/test.env' })
	await orm.init('./src/test/config.yaml')
})
describe('Complete Expression', () => {
	test('include 1', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => p.customer)'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}))'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 2', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => p.details)'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>p.details.filter(p=>includes(p.orderId,list_orderId)).map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount}))'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 3', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.details, p.customer])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.details.filter(p=>includes(p.orderId,list_orderId)).map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount}),p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country})])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 4', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product), p.customer])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.details.map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount}).filter(p=>includes(p.orderId,list_orderId)).include(q=>q.product.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued})),p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country})])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 5', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product.include(p => p.category)), p.customer])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.details.map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount}).filter(p=>includes(p.orderId,list_orderId)).include(q=>q.product.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued}).filter(p=>includes(p.id,list_id)).include(p=>p.category.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,description:p.description}))),p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country})])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 6', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.details.map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.details.filter(p=>includes(p.orderId,list_orderId)).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country})])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 7', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product).map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.details.include(q=>q.product.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued})).filter(p=>includes(p.orderId,list_orderId)).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer.filter(p=>includes(p.id,list_id)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country})])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('include 8', () => {
		const source = 'Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])'
		const expected = 'Orders.filter(p=>(p.id==id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country}).include(p=>[p.customer.filter(p=>includes(p.id,list_id)).map(p=>p.name),p.details.include(p=>p.product.include(p=>p.category.filter(p=>includes(p.id,list_id)).map(p=>p.name)).filter(p=>includes(p.id,list_id)).map(p=>p.name)).filter(p=>includes(p.orderId,list_orderId)).map(p=>[p.quantity,p.unitPrice])])'
		const target = orm.expression(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('include 1', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => p.customer)'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 2', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => p.details)'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 3', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details, p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 4', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product), p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 5', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product.include(p => p.category)), p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean","category":{"id":"integer","name":"string","description":"string"}}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 6', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"quantity":"decimal","unitPrice":"decimal","productId":"integer"}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 7', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product).map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"quantity":"decimal","unitPrice":"decimal","productId":"integer","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
	test('include 8', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","customer":{"name":"string"},"details":[{"quantity":"decimal","unitPrice":"decimal","product":{"name":"string","category":{"name":"string"}}}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.expression(expression).model('northwind:0.0.2')
		const serialize = await orm.expression(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
		expect(parametersExpected).toStrictEqual(serialize.p)
	})
})
describe('Sentences', () => {
	test('include 1', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => p.customer)'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT c.CustomerID AS [id], c.CompanyName AS [name], c.ContactName AS [contact], c.ContactTitle AS [phone], c.Address AS [address], c.City AS [city], c.Region AS [region], c.PostalCode AS [postalCode], c.Country AS [country] FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 2', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => p.details)'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS [orderId], o1.ProductID AS [productId], o1.UnitPrice AS [unitPrice], o1.Quantity AS [quantity], o1.Discount AS [discount] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 3', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details, p.customer])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS [orderId], o1.ProductID AS [productId], o1.UnitPrice AS [unitPrice], o1.Quantity AS [quantity], o1.Discount AS [discount] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT c.CustomerID AS [id], c.CompanyName AS [name], c.ContactName AS [contact], c.ContactTitle AS [phone], c.Address AS [address], c.City AS [city], c.Region AS [region], c.PostalCode AS [postalCode], c.Country AS [country] FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 4', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product), p.customer])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS [orderId], o1.ProductID AS [productId], o1.UnitPrice AS [unitPrice], o1.Quantity AS [quantity], o1.Discount AS [discount] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CustomerID AS [id], c.CompanyName AS [name], c.ContactName AS [contact], c.ContactTitle AS [phone], c.Address AS [address], c.City AS [city], c.Region AS [region], c.PostalCode AS [postalCode], c.Country AS [country] FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN ($1) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 5', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product.include(p => p.category)), p.customer])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CategoryID AS `id`, c.CategoryName AS `name`, c.Description AS `description` FROM Categories c  WHERE  c.CategoryID IN (?) 
SELECT c1.CustomerID AS `id`, c1.CompanyName AS `name`, c1.ContactName AS `contact`, c1.ContactTitle AS `phone`, c1.Address AS `address`, c1.City AS `city`, c1.Region AS `region`, c1.PostalCode AS `postalCode`, c1.Country AS `country` FROM Customers c1  WHERE  c1.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS [orderId], o1.ProductID AS [productId], o1.UnitPrice AS [unitPrice], o1.Quantity AS [quantity], o1.Discount AS [discount] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CategoryID AS [id], c.CategoryName AS [name], c.Description AS [description] FROM Categories c  WHERE  c.CategoryID IN (:list_id) 
SELECT c1.CustomerID AS [id], c1.CompanyName AS [name], c1.ContactName AS [contact], c1.ContactTitle AS [phone], c1.Address AS [address], c1.City AS [city], c1.Region AS [region], c1.PostalCode AS [postalCode], c1.Country AS [country] FROM Customers c1  WHERE  c1.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CategoryID AS `id`, c.CategoryName AS `name`, c.Description AS `description` FROM Categories c  WHERE  c.CategoryID IN (?) 
SELECT c1.CustomerID AS `id`, c1.CompanyName AS `name`, c1.ContactName AS `contact`, c1.ContactTitle AS `phone`, c1.Address AS `address`, c1.City AS `city`, c1.Region AS `region`, c1.PostalCode AS `postalCode`, c1.Country AS `country` FROM Customers c1  WHERE  c1.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CategoryID AS "id", c.CategoryName AS "name", c.Description AS "description" FROM Categories c  WHERE  c.CategoryID IN (:list_id) 
SELECT c1.CustomerID AS "id", c1.CompanyName AS "name", c1.ContactName AS "contact", c1.ContactTitle AS "phone", c1.Address AS "address", c1.City AS "city", c1.Region AS "region", c1.PostalCode AS "postalCode", c1.Country AS "country" FROM Customers c1  WHERE  c1.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.OrderID AS "orderId", o1.ProductID AS "productId", o1.UnitPrice AS "unitPrice", o1.Quantity AS "quantity", o1.Discount AS "discount" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN ($1) 
SELECT c.CategoryID AS "id", c.CategoryName AS "name", c.Description AS "description" FROM Categories c  WHERE  c.CategoryID IN ($1) 
SELECT c1.CustomerID AS "id", c1.CompanyName AS "name", c1.ContactName AS "contact", c1.ContactTitle AS "phone", c1.Address AS "address", c1.City AS "city", c1.Region AS "region", c1.PostalCode AS "postalCode", c1.Country AS "country" FROM Customers c1  WHERE  c1.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 6', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.Quantity AS [quantity], o1.UnitPrice AS [unitPrice], o1.ProductID AS [productId] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT c.CustomerID AS [id], c.CompanyName AS [name], c.ContactName AS [contact], c.ContactTitle AS [phone], c.Address AS [address], c.City AS [city], c.Region AS [region], c.PostalCode AS [postalCode], c.Country AS [country] FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.Quantity AS "quantity", o1.UnitPrice AS "unitPrice", o1.ProductID AS "productId" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.Quantity AS "quantity", o1.UnitPrice AS "unitPrice", o1.ProductID AS "productId" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 7', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.details.include(q => q.product).map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.Quantity AS [quantity], o1.UnitPrice AS [unitPrice], o1.ProductID AS [productId] FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS [id], p.ProductName AS [name], p.SupplierID AS [supplierId], p.CategoryID AS [categoryId], p.QuantityPerUnit AS [quantity], p.UnitPrice AS [price], p.UnitsInStock AS [inStock], p.UnitsOnOrder AS [onOrder], p.ReorderLevel AS [reorderLevel], p.Discontinued AS [discontinued] FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CustomerID AS [id], c.CompanyName AS [name], c.ContactName AS [contact], c.ContactTitle AS [phone], c.Address AS [address], c.City AS [city], c.Region AS [region], c.PostalCode AS [postalCode], c.Country AS [country] FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued` FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country` FROM Customers c  WHERE  c.CustomerID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT o1.Quantity AS "quantity", o1.UnitPrice AS "unitPrice", o1.ProductID AS "productId" FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT o1.Quantity AS "quantity", o1.UnitPrice AS "unitPrice", o1.ProductID AS "productId" FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT p.ProductID AS "id", p.ProductName AS "name", p.SupplierID AS "supplierId", p.CategoryID AS "categoryId", p.QuantityPerUnit AS "quantity", p.UnitPrice AS "price", p.UnitsInStock AS "inStock", p.UnitsOnOrder AS "onOrder", p.ReorderLevel AS "reorderLevel", p.Discontinued AS "discontinued" FROM Products p  WHERE  p.ProductID IN ($1) 
SELECT c.CustomerID AS "id", c.CompanyName AS "name", c.ContactName AS "contact", c.ContactTitle AS "phone", c.Address AS "address", c.City AS "city", c.Region AS "region", c.PostalCode AS "postalCode", c.Country AS "country" FROM Customers c  WHERE  c.CustomerID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
	test('include 8', async () => {
		const expression = 'Orders.filter(p => p.id == id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])'
		const mariadbExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (?) 
SELECT o1.Quantity, o1.UnitPrice FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (?) '
		const mariadb =  await orm.expression(expression).sentence('mariadb', 'northwind:0.0.2')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'SELECT o.OrderID AS [id], o.CustomerID AS [customerId], o.EmployeeID AS [employeeId], o.OrderDate AS [orderDate], o.RequiredDate AS [requiredDate], o.ShippedDate AS [shippedDate], o.ShipVia AS [shipViaId], o.Freight AS [freight], o.ShipName AS [name], o.ShipAddress AS [address], o.ShipCity AS [city], o.ShipRegion AS [region], o.ShipPostalCode AS [postalCode], o.ShipCountry AS [country] FROM Orders o  WHERE o.OrderID = :id 
SELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (:list_id) 
SELECT o1.Quantity, o1.UnitPrice FROM [Order Details] o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (:list_id) '
		const mssql =  await orm.expression(expression).sentence('mssql', 'northwind:0.0.2')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country` FROM Orders o  WHERE o.OrderID = ? 
SELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (?) 
SELECT o1.Quantity, o1.UnitPrice FROM `Order Details` o1  WHERE  o1.OrderID IN (?) 
SELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (?) 
SELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (?) '
		const mysql =  await orm.expression(expression).sentence('mysql', 'northwind:0.0.2')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = :id 
SELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN (:list_id) 
SELECT o1.Quantity, o1.UnitPrice FROM "Order Details" o1  WHERE  o1.OrderID IN (:list_orderId) 
SELECT p.ProductName FROM Products p  WHERE  p.ProductID IN (:list_id) 
SELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN (:list_id) '
		const oracle =  await orm.expression(expression).sentence('oracle', 'northwind:0.0.2')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'SELECT o.OrderID AS "id", o.CustomerID AS "customerId", o.EmployeeID AS "employeeId", o.OrderDate AS "orderDate", o.RequiredDate AS "requiredDate", o.ShippedDate AS "shippedDate", o.ShipVia AS "shipViaId", o.Freight AS "freight", o.ShipName AS "name", o.ShipAddress AS "address", o.ShipCity AS "city", o.ShipRegion AS "region", o.ShipPostalCode AS "postalCode", o.ShipCountry AS "country" FROM Orders o  WHERE o.OrderID = $1 
SELECT c.CompanyName FROM Customers c  WHERE  c.CustomerID IN ($1) 
SELECT o1.Quantity, o1.UnitPrice FROM "Order Details" o1  WHERE  o1.OrderID IN ($1) 
SELECT p.ProductName FROM Products p  WHERE  p.ProductID IN ($1) 
SELECT c1.CategoryName FROM Categories c1  WHERE  c1.CategoryID IN ($1) '
		const postgres =  await orm.expression(expression).sentence('postgres', 'northwind:0.0.2')
		expect(postgresExpected).toBe(postgres)
	})
})
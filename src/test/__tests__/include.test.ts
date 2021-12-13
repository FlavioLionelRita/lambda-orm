import { orm,Helper } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Complete Expression', () => {
	test('include 1', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>p.customer)'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__customerId:p.customerId}).include(p=>p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id}))'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 2', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>p.details)'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id}).include(p=>p.details.filter(p=>includes(p.orderId,__parentId)).map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount,__parentId:p.orderId}))'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 3', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details,p.customer])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id,__customerId:p.customerId}).include(p=>[p.details.filter(p=>includes(p.orderId,__parentId)).map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount,__parentId:p.orderId}),p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 4', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product),p.customer])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id,__customerId:p.customerId}).include(p=>[p.details.map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount,__productId:p.productId,__parentId:p.orderId}).filter(p=>includes(p.orderId,__parentId)).include(q=>q.product.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued,__parentId:p.id})),p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 5', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product.include(p=>p.category)),p.customer])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id,__customerId:p.customerId}).include(p=>[p.details.map(p=>{orderId:p.orderId,productId:p.productId,unitPrice:p.unitPrice,quantity:p.quantity,discount:p.discount,__productId:p.productId,__parentId:p.orderId}).filter(p=>includes(p.orderId,__parentId)).include(q=>q.product.map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued,__categoryId:p.categoryId,__parentId:p.id}).filter(p=>includes(p.id,__parentId)).include(p=>p.category.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,description:p.description,__parentId:p.id}))),p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 6', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id,__customerId:p.customerId}).include(p=>[p.details.filter(p=>includes(p.orderId,__parentId)).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId,__parentId:p.orderId}),p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 7', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__id:p.id,__customerId:p.customerId}).include(p=>[p.details.include(q=>q.product.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,supplierId:p.supplierId,categoryId:p.categoryId,quantity:p.quantity,price:p.price,inStock:p.inStock,onOrder:p.onOrder,reorderLevel:p.reorderLevel,discontinued:p.discontinued,__parentId:p.id})).filter(p=>includes(p.orderId,__parentId)).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId,__productId:p.productId,__parentId:p.orderId}),p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{id:p.id,name:p.name,contact:p.contact,phone:p.phone,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__parentId:p.id})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('include 8', () => {
		const source = 'Orders.filter(p=>(p.id===id)).include(p=>[p.customer.map(p=>p.name),p.details.include(p=>p.product.include(p=>p.category.map(p=>p.name)).map(p=>p.name)).map(p=>[p.quantity,p.unitPrice])])'
		const expected = 'Orders.filter(p=>(p.id===id)).map(p=>{id:p.id,customerId:p.customerId,employeeId:p.employeeId,orderDate:p.orderDate,requiredDate:p.requiredDate,shippedDate:p.shippedDate,shipViaId:p.shipViaId,freight:p.freight,name:p.name,address:p.address,city:p.city,region:p.region,postalCode:p.postalCode,country:p.country,__customerId:p.customerId,__id:p.id}).include(p=>[p.customer.filter(p=>includes(p.id,__parentId)).map(p=>{name:p.name,__parentId:p.id}),p.details.include(p=>p.product.include(p=>p.category.filter(p=>includes(p.id,__parentId)).map(p=>{name:p.name,__parentId:p.id})).filter(p=>includes(p.id,__parentId)).map(p=>{name:p.name,__categoryId:p.categoryId,__parentId:p.id})).filter(p=>includes(p.orderId,__parentId)).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,__productId:p.productId,__parentId:p.orderId})])'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('include 1', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>p.customer)'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 2', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>p.details)'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 3', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details,p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 4', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product),p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 5', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product.include(p=>p.category)),p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean","category":{"id":"integer","name":"string","description":"string"}}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 6', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"quantity":"decimal","unitPrice":"decimal","productId":"integer"}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 7', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"quantity":"decimal","unitPrice":"decimal","productId":"integer","product":{"id":"integer","name":"string","supplierId":"integer","categoryId":"integer","quantity":"string","price":"decimal","inStock":"decimal","onOrder":"decimal","reorderLevel":"decimal","discontinued":"boolean"}}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__id","type":"integer"},{"name":"__customerId","type":"string"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('include 8', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.customer.map(p=>p.name),p.details.include(p=>p.product.include(p=>p.category.map(p=>p.name)).map(p=>p.name)).map(p=>[p.quantity,p.unitPrice])])'
		const modelExpected :any= {"id":"integer","customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","customer":{"name":"string"},"details":[{"quantity":"decimal","unitPrice":"decimal","product":{"name":"string","category":{"name":"string"}}}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":1}]
		const fieldsExpected :any= [{"name":"id","type":"integer"},{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"},{"name":"__customerId","type":"string"},{"name":"__id","type":"integer"}]
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
})
describe('Sentences', () => {
	test('include 1', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>p.customer)'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 2', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>p.details)'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 3', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details,p.customer])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 4', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product),p.customer])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount`, o1.ProductID AS `__productId`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued`, p.ProductID AS `__parentId` FROM Products p  WHERE  p.ProductID IN (?) ; SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 5', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product.include(p=>p.category)),p.customer])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.OrderID AS `orderId`, o1.ProductID AS `productId`, o1.UnitPrice AS `unitPrice`, o1.Quantity AS `quantity`, o1.Discount AS `discount`, o1.ProductID AS `__productId`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued`, p.CategoryID AS `__categoryId`, p.ProductID AS `__parentId` FROM Products p  WHERE  p.ProductID IN (?) ; SELECT c.CategoryID AS `id`, c.CategoryName AS `name`, c.Description AS `description`, c.CategoryID AS `__parentId` FROM Categories c  WHERE  c.CategoryID IN (?) ; SELECT c1.CustomerID AS `id`, c1.CompanyName AS `name`, c1.ContactName AS `contact`, c1.ContactTitle AS `phone`, c1.Address AS `address`, c1.City AS `city`, c1.Region AS `region`, c1.PostalCode AS `postalCode`, c1.Country AS `country`, c1.CustomerID AS `__parentId` FROM Customers c1  WHERE  c1.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 6', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 7', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.details.include(q=>q.product).map(p=>{quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId}),p.customer])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.OrderID AS `__id`, o.CustomerID AS `__customerId` FROM Orders o  WHERE o.OrderID = ? ; SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `productId`, o1.ProductID AS `__productId`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT p.ProductID AS `id`, p.ProductName AS `name`, p.SupplierID AS `supplierId`, p.CategoryID AS `categoryId`, p.QuantityPerUnit AS `quantity`, p.UnitPrice AS `price`, p.UnitsInStock AS `inStock`, p.UnitsOnOrder AS `onOrder`, p.ReorderLevel AS `reorderLevel`, p.Discontinued AS `discontinued`, p.ProductID AS `__parentId` FROM Products p  WHERE  p.ProductID IN (?) ; SELECT c.CustomerID AS `id`, c.CompanyName AS `name`, c.ContactName AS `contact`, c.ContactTitle AS `phone`, c.Address AS `address`, c.City AS `city`, c.Region AS `region`, c.PostalCode AS `postalCode`, c.Country AS `country`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('include 8', async () => {
		const expression = 'Orders.filter(p=>(p.id===id)).include(p=>[p.customer.map(p=>p.name),p.details.include(p=>p.product.include(p=>p.category.map(p=>p.name)).map(p=>p.name)).map(p=>[p.quantity,p.unitPrice])])'
		const mysqlExpected = 'SELECT o.OrderID AS `id`, o.CustomerID AS `customerId`, o.EmployeeID AS `employeeId`, o.OrderDate AS `orderDate`, o.RequiredDate AS `requiredDate`, o.ShippedDate AS `shippedDate`, o.ShipVia AS `shipViaId`, o.Freight AS `freight`, o.ShipName AS `name`, o.ShipAddress AS `address`, o.ShipCity AS `city`, o.ShipRegion AS `region`, o.ShipPostalCode AS `postalCode`, o.ShipCountry AS `country`, o.CustomerID AS `__customerId`, o.OrderID AS `__id` FROM Orders o  WHERE o.OrderID = ? ; SELECT c.CompanyName AS `name`, c.CustomerID AS `__parentId` FROM Customers c  WHERE  c.CustomerID IN (?) ; SELECT o1.Quantity AS `quantity`, o1.UnitPrice AS `unitPrice`, o1.ProductID AS `__productId`, o1.OrderID AS `__parentId` FROM `Order Details` o1  WHERE  o1.OrderID IN (?) ; SELECT p.ProductName AS `name`, p.CategoryID AS `__categoryId`, p.ProductID AS `__parentId` FROM Products p  WHERE  p.ProductID IN (?) ; SELECT c1.CategoryName AS `name`, c1.CategoryID AS `__parentId` FROM Categories c1  WHERE  c1.CategoryID IN (?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
})
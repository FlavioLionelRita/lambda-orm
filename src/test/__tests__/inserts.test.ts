import { orm,Helper } from '../../orm'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Complete Expression', () => {
	test('insert 1', () => {
		const source = 'Categories.insert()'
		const expected = 'Categories.insert({name:name,description:description})'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('insert 2', () => {
		const source = 'Categories.insert({ name: name, description: description })'
		const expected = 'Categories.insert({name:name,description:description})'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('insert 3', () => {
		const source = 'Categories.insert(entity)'
		const expected = 'Categories.insert({name:entity.name,description:entity.description})'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('insert 4', () => {
		const source = 'Orders.insert()'
		const expected = 'Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country})'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('insert 5', () => {
		const source = 'Orders.insert().include(p => p.details)'
		const expected = 'Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>p.details.insert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}))'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
	test('insert 6', () => {
		const source = 'Orders.insert().include(p => [p.details, p.customer])'
		const expected = 'Orders.insert({customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).include(p=>[p.details.insert({orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}),p.customer.insert({id:id,name:name,contact:contact,phone:phone,address:address,city:city,region:region,postalCode:postalCode,country:country})])'
		const target = orm.lambda(source).complete('northwind:0.0.2')
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('insert 1', async () => {
		const expression = 'Categories.insert()'
		const modelExpected :any= {"name":"string","description":"string"}
		const parametersExpected:any = [{"name":"name","type":"string","value":"Beverages20"},{"name":"description","type":"string","value":"Soft drinks, coffees, teas, beers, and ales"}]
		const fieldsExpected :any= [{"name":"name","type":"string"},{"name":"description","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('insert 2', async () => {
		const expression = 'Categories.insert({ name: name, description: description })'
		const modelExpected :any= {"name":"string","description":"string"}
		const parametersExpected:any = [{"name":"name","type":"string","value":"Beverages21"},{"name":"description","type":"string","value":"Soft drinks, coffees, teas, beers, and ales"}]
		const fieldsExpected :any= [{"name":"name","type":"string"},{"name":"description","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('insert 3', async () => {
		const expression = 'Categories.insert(entity)'
		const modelExpected :any= {"name":"string","description":"string"}
		const parametersExpected:any = [{"name":"entity.name","type":"string","value":"Beverages22"},{"name":"entity.description","type":"string","value":"Soft drinks, coffees, teas, beers, and ales"}]
		const fieldsExpected :any= [{"name":"name","type":"string"},{"name":"description","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('insert 4', async () => {
		const expression = 'Orders.insert()'
		const modelExpected :any= {"customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}
		const parametersExpected:any = [{"name":"customerId","type":"string","value":"VINET"},{"name":"employeeId","type":"integer","value":5},{"name":"orderDate","type":"datetime","value":"1996-07-04 00:00:00"},{"name":"requiredDate","type":"datetime","value":"1996-08-01 00:00:00"},{"name":"shippedDate","type":"datetime","value":"1996-07-16 00:00:00"},{"name":"shipViaId","type":"integer","value":3},{"name":"freight","type":"decimal","value":32.38},{"name":"name","type":"string","value":"Vins et alcools Chevalier"},{"name":"address","type":"string","value":"59 rue de l-Abbaye"},{"name":"city","type":"string","value":"Reims"},{"name":"region","type":"string","value":null},{"name":"postalCode","type":"string","value":"51100"},{"name":"country","type":"string","value":"France"}]
		const fieldsExpected :any= [{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('insert 5', async () => {
		const expression = 'Orders.insert().include(p => p.details)'
		const modelExpected :any= {"customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}]}
		const parametersExpected:any = [{"name":"customerId","type":"string","value":"VINET"},{"name":"employeeId","type":"integer","value":5},{"name":"orderDate","type":"datetime","value":"1996-07-04 00:00:00"},{"name":"requiredDate","type":"datetime","value":"1996-08-01 00:00:00"},{"name":"shippedDate","type":"datetime","value":"1996-07-16 00:00:00"},{"name":"shipViaId","type":"integer","value":3},{"name":"freight","type":"decimal","value":32.38},{"name":"name","type":"string","value":"Vins et alcools Chevalier"},{"name":"address","type":"string","value":"59 rue de l-Abbaye"},{"name":"city","type":"string","value":"Reims"},{"name":"region","type":"string","value":null},{"name":"postalCode","type":"string","value":"51100"},{"name":"country","type":"string","value":"France"}]
		const fieldsExpected :any= [{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
	test('insert 6', async () => {
		const expression = 'Orders.insert().include(p => [p.details, p.customer])'
		const modelExpected :any= {"customerId":"string","employeeId":"integer","orderDate":"datetime","requiredDate":"datetime","shippedDate":"datetime","shipViaId":"integer","freight":"decimal","name":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string","details":[{"orderId":"integer","productId":"integer","unitPrice":"decimal","quantity":"decimal","discount":"decimal"}],"customer":{"id":"string","name":"string","contact":"string","phone":"string","address":"string","city":"string","region":"string","postalCode":"string","country":"string"}}
		const parametersExpected:any = [{"name":"customerId","type":"string","value":"VINET"},{"name":"employeeId","type":"integer","value":5},{"name":"orderDate","type":"datetime","value":"1996-07-04 00:00:00"},{"name":"requiredDate","type":"datetime","value":"1996-08-01 00:00:00"},{"name":"shippedDate","type":"datetime","value":"1996-07-16 00:00:00"},{"name":"shipViaId","type":"integer","value":3},{"name":"freight","type":"decimal","value":32.38},{"name":"name","type":"string","value":"Vins et alcools Chevalier"},{"name":"address","type":"string","value":"59 rue de l-Abbaye"},{"name":"city","type":"string","value":"Reims"},{"name":"region","type":"string","value":null},{"name":"postalCode","type":"string","value":"51100"},{"name":"country","type":"string","value":"France"}]
		const fieldsExpected :any= [{"name":"customerId","type":"string"},{"name":"employeeId","type":"integer"},{"name":"orderDate","type":"datetime"},{"name":"requiredDate","type":"datetime"},{"name":"shippedDate","type":"datetime"},{"name":"shipViaId","type":"integer"},{"name":"freight","type":"decimal"},{"name":"name","type":"string"},{"name":"address","type":"string"},{"name":"city","type":"string"},{"name":"region","type":"string"},{"name":"postalCode","type":"string"},{"name":"country","type":"string"}]
		const model = await orm.lambda(expression).model('northwind:0.0.2')
		const serialize = await orm.lambda(expression).serialize('northwind:0.0.2')
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(serialize.f)
	})
})
describe('Sentences', () => {
	test('insert 1', async () => {
		const expression = 'Categories.insert()'
		const mariadbExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:name,:description)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:name,:description)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES($1,$2) RETURNING CategoryID AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('insert 2', async () => {
		const expression = 'Categories.insert({ name: name, description: description })'
		const mariadbExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:name,:description)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:name,:description)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES($1,$2) RETURNING CategoryID AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('insert 3', async () => {
		const expression = 'Categories.insert(entity)'
		const mariadbExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:entity.name,:entity.description)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES(:entity.name,:entity.description)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Categories(CategoryName,Description) VALUES($1,$2) RETURNING CategoryID AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('insert 4', async () => {
		const expression = 'Orders.insert()'
		const mariadbExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING OrderID AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('insert 5', async () => {
		const expression = 'Orders.insert().include(p => p.details)'
		const mariadbExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?); INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country); INSERT INTO [Order Details](OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(:orderId,:productId,:unitPrice,:quantity,:discount)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?); INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country); INSERT INTO "Order Details"(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(:orderId,:productId,:unitPrice,:quantity,:discount)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING OrderID AS id; INSERT INTO "Order Details"(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES($1,$2,$3,$4,$5) RETURNING 0 AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
	test('insert 6', async () => {
		const expression = 'Orders.insert().include(p => [p.details, p.customer])'
		const mariadbExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?); INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?); INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES(?,?,?,?,?,?,?,?,?)'
		let mariadb =  await orm.lambda(expression).sentence('mariadb', 'northwind:0.0.2')
		mariadb=Helper.replace(mariadb,'\n','; ')
		expect(mariadbExpected).toBe(mariadb)
		const mssqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country); INSERT INTO [Order Details](OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(:orderId,:productId,:unitPrice,:quantity,:discount); INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES(:id,:name,:contact,:phone,:address,:city,:region,:postalCode,:country)'
		let mssql =  await orm.lambda(expression).sentence('mssql', 'northwind:0.0.2')
		mssql=Helper.replace(mssql,'\n','; ')
		expect(mssqlExpected).toBe(mssql)
		const mysqlExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?); INSERT INTO `Order Details`(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(?,?,?,?,?); INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES(?,?,?,?,?,?,?,?,?)'
		let mysql =  await orm.lambda(expression).sentence('mysql', 'northwind:0.0.2')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
		const oracleExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES(:customerId,:employeeId,:orderDate,:requiredDate,:shippedDate,:shipViaId,:freight,:name,:address,:city,:region,:postalCode,:country); INSERT INTO "Order Details"(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES(:orderId,:productId,:unitPrice,:quantity,:discount); INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES(:id,:name,:contact,:phone,:address,:city,:region,:postalCode,:country)'
		let oracle =  await orm.lambda(expression).sentence('oracle', 'northwind:0.0.2')
		oracle=Helper.replace(oracle,'\n','; ')
		expect(oracleExpected).toBe(oracle)
		const postgresExpected = 'INSERT INTO Orders(CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING OrderID AS id; INSERT INTO "Order Details"(OrderID,ProductID,UnitPrice,Quantity,Discount) VALUES($1,$2,$3,$4,$5) RETURNING 0 AS id; INSERT INTO Customers(CustomerID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING 0 AS id'
		let postgres =  await orm.lambda(expression).sentence('postgres', 'northwind:0.0.2')
		postgres=Helper.replace(postgres,'\n','; ')
		expect(postgresExpected).toBe(postgres)
	})
})
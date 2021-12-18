import { orm,Helper } from '../../lib'
beforeAll(async () => {
	require('dotenv').config({ path: './test.env' })
	await orm.init()
})
describe('Complete Expression', () => {
	test('delete 1', () => {
		const source = 'OrderDetails.delete().filter(p=>(p.orderId===id))'
		const expected = 'OrderDetails.delete().filter(p=>(p.orderId===id))'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 2', () => {
		const source = 'Orders.delete().include(p=>p.details)'
		const expected = 'Orders.filter(p=>(p.id==id)).delete().include(p=>p.details.filter(p=>((p.orderId==orderId)&&(p.productId==productId))).delete())'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 3', () => {
		const source = 'Orders.delete().filter(p=>(p.id===id)).include(p=>p.details)'
		const expected = 'Orders.delete().filter(p=>(p.id===id)).include(p=>p.details.filter(p=>((p.orderId==orderId)&&(p.productId==productId))).delete())'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 4', () => {
		const source = 'Orders.delete().include(p=>p.details)'
		const expected = 'Orders.filter(p=>(p.id==id)).delete().include(p=>p.details.filter(p=>((p.orderId==orderId)&&(p.productId==productId))).delete())'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 4', () => {
		const source = 'OrderDetails.delete(entity)'
		const expected = 'OrderDetails.filter(p=>((p.orderId==entity.orderId)&&(p.productId==entity.productId))).delete(entity)'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 5', () => {
		const source = 'Orders.delete(entity).include(p=>p.details)'
		const expected = 'Orders.filter(p=>(p.id==entity.id)).delete(entity).include(p=>p.details.filter(p=>((p.orderId==orderId)&&(p.productId==productId))).delete())'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
	test('delete 6', () => {
		const source = 'OrderDetails.deleteAll()'
		const expected = 'OrderDetails.delete()'
		const target = orm.complete(source)
		expect(expected).toBe(target)
	})
})
describe('Metadata', () => {
	test('delete 1', async () => {
		const expression = 'OrderDetails.delete().filter(p=>(p.orderId===id))'
		const modelExpected :any= {}
		const parametersExpected:any = [{"name":"id","type":"integer","value":9}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 2', async () => {
		const expression = 'Orders.delete().include(p=>p.details)'
		const modelExpected :any= {"details":[{}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":4}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 3', async () => {
		const expression = 'Orders.delete().filter(p=>(p.id===id)).include(p=>p.details)'
		const modelExpected :any= {"details":[{}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":2}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 4', async () => {
		const expression = 'Orders.delete().include(p=>p.details)'
		const modelExpected :any= {"details":[{}]}
		const parametersExpected:any = [{"name":"id","type":"integer","value":4}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 4', async () => {
		const expression = 'OrderDetails.delete(entity)'
		const modelExpected :any= {}
		const parametersExpected:any = [{"name":"entity.orderId","type":"integer","value":null},{"name":"entity.productId","type":"integer","value":null}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 5', async () => {
		const expression = 'Orders.delete(entity).include(p=>p.details)'
		const modelExpected :any= {"details":[{}]}
		const parametersExpected:any = [{"name":"entity.id","type":"integer","value":null}]
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
	test('delete 6', async () => {
		const expression = 'OrderDetails.deleteAll()'
		const modelExpected :any= {}
		const parametersExpected:any = []
		const fieldsExpected :any= []
		const model = await orm.model(expression)
		const metadata = await orm.metadata(expression)
		expect(modelExpected).toStrictEqual(model)
		expect(fieldsExpected).toStrictEqual(metadata.f)
	})
})
describe('Sentences', () => {
	test('delete 1', async () => {
		const expression = 'OrderDetails.delete().filter(p=>(p.orderId===id))'
		const mysqlExpected = 'DELETE o FROM `Order Details` AS o WHERE o.OrderID = ? '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 2', async () => {
		const expression = 'Orders.delete().include(p=>p.details)'
		const mysqlExpected = 'DELETE o FROM Orders AS o WHERE o.OrderID = ? ; DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 3', async () => {
		const expression = 'Orders.delete().filter(p=>(p.id===id)).include(p=>p.details)'
		const mysqlExpected = 'DELETE o FROM Orders AS o WHERE o.OrderID = ? ; DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 4', async () => {
		const expression = 'Orders.delete().include(p=>p.details)'
		const mysqlExpected = 'DELETE o FROM Orders AS o WHERE o.OrderID = ? ; DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 4', async () => {
		const expression = 'OrderDetails.delete(entity)'
		const mysqlExpected = 'DELETE o FROM `Order Details` AS o WHERE (o.OrderID = ? AND o.ProductID = ?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 5', async () => {
		const expression = 'Orders.delete(entity).include(p=>p.details)'
		const mysqlExpected = 'DELETE o FROM Orders AS o WHERE o.OrderID = ? ; DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
	test('delete 6', async () => {
		const expression = 'OrderDetails.deleteAll()'
		const mysqlExpected = 'DELETE o FROM `Order Details` AS o '
		let mysql =  await orm.sentence(expression,'mysql')
		mysql=Helper.replace(mysql,'\n','; ')
		expect(mysqlExpected).toBe(mysql)
	})
})
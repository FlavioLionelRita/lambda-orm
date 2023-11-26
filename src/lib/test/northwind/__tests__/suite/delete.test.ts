/* eslint-disable no-template-curly-in-string */
import { orm } from '../../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/northwind.env' })
	await orm.init('./config/northwind.yaml')
})

describe('delete', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Categories.delete()')).toStrictEqual('Categories.delete().filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.delete(entity)')).toStrictEqual('Categories.delete().filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Categories.delete(p => entity)')).toStrictEqual('Categories.delete().filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Categories.delete(p => p)')).toStrictEqual('Categories.delete().filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.delete().filter(p => p.id === id)')).toStrictEqual('Categories.delete().filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.delete().filter(p => p.id === entity.id)')).toStrictEqual('Categories.delete().filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Categories.deleteAll()')).toStrictEqual('Categories.delete()')
		expect(orm.normalize('Categories.deleteAll().filter(p=> substring(p.name,1,3) === "cat")')).toStrictEqual('Categories.delete().filter(p=>(substring(p.name,1,3)==cat))')
		expect(orm.normalize('Orders.details.delete().filter(p => p.orderId === id)')).toStrictEqual('Orders.details.delete().filter(p=>(p.orderId==id))')
		expect(orm.normalize('Orders.delete().include(p => p.details)')).toStrictEqual('Orders.delete().filter(p=>(p.id==id)).include(p=>p.details.delete().filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.delete().filter(p => p.id === id).include(p => p.details)')).toStrictEqual('Orders.delete().filter(p=>(p.id==id)).include(p=>p.details.delete().filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.delete().include(p => p.details)')).toStrictEqual('Orders.delete().filter(p=>(p.id==id)).include(p=>p.details.delete().filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.details.delete(entity)')).toStrictEqual('Orders.details.delete().filter(p=>((p.orderId==entity.orderId)&&(p.productId==entity.productId)))')
		expect(orm.normalize('Orders.delete(entity).include(p => p.details)')).toStrictEqual('Orders.delete().filter(p=>(p.id==entity.id)).include(p=>p.details.delete().filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.details.deleteAll()')).toStrictEqual('Orders.details.delete()')
	})
	test('model', () => {
		expect(orm.model('Categories.delete()')).toStrictEqual([])
		expect(orm.model('Categories.delete(entity)')).toStrictEqual([])
		expect(orm.model('Categories.delete(p => entity)')).toStrictEqual([])
		expect(orm.model('Categories.delete(p => p)')).toStrictEqual([])
		expect(orm.model('Categories.delete().filter(p => p.id === id)')).toStrictEqual([])
		expect(orm.model('Categories.delete().filter(p => p.id === entity.id)')).toStrictEqual([])
		expect(orm.model('Categories.deleteAll()')).toStrictEqual([])
		expect(orm.model('Categories.deleteAll().filter(p=> substring(p.name,1,3) === "cat")')).toStrictEqual([])
		expect(orm.model('Orders.details.delete().filter(p => p.orderId === id)')).toStrictEqual([])
		expect(orm.model('Orders.delete().include(p => p.details)')).toStrictEqual([{'name':'details','type':'Orders.details[]','children':[]}])
		expect(orm.model('Orders.delete().filter(p => p.id === id).include(p => p.details)')).toStrictEqual([{'name':'details','type':'Orders.details[]','children':[]}])
		expect(orm.model('Orders.delete().include(p => p.details)')).toStrictEqual([{'name':'details','type':'Orders.details[]','children':[]}])
		expect(orm.model('Orders.details.delete(entity)')).toStrictEqual([])
		expect(orm.model('Orders.delete(entity).include(p => p.details)')).toStrictEqual([{'name':'details','type':'Orders.details[]','children':[]}])
		expect(orm.model('Orders.details.deleteAll()')).toStrictEqual([])
	})
	test('parameters', () => {
		expect(orm.parameters('Categories.delete()')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.delete(entity)')).toStrictEqual([{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Categories.delete(p => entity)')).toStrictEqual([{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Categories.delete(p => p)')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.delete().filter(p => p.id === id)')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.delete().filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Categories.deleteAll()')).toStrictEqual([])
		expect(orm.parameters('Categories.deleteAll().filter(p=> substring(p.name,1,3) === "cat")')).toStrictEqual([])
		expect(orm.parameters('Orders.details.delete().filter(p => p.orderId === id)')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Orders.delete().include(p => p.details)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.delete().filter(p => p.id === id).include(p => p.details)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.delete().include(p => p.details)')).toStrictEqual([{'name':'id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.details.delete(entity)')).toStrictEqual([{'name':'entity.orderId','type':'integer'},{'name':'entity.productId','type':'integer'}])
		expect(orm.parameters('Orders.delete(entity).include(p => p.details)')).toStrictEqual([{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.details.deleteAll()')).toStrictEqual([])
	})
	test('constraints', () => {
		expect(orm.constraints('Categories.delete()')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.delete(entity)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.delete(p => entity)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.delete(p => p)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.delete().filter(p => p.id === id)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.delete().filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.deleteAll()')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.deleteAll().filter(p=> substring(p.name,1,3) === "cat")')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Orders.details.delete().filter(p => p.orderId === id)')).toStrictEqual({"entity":"Orders.details","constraints":[]})
		expect(orm.constraints('Orders.delete().include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.delete().filter(p => p.id === id).include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.delete().include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.details.delete(entity)')).toStrictEqual({"entity":"Orders.details","constraints":[]})
		expect(orm.constraints('Orders.delete(entity).include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.details.deleteAll()')).toStrictEqual({"entity":"Orders.details","constraints":[]})
	})
	test('getInfo', () => {
		expect(orm.getInfo('Categories.delete()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.delete(entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.delete(p => entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.delete(p => p)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.delete().filter(p => p.id === id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.delete().filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE c.CategoryID = ? ","children":[]})
		expect(orm.getInfo('Categories.deleteAll()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c ","children":[]})
		expect(orm.getInfo('Categories.deleteAll().filter(p=> substring(p.name,1,3) === "cat")',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"DELETE c FROM Categories AS c WHERE SUBSTR(c.CategoryName,1,3) = 'cat' ","children":[]})
		expect(orm.getInfo('Orders.details.delete().filter(p => p.orderId === id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM `Order Details` AS o WHERE o.OrderID = ? ","children":[]})
		expect(orm.getInfo('Orders.delete().include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM Orders AS o WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) ","children":[]}]})
		expect(orm.getInfo('Orders.delete().filter(p => p.id === id).include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM Orders AS o WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) ","children":[]}]})
		expect(orm.getInfo('Orders.delete().include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM Orders AS o WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) ","children":[]}]})
		expect(orm.getInfo('Orders.details.delete(entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM `Order Details` AS o WHERE (o.OrderID = ? AND o.ProductID = ?) ","children":[]})
		expect(orm.getInfo('Orders.delete(entity).include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM Orders AS o WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o1 FROM `Order Details` AS o1 WHERE (o1.OrderID = ? AND o1.ProductID = ?) ","children":[]}]})
		expect(orm.getInfo('Orders.details.deleteAll()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"DELETE o FROM `Order Details` AS o ","children":[]})
	})
})

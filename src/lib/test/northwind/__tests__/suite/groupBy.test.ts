/* eslint-disable no-template-curly-in-string */
import { orm } from '../../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/northwind.env' })
	await orm.init('./config/northwind.yaml')
})

describe('groupBy', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Products.map(p => ({ maxPrice: max(p.price) }))')).toStrictEqual('Products.map(p=>{maxPrice:max(p.price)})')
		expect(orm.normalize('Products.map(p => ({ minPrice: min(p.price) }))')).toStrictEqual('Products.map(p=>{minPrice:min(p.price)})')
		expect(orm.normalize('Products.map(p => ({ total: sum(p.price) }))')).toStrictEqual('Products.map(p=>{total:sum(p.price)})')
		expect(orm.normalize('Products.map(p => ({ average: round(avg(p.price), 4) }))')).toStrictEqual('Products.map(p=>{average:round(avg(p.price),4)})')
		expect(orm.normalize('Products.map(p => ({ count: count(1) }))')).toStrictEqual('Products.map(p=>{count:count(1)})')
		expect(orm.normalize('Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) }))')).toStrictEqual('Products.map(p=>{category:p.categoryId,largestPrice:max(p.price)})')
		expect(orm.normalize('Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual('Products.map(p=>{category:p.category.name,largestPrice:max(p.price)})')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) }))')).toStrictEqual('Products.map(p=>{name:p.name,source:p.price,result:abs(p.price)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual('Products.map(p=>{category:p.category.name,largestPrice:max(p.price)}).having(p=>(max(p.price)>100))')
		expect(orm.normalize('Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal)')).toStrictEqual('Orders.details.map(p=>{subTotal:sum((((p.unitPrice*p.quantity)*(1-(p.discount/100)))*100))}).sort(p=>asc(p.subTotal))')
		expect(orm.normalize('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual('Products.map(p=>{category:p.category.name,largestPrice:max(p.price)}).having(p=>(max(p.price)>100)).sort(p=>desc(p.largestPrice))')
		expect(orm.normalize('Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual('Products.map(p=>{category:p.category.name,largestPrice:max(p.price)}).filter(p=>(p.price>5)).having(p=>(max(p.price)>50)).sort(p=>desc(p.largestPrice))')
	})
	test('model', () => {
		expect(orm.model('Products.map(p => ({ maxPrice: max(p.price) }))')).toStrictEqual([{'name':'maxPrice','type':'any'}])
		expect(orm.model('Products.map(p => ({ minPrice: min(p.price) }))')).toStrictEqual([{'name':'minPrice','type':'any'}])
		expect(orm.model('Products.map(p => ({ total: sum(p.price) }))')).toStrictEqual([{'name':'total','type':'number'}])
		expect(orm.model('Products.map(p => ({ average: round(avg(p.price), 4) }))')).toStrictEqual([{'name':'average','type':'number'}])
		expect(orm.model('Products.map(p => ({ count: count(1) }))')).toStrictEqual([{'name':'count','type':'integer'}])
		expect(orm.model('Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) }))')).toStrictEqual([{'name':'category','type':'integer'},{'name':'largestPrice','type':'any'}])
		expect(orm.model('Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual([{'name':'category','type':'string'},{'name':'largestPrice','type':'any'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) }))')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual([{'name':'category','type':'string'},{'name':'largestPrice','type':'any'}])
		expect(orm.model('Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal)')).toStrictEqual([{'name':'subTotal','type':'number'}])
		expect(orm.model('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual([{'name':'category','type':'string'},{'name':'largestPrice','type':'any'}])
		expect(orm.model('Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual([{'name':'category','type':'string'},{'name':'largestPrice','type':'any'}])
	})
	test('parameters', () => {
		expect(orm.parameters('Products.map(p => ({ maxPrice: max(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ minPrice: min(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ total: sum(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ average: round(avg(p.price), 4) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ count: count(1) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) }))')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual([])
		expect(orm.parameters('Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal)')).toStrictEqual([])
		expect(orm.parameters('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual([])
		expect(orm.parameters('Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual([])
	})
	test('constraints', () => {
		expect(orm.constraints('Products.map(p => ({ maxPrice: max(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ minPrice: min(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ total: sum(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ average: round(avg(p.price), 4) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ count: count(1) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal)')).toStrictEqual({"entity":"Orders.details","constraints":[]})
		expect(orm.constraints('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))')).toStrictEqual({"entity":"Products","constraints":[]})
	})
	test('getInfo', () => {
		expect(orm.plan('Products.map(p => ({ maxPrice: max(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT MAX(p.UnitPrice) AS maxPrice FROM Products p  ","children":[]})
		expect(orm.plan('Products.map(p => ({ minPrice: min(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT MIN(p.UnitPrice) AS minPrice FROM Products p  ","children":[]})
		expect(orm.plan('Products.map(p => ({ total: sum(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT SUM(p.UnitPrice) AS total FROM Products p  ","children":[]})
		expect(orm.plan('Products.map(p => ({ average: round(avg(p.price), 4) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT ROUND(AVG(p.UnitPrice),4) AS average FROM Products p  ","children":[]})
		expect(orm.plan('Products.map(p => ({ count: count(1) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT COUNT(1) AS count FROM Products p  ","children":[]})
		expect(orm.plan('Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.CategoryID AS category, MAX(p.UnitPrice) AS largestPrice FROM Products p  GROUP BY p.CategoryID ","children":[]})
		expect(orm.plan('Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT c.CategoryName AS category, MAX(p.UnitPrice) AS largestPrice FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName ","children":[]})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, p.UnitPrice AS source, ABS(p.UnitPrice) AS result FROM Products p  WHERE p.ProductID = ? ","children":[]})
		expect(orm.plan('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT c.CategoryName AS category, MAX(p.UnitPrice) AS largestPrice FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 100 ","children":[]})
		expect(orm.plan('Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"SELECT SUM((((o.UnitPrice * o.Quantity) * (1 - (o.Discount / 100))) * 100)) AS subTotal FROM `Order Details` o  ORDER BY subTotal asc ","children":[]})
		expect(orm.plan('Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT c.CategoryName AS category, MAX(p.UnitPrice) AS largestPrice FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 100 ORDER BY largestPrice desc ","children":[]})
		expect(orm.plan('Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT c.CategoryName AS category, MAX(p.UnitPrice) AS largestPrice FROM Products p INNER JOIN Categories c ON c.CategoryID = p.CategoryID WHERE p.UnitPrice > 5 GROUP BY c.CategoryName HAVING MAX(p.UnitPrice) > 50 ORDER BY largestPrice desc ","children":[]})
	})
})

/* eslint-disable no-template-curly-in-string */
import { orm } from '../../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/northwind.env' })
	await orm.init('./config/northwind.yaml')
})

describe('numeric', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:(p.price*-1),result:round(abs((p.price*-1)),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(acos(0.25), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:0.25,result:round(acos(0.25),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(asin(0.25), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:0.25,result:round(asin(0.25),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(atan(0.25), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:0.25,result:round(atan(0.25),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:0.5,result:round(atan2(0.25,1),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(ceil(25.75), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:25.75,result:round(ceil(25.75),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(cos(2), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:2,result:round(cos(2),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1, result: round(exp(1), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:1,result:round(exp(1),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(floor(25.75), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:25.75,result:round(floor(25.75),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(ln(2), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:2,result:round(ln(2),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,m:10,n:20,result:round(log(10,20),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(135.375, 2) })')).toStrictEqual('Products.map(p=>{name:p.name,source:135.375,result:round(135.375,2)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 255.5, result: round(sign(255.5), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:255.5,result:round(sign(255.5),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1.75, result: round(tan(1.75), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:1.75,result:round(tan(1.75),10)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })')).toStrictEqual('Products.map(p=>{name:p.name,source:135.375,result:round(trunc(135.375,2),10)}).filter(p=>(p.id==id))')
	})
	test('model', () => {
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'number'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(acos(0.25), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(asin(0.25), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(atan(0.25), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(ceil(25.75), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(cos(2), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'integer'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1, result: round(exp(1), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'integer'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(floor(25.75), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(ln(2), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'integer'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'m','type':'integer'},{'name':'n','type':'integer'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(135.375, 2) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 255.5, result: round(sign(255.5), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1.75, result: round(tan(1.75), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
		expect(orm.model('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })')).toStrictEqual([{'name':'name','type':'string'},{'name':'source','type':'decimal'},{'name':'result','type':'number'}])
	})
	test('parameters', () => {
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(acos(0.25), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(asin(0.25), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(atan(0.25), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(ceil(25.75), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(cos(2), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1, result: round(exp(1), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(floor(25.75), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(ln(2), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(135.375, 2) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 255.5, result: round(sign(255.5), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1.75, result: round(tan(1.75), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })')).toStrictEqual([{'name':'id','type':'integer'}])
	})
	test('constraints', () => {
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(acos(0.25), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(asin(0.25), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(atan(0.25), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(ceil(25.75), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(cos(2), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1, result: round(exp(1), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(floor(25.75), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(ln(2), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(135.375, 2) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 255.5, result: round(sign(255.5), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1.75, result: round(tan(1.75), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
		expect(orm.constraints('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })')).toStrictEqual({"entity":"Products","constraints":[]})
	})
	test('getInfo', () => {
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, (p.UnitPrice * -1) AS source, ROUND(ABS((p.UnitPrice * -1)),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(acos(0.25), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 0.25 AS source, ROUND(ACOS(0.25),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(asin(0.25), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 0.25 AS source, ROUND(ASIN(0.25),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.25, result: round(atan(0.25), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 0.25 AS source, ROUND(ATAN(0.25),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 0.5 AS source, ROUND(ATAN(0.25,1),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(ceil(25.75), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 25.75 AS source, ROUND(CEIL(25.75),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(cos(2), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 2 AS source, ROUND(COS(2),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1, result: round(exp(1), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 1 AS source, ROUND(EXP(1),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 25.75, result: round(floor(25.75), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 25.75 AS source, ROUND(FLOOR(25.75),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 2, result: round(ln(2), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 2 AS source, ROUND(LN(2),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 10 AS m, 20 AS n, ROUND(LOG(10,20),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(135.375, 2) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 135.375 AS source, ROUND(135.375,2) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 255.5, result: round(sign(255.5), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 255.5 AS source, ROUND(SIGN(255.5),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 1.75, result: round(tan(1.75), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 1.75 AS source, ROUND(TAN(1.75),10) AS result FROM Products p  WHERE p.ProductID = ? "})
		expect(orm.plan('Products.filter(p => p.id === id).map(p => { name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Products","dialect":"MySQL","source":"MySQL","sentence":"SELECT p.ProductName AS name, 135.375 AS source, ROUND(TRUNCATE(135.375,2),10) AS result FROM Products p  WHERE p.ProductID = ? "})
	})
})

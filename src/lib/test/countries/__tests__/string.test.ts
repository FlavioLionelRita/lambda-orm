/* eslint-disable no-template-curly-in-string */
import { orm } from '../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/countries.env' })
	await orm.init('./config/countries.yaml')
})

describe('string', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lower(p.subregion) })')).toStrictEqual('Countries.map(p=>{result:lower(p.subregion)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: upper(p.subregion) })')).toStrictEqual('Countries.map(p=>{result:upper(p.subregion)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: concat(p.region," ",p.subregion) })')).toStrictEqual('Countries.map(p=>{result:concat(p.region, ,p.subregion)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lpad(p.region,12,"_") })')).toStrictEqual('Countries.map(p=>{result:lpad(p.region,12,_)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rpad(p.region,12,"_") })')).toStrictEqual('Countries.map(p=>{result:rpad(p.region,12,_)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: chr(68)})')).toStrictEqual('Countries.map(p=>{result:chr(68)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: ltrim("  a  ")})')).toStrictEqual('Countries.map(p=>{result:ltrim(  a  )}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rtrim("  a  ")})')).toStrictEqual('Countries.map(p=>{result:rtrim(  a  )}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: replace(p.region,"a","*")})')).toStrictEqual('Countries.map(p=>{result:replace(p.region,a,*)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: mask(p.subregion)})')).toStrictEqual('Countries.map(p=>{result:mask(p.subregion)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substr(p.subregion,1,3)})')).toStrictEqual('Countries.map(p=>{result:substring(p.subregion,1,3)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substring(p.subregion,1,3)})')).toStrictEqual('Countries.map(p=>{result:substring(p.subregion,1,3)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: strCount(p.subregion,"a")})')).toStrictEqual('Countries.map(p=>{result:strCount(p.subregion,a)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: toString(p.latitude)})')).toStrictEqual('Countries.map(p=>{result:toString(p.latitude)}).filter(p=>(p.iso3==BRA))')
	})
	test('model', () => {
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lower(p.subregion) })')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: upper(p.subregion) })')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: concat(p.region," ",p.subregion) })')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lpad(p.region,12,"_") })')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rpad(p.region,12,"_") })')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: chr(68)})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: ltrim("  a  ")})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rtrim("  a  ")})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: replace(p.region,"a","*")})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: mask(p.subregion)})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substr(p.subregion,1,3)})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substring(p.subregion,1,3)})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: strCount(p.subregion,"a")})')).toStrictEqual([{'name':'result','type':'number'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: toString(p.latitude)})')).toStrictEqual([{'name':'result','type':'string'}])
	})
	test('parameters', () => {
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lower(p.subregion) })')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: upper(p.subregion) })')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: concat(p.region," ",p.subregion) })')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lpad(p.region,12,"_") })')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rpad(p.region,12,"_") })')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: chr(68)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: ltrim("  a  ")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rtrim("  a  ")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: replace(p.region,"a","*")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: mask(p.subregion)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substr(p.subregion,1,3)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substring(p.subregion,1,3)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: strCount(p.subregion,"a")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: toString(p.latitude)})')).toStrictEqual([])
	})
	test('constraints', () => {
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lower(p.subregion) })')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: upper(p.subregion) })')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: concat(p.region," ",p.subregion) })')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lpad(p.region,12,"_") })')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rpad(p.region,12,"_") })')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: chr(68)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: ltrim("  a  ")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rtrim("  a  ")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: replace(p.region,"a","*")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: mask(p.subregion)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substr(p.subregion,1,3)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substring(p.subregion,1,3)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: strCount(p.subregion,"a")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: toString(p.latitude)})')).toStrictEqual({"entity":"Countries","constraints":[]})
	})
	test('getInfo', () => {
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lower(p.subregion) })',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT LOWER(c.subregion) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: upper(p.subregion) })',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT UPPER(c.subregion) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: concat(p.region," ",p.subregion) })',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CONCAT(CONCAT(c.region,' '),c.subregion) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: lpad(p.region,12,"_") })',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT LPAD(c.region,12,'_') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rpad(p.region,12,"_") })',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT RPAD(c.region,12,'_') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: chr(68)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CHAR(68 USING ASCII) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: ltrim("  a  ")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT LTRIM('  a  ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: rtrim("  a  ")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT RTRIM('  a  ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: replace(p.region,"a","*")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT REPLACE(c.region,'a','*') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: mask(p.subregion)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT Concat(LEFT(c.subregion,3),'***',RIGHT(c.subregion,3)) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substr(p.subregion,1,3)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT SUBSTR(c.subregion,1,3) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: substring(p.subregion,1,3)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT SUBSTR(c.subregion,1,3) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: strCount(p.subregion,"a")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT (LENGTH(c.subregion)-LENGTH(REPLACE(c.subregion,'a',''))) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result: toString(p.latitude)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CONVERT(c.latitude, CHAR) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
	})
})

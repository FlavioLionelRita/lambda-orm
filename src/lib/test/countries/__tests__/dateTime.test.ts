/* eslint-disable no-template-curly-in-string */
import { orm } from '../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './countries.env' })
	await orm.init('./countries.yaml')
})

describe('dateTime', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:today()})')).toStrictEqual('Countries.map(p=>{result:today()}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:now()})')).toStrictEqual('Countries.map(p=>{result:now()}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:curTime()})')).toStrictEqual('Countries.map(p=>{result:curTime()}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:time("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:time(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:date("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:date(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateTime("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:dateTime(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateToString(dateTime("2021-09-06T14:39:11.444Z"))})')).toStrictEqual('Countries.map(p=>{result:dateToString(dateTime(2021-09-06T14:39:11.444Z))}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:year("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:year(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:month("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:month(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:day("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:day(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:weekday("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:weekday(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hour("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:hour(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:minute("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:minute(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:second("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:second(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecond("2021-09-06T14:39:11.444Z")})')).toStrictEqual('Countries.map(p=>{result:millisecond(2021-09-06T14:39:11.444Z)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addYear("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addYear(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMonth("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addMonth(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addDay("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addDay(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addHour("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addHour(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMinute("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addMinute(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addSecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addSecond(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMillisecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual('Countries.map(p=>{result:addMillisecond(2021-09-06T14:39:11.444Z,2)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual('Countries.map(p=>{result:addTime(2021-09-06T14:39:11.444Z,08:22:12)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:subtractTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual('Countries.map(p=>{result:subtractTime(2021-09-06T14:39:11.444Z,08:22:12)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual('Countries.map(p=>{result:dayDiff(2021-09-06T14:39:11,2021-09-02T12:30:10)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual('Countries.map(p=>{result:hourDiff(2021-09-06T14:39:11,2021-09-02T12:30:10)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual('Countries.map(p=>{result:secondDiff(2021-09-06T14:39:11,2021-09-02T12:30:10)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual('Countries.map(p=>{result:millisecondDiff(2021-09-06T14:39:11,2021-09-02T12:30:10)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayToDate(2000)})')).toStrictEqual('Countries.map(p=>{result:dayToDate(2000)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourToDate(2000)})')).toStrictEqual('Countries.map(p=>{result:hourToDate(2000)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondToDate(2000)})')).toStrictEqual('Countries.map(p=>{result:secondToDate(2000)}).filter(p=>(p.iso3==BRA))')
		expect(orm.normalize('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondToDate(2000)})')).toStrictEqual('Countries.map(p=>{result:millisecondToDate(2000)}).filter(p=>(p.iso3==BRA))')
	})
	test('model', () => {
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:today()})')).toStrictEqual([{'name':'result','type':'date'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:now()})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:curTime()})')).toStrictEqual([{'name':'result','type':'time'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:time("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'time'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:date("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'date'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateTime("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateToString(dateTime("2021-09-06T14:39:11.444Z"))})')).toStrictEqual([{'name':'result','type':'string'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:year("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:month("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:day("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:weekday("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hour("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:minute("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:second("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecond("2021-09-06T14:39:11.444Z")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addYear("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMonth("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addDay("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addHour("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMinute("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addSecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMillisecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:subtractTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([{'name':'result','type':'integer'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayToDate(2000)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourToDate(2000)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondToDate(2000)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
		expect(orm.model('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondToDate(2000)})')).toStrictEqual([{'name':'result','type':'dateTime'}])
	})
	test('parameters', () => {
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:today()})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:now()})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:curTime()})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:time("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:date("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateTime("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateToString(dateTime("2021-09-06T14:39:11.444Z"))})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:year("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:month("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:day("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:weekday("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hour("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:minute("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:second("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecond("2021-09-06T14:39:11.444Z")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addYear("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMonth("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addDay("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addHour("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMinute("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addSecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMillisecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:subtractTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayToDate(2000)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourToDate(2000)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondToDate(2000)})')).toStrictEqual([])
		expect(orm.parameters('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondToDate(2000)})')).toStrictEqual([])
	})
	test('constraints', () => {
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:today()})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:now()})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:curTime()})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:time("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:date("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateTime("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateToString(dateTime("2021-09-06T14:39:11.444Z"))})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:year("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:month("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:day("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:weekday("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hour("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:minute("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:second("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecond("2021-09-06T14:39:11.444Z")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addYear("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMonth("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addDay("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addHour("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMinute("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addSecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMillisecond("2021-09-06T14:39:11.444Z",2)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:subtractTime("2021-09-06T14:39:11.444Z","08:22:12")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayToDate(2000)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourToDate(2000)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondToDate(2000)})')).toStrictEqual({"entity":"Countries","constraints":[]})
		expect(orm.constraints('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondToDate(2000)})')).toStrictEqual({"entity":"Countries","constraints":[]})
	})
	test('getInfo', () => {
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:today()})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CURDATE() AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:now()})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT NOW() AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:curTime()})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CURTIME() AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:time("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CONVERT('2021-09-06T14:39:11.444Z', TIME) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:date("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CONVERT('2021-09-06T14:39:11.444Z', DATE) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateTime("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT CONVERT('2021-09-06T14:39:11.444Z', DATETIME) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dateToString(dateTime("2021-09-06T14:39:11.444Z"))})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_FORMAT(CONVERT('2021-09-06T14:39:11.444Z', DATETIME), '%Y-%m-%dT%TZ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:year("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT EXTRACT(YEAR FROM '2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:month("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT EXTRACT(MONTH FROM '2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:day("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DAYOFMONTH('2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:weekday("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DAYOFWEEK('2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hour("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT EXTRACT(HOUR FROM '2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:minute("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT EXTRACT(MINUTE FROM '2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:second("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT EXTRACT(SECOND FROM '2021-09-06T14:39:11.444Z') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecond("2021-09-06T14:39:11.444Z")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT ROUND(EXTRACT(MICROSECOND FROM '2021-09-06T14:39:11.444Z')/1000,0) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addYear("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_ADD('2021-09-06T14:39:11.444Z', INTERVAL 2 YEAR) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMonth("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_ADD('2021-09-06T14:39:11.444Z', INTERVAL 2 MONTH) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addDay("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_ADD('2021-09-06T14:39:11.444Z', INTERVAL 2 DAY) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addHour("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT '2021-09-06T14:39:11.444Z' + interval '2' HOUR AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMinute("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT '2021-09-06T14:39:11.444Z' + interval '2' MINUTE AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addSecond("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT '2021-09-06T14:39:11.444Z' + interval '2' SECOND AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addMillisecond("2021-09-06T14:39:11.444Z",2)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_ADD('2021-09-06T14:39:11.444Z', INTERVAL (2 * 1000) MICROSECOND) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:addTime("2021-09-06T14:39:11.444Z","08:22:12")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT ADDTIME('2021-09-06T14:39:11.444Z','08:22:12') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:subtractTime("2021-09-06T14:39:11.444Z","08:22:12")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT SUBTIME('2021-09-06T14:39:11.444Z','08:22:12') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATEDIFF('2021-09-06T14:39:11','2021-09-02T12:30:10') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT TIMESTAMPDIFF(HOUR, '2021-09-02T12:30:10','2021-09-06T14:39:11') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT TIMESTAMPDIFF(SECOND, '2021-09-02T12:30:10','2021-09-06T14:39:11') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT ROUND(TIMESTAMPDIFF(MICROSECOND, '2021-09-02T12:30:10','2021-09-06T14:39:11')/1000,0) AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:dayToDate(2000)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_FORMAT(FROM_UNIXTIME(2000*24*3600), '%Y-%m-%dT%TZ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:hourToDate(2000)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_FORMAT(FROM_UNIXTIME(2000*3600), '%Y-%m-%dT%TZ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:secondToDate(2000)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_FORMAT(FROM_UNIXTIME(2000), '%Y-%m-%dT%TZ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
		expect(orm.getInfo('Countries.filter(p=> p.iso3 == "BRA").map(p=> {result:millisecondToDate(2000)})',{ stage: 'stage1' })).toStrictEqual({"entity":"Countries","dialect":"MySQL","source":"dataSource1","sentence":"SELECT DATE_FORMAT(FROM_UNIXTIME(2000/1000), '%Y-%m-%dT%TZ') AS result FROM Countries c  WHERE c.iso3 = 'BRA' ","children":[]})
	})
})

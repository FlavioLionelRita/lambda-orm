/* eslint-disable no-template-curly-in-string */
import { orm } from '../../../..'
beforeAll(async () => {
	require('dotenv').config({ path: './config/northwind.env' })
	await orm.init('./config/northwind.yaml')
})

describe('update', () => {
	const context = JSON.parse('{}')
	test('normalize', () => {
		expect(orm.normalize('Categories.update()')).toStrictEqual('Categories.update(p=>{name:name,description:description}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(entity)')).toStrictEqual('Categories.update(p=>{name:entity.name,description:entity.description}).filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Categories.update(p => entity)')).toStrictEqual('Categories.update(p=>{name:entity.name,description:entity.description}).filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Categories.update(p => p)')).toStrictEqual('Categories.update(p=>{name:name,description:description}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(p => { name: entity.name })')).toStrictEqual('Categories.update(p=>{name:entity.name}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(p => { name: upper(p.name) })')).toStrictEqual('Categories.update(p=>{name:upper(p.name)}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(p => { name: concat("_" + p.name) })')).toStrictEqual('Categories.update(p=>{name:concat((_+p.name))}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(() => [name] )')).toStrictEqual('Categories.update(=>{name:name})')
		expect(orm.normalize('Categories.update({ name: entity.name })')).toStrictEqual('Categories.update(p=>{name:entity.name}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update([name, description])')).toStrictEqual('Categories.update(p=>{name:name,description:description})')
		expect(orm.normalize('Categories.update(p=>[name, description])')).toStrictEqual('Categories.update(p=>{name:name,description:description})')
		expect(orm.normalize('Categories.update(p=>{name:name,description:description})')).toStrictEqual('Categories.update(p=>{name:name,description:description}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.update(p=>{name:upper(p.name),description:description})')).toStrictEqual('Categories.update(p=>{name:upper(p.name),description:description}).filter(p=>(p.id==id))')
		expect(orm.normalize('Categories.updateAll(p => { name: upper(p.name) })')).toStrictEqual('Categories.update(p=>{name:upper(p.name)})')
		expect(orm.normalize('Categories.updateAll(p => { name: concat("_",p.name) })')).toStrictEqual('Categories.update(p=>{name:concat(_,p.name)})')
		expect(orm.normalize('Categories.updateAll(() => [name])')).toStrictEqual('Categories.update(=>{name:name})')
		expect(orm.normalize('Orders.update({ name: entity.name }).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(p=>{name:entity.name}).filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Orders.update({ name: entity.name }).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(p=>{name:entity.name}).filter(p=>(p.id==entity.id)).include(p=>p.details.update(p=>{unitPrice:unitPrice,quantity:quantity,discount:discount}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.update({ name: entity.name }).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(p=>{name:entity.name}).filter(p=>(p.id==entity.id)).include(p=>p.details.update(p=>{unitPrice:p.unitPrice,productId:p.productId}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(p=>{name:entity.name}).filter(p=>(p.id==entity.id))')
		expect(orm.normalize('Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(=>{name:entity.name}).filter(p=>(p.id==entity.id)).include(p=>p.details.update(p=>{orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(=>{name:entity.name}).filter(p=>(p.id==entity.id)).include(p=>p.details.update(p=>{unitPrice:unitPrice,quantity:quantity,discount:discount}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual('Orders.update(=>{name:entity.name}).filter(p=>(p.id==entity.id)).include(p=>p.details.update(p=>{unitPrice:p.unitPrice,productId:p.productId}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Orders.update().include(p => p.details)')).toStrictEqual('Orders.update(p=>{customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).filter(p=>(p.id==id)).include(p=>p.details.update(p=>{orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}).filter(p=>((p.orderId==orderId)&&(p.productId==productId))))')
		expect(orm.normalize('Customers.update().include(p => p.orders.include(p => p.details))')).toStrictEqual('Customers.update(p=>{id:id,name:name,contact:contact,phone:phone,address:address,city:city,region:region,postalCode:postalCode,country:country}).filter(p=>(p.id==id)).include(p=>p.orders.update(p=>{customerId:customerId,employeeId:employeeId,orderDate:orderDate,requiredDate:requiredDate,shippedDate:shippedDate,shipViaId:shipViaId,freight:freight,name:name,address:address,city:city,region:region,postalCode:postalCode,country:country}).filter(p=>(p.id==id)).include(p=>p.details.update(p=>{orderId:orderId,productId:productId,unitPrice:unitPrice,quantity:quantity,discount:discount}).filter(p=>((p.orderId==orderId)&&(p.productId==productId)))))')
	})
	test('model', () => {
		expect(orm.model('Categories.update()')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(entity)')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p => entity)')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p => p)')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p => { name: entity.name })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.update(p => { name: upper(p.name) })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.update(p => { name: concat("_" + p.name) })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.update(() => [name] )')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.update({ name: entity.name })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.update([name, description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p=>[name, description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p=>{name:name,description:description})')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.update(p=>{name:upper(p.name),description:description})')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.model('Categories.updateAll(p => { name: upper(p.name) })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.updateAll(p => { name: concat("_",p.name) })')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Categories.updateAll(() => [name])')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Orders.update({ name: entity.name }).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Orders.update({ name: entity.name }).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Orders.update({ name: entity.name }).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'unitPrice','type':'decimal'},{'name':'productId','type':'integer'}]}])
		expect(orm.model('Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.model('Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'name','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'unitPrice','type':'decimal'},{'name':'productId','type':'integer'}]}])
		expect(orm.model('Orders.update().include(p => p.details)')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.model('Customers.update().include(p => p.orders.include(p => p.details))')).toStrictEqual([{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'orders','type':'Orders[]','children':[{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'details','type':'Orders.details[]','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}]}])
	})
	test('parameters', () => {
		expect(orm.parameters('Categories.update()')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(entity)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.description','type':'string'},{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Categories.update(p => entity)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.description','type':'string'},{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Categories.update(p => p)')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(p => { name: entity.name })')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(p => { name: upper(p.name) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(p => { name: concat("_" + p.name) })')).toStrictEqual([{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(() => [name] )')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.parameters('Categories.update({ name: entity.name })')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update([name, description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.update(p=>[name, description])')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'}])
		expect(orm.parameters('Categories.update(p=>{name:name,description:description})')).toStrictEqual([{'name':'name','type':'string'},{'name':'description','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.update(p=>{name:upper(p.name),description:description})')).toStrictEqual([{'name':'description','type':'string'},{'name':'id','type':'integer'}])
		expect(orm.parameters('Categories.updateAll(p => { name: upper(p.name) })')).toStrictEqual([])
		expect(orm.parameters('Categories.updateAll(p => { name: concat("_",p.name) })')).toStrictEqual([])
		expect(orm.parameters('Categories.updateAll(() => [name])')).toStrictEqual([{'name':'name','type':'string'}])
		expect(orm.parameters('Orders.update({ name: entity.name }).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Orders.update({ name: entity.name }).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'},{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.update({ name: entity.name }).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'}])
		expect(orm.parameters('Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.parameters('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'},{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual([{'name':'entity.name','type':'string'},{'name':'entity.id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'}]}])
		expect(orm.parameters('Orders.update().include(p => p.details)')).toStrictEqual([{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}])
		expect(orm.parameters('Customers.update().include(p => p.orders.include(p => p.details))')).toStrictEqual([{'name':'id','type':'string'},{'name':'name','type':'string'},{'name':'contact','type':'string'},{'name':'phone','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'orders','type':'Orders','children':[{'name':'customerId','type':'string'},{'name':'employeeId','type':'integer'},{'name':'orderDate','type':'dateTime'},{'name':'requiredDate','type':'date'},{'name':'shippedDate','type':'date'},{'name':'shipViaId','type':'integer'},{'name':'freight','type':'decimal'},{'name':'name','type':'string'},{'name':'address','type':'string'},{'name':'city','type':'string'},{'name':'region','type':'string'},{'name':'postalCode','type':'string'},{'name':'country','type':'string'},{'name':'id','type':'integer'},{'name':'details','type':'Orders.details','children':[{'name':'orderId','type':'integer'},{'name':'productId','type':'integer'},{'name':'unitPrice','type':'decimal'},{'name':'quantity','type':'decimal'},{'name':'discount','type':'decimal'}]}]}])
	})
	test('constraints', () => {
		expect(orm.constraints('Categories.update()')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update(entity)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update(p => entity)')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update(p => p)')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update(p => { name: entity.name })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update(p => { name: upper(p.name) })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update(p => { name: concat("_" + p.name) })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update(() => [name] )')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update({ name: entity.name })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.update([name, description])')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update(p=>[name, description])')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update(p=>{name:name,description:description})')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Categories.update(p=>{name:upper(p.name),description:description})')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.updateAll(p => { name: upper(p.name) })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.updateAll(p => { name: concat("_",p.name) })')).toStrictEqual({"entity":"Categories","constraints":[]})
		expect(orm.constraints('Categories.updateAll(() => [name])')).toStrictEqual({"entity":"Categories","constraints":[{"message":"Cannot be null property name in entity Categories","condition":"isNotNull(name)"}]})
		expect(orm.constraints('Orders.update({ name: entity.name }).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[]})
		expect(orm.constraints('Orders.update({ name: entity.name }).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.update({ name: entity.name }).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[]})
		expect(orm.constraints('Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"},{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)')).toStrictEqual({"entity":"Orders","constraints":[],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Orders.update().include(p => p.details)')).toStrictEqual({"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"},{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]})
		expect(orm.constraints('Customers.update().include(p => p.orders.include(p => p.details))')).toStrictEqual({"entity":"Customers","constraints":[{"message":"Cannot be null property id in entity Customers","condition":"isNotNull(id)"},{"message":"Cannot be null property name in entity Customers","condition":"isNotNull(name)"},{"message":"Cannot be null property id in entity Customers","condition":"isNotNull(id)"}],"children":[{"entity":"Orders","constraints":[{"message":"Cannot be null property customerId in entity Orders","condition":"isNotNull(customerId)"},{"message":"Cannot be null property employeeId in entity Orders","condition":"isNotNull(employeeId)"}],"children":[{"entity":"Orders.details","constraints":[{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"},{"message":"Cannot be null property orderId in entity Orders.details","condition":"isNotNull(orderId)"},{"message":"Cannot be null property productId in entity Orders.details","condition":"isNotNull(productId)"}]}]}]})
	})
	test('getInfo', () => {
		expect(orm.plan('Categories.update()',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p => entity)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p => p)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p => { name: entity.name })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p => { name: upper(p.name) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = UPPER(c.CategoryName) WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p => { name: concat("_" + p.name) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ('_' + c.CategoryName) WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(() => [name] )',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ? "})
		expect(orm.plan('Categories.update({ name: entity.name })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update([name, description])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? "})
		expect(orm.plan('Categories.update(p=>[name, description])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? "})
		expect(orm.plan('Categories.update(p=>{name:name,description:description})',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ?,Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.update(p=>{name:upper(p.name),description:description})',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = UPPER(c.CategoryName),Description = ? WHERE c.CategoryID = ? "})
		expect(orm.plan('Categories.updateAll(p => { name: upper(p.name) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = UPPER(c.CategoryName) "})
		expect(orm.plan('Categories.updateAll(p => { name: concat("_",p.name) })',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = CONCAT('_',c.CategoryName) "})
		expect(orm.plan('Categories.updateAll(() => [name])',{ stage: 'MySQL' })).toStrictEqual({"entity":"Categories","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Categories c SET CategoryName = ? "})
		expect(orm.plan('Orders.update({ name: entity.name }).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? "})
		expect(orm.plan('Orders.update({ name: entity.name }).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET UnitPrice = ?,Quantity = ?,Discount = ? WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Orders.update({ name: entity.name }).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET UnitPrice = o1.UnitPrice,ProductID = o1.ProductID WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? "})
		expect(orm.plan('Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET OrderID = ?,ProductID = ?,UnitPrice = ?,Quantity = ?,Discount = ? WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET UnitPrice = ?,Quantity = ?,Discount = ? WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET ShipName = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET UnitPrice = o1.UnitPrice,ProductID = o1.ProductID WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Orders.update().include(p => p.details)',{ stage: 'MySQL' })).toStrictEqual({"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET CustomerID = ?,EmployeeID = ?,OrderDate = ?,RequiredDate = ?,ShippedDate = ?,ShipVia = ?,Freight = ?,ShipName = ?,ShipAddress = ?,ShipCity = ?,ShipRegion = ?,ShipPostalCode = ?,ShipCountry = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET OrderID = ?,ProductID = ?,UnitPrice = ?,Quantity = ?,Discount = ? WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]})
		expect(orm.plan('Customers.update().include(p => p.orders.include(p => p.details))',{ stage: 'MySQL' })).toStrictEqual({"entity":"Customers","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Customers c SET CustomerID = ?,CompanyName = ?,ContactName = ?,ContactTitle = ?,Address = ?,City = ?,Region = ?,PostalCode = ?,Country = ? WHERE c.CustomerID = ? ","children":[{"entity":"Orders","dialect":"MySQL","source":"MySQL","sentence":"UPDATE Orders o SET CustomerID = ?,EmployeeID = ?,OrderDate = ?,RequiredDate = ?,ShippedDate = ?,ShipVia = ?,Freight = ?,ShipName = ?,ShipAddress = ?,ShipCity = ?,ShipRegion = ?,ShipPostalCode = ?,ShipCountry = ? WHERE o.OrderID = ? ","children":[{"entity":"Orders.details","dialect":"MySQL","source":"MySQL","sentence":"UPDATE `Order Details` o1 SET OrderID = ?,ProductID = ?,UnitPrice = ?,Quantity = ?,Discount = ? WHERE (o1.OrderID = ? AND o1.ProductID = ?) "}]}]})
	})
})

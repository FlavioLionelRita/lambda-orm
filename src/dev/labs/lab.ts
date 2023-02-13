import { orm } from '../../lib'
import { Categories, Customers, Products, Orders } from '../northwind/model/__model'

export async function apply (callback: any) {
	try {
		await orm.init('./config/northwind.yaml')		
		const options = {stage:'MySQL'}	
		const query = (id:number) => Orders.filter(p => p.id === id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])])  
		// const query = () => Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) }))
		// const query = () => Products.map(p => ({ average: round(avg(p.price), 4) }))
		const context = { id :1 }
		// [{ "$match" : { "_id":{{id}} } }, { "$project" :{ "_id": 0 , "name":"$ProductName", "source":255.5, "result":{ "$round" :[{ "$cond": [ { 255.5: { "$gt": 0 } } , 1, { "$cond": [ { 255.5: { "$lt": 0 } }, -1, 0] }] },10] } }} ]
		// console.log(orm.normalize(query))
		// console.log(JSON.stringify(orm.model(query)))
		// console.log(JSON.stringify(orm.parameters(query)))
		// console.log(JSON.stringify(orm.metadata(query)))
		console.log(JSON.stringify(orm.getInfo(query,options),null,2))
		console.log(JSON.stringify( await orm.execute(query,context,options),null, 2))

	} catch (error:any) {
		console.error(error.stack)
	} finally {
		await orm.end()
		callback()
	}
}

apply(function () { console.log('end') })


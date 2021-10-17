import { orm } from '../../orm'
import { CustomerRespository, Customer, Order, Categories, Customers, Products, Orders } from '../../models/northwind'

// class OrderRepository extends Respository<Order, QryOrder> {
// constructor (database: string) {
// super('Orders', database)
// }
// }

(async () => {
	try {
		await orm.init()
		const customerRepository = new CustomerRespository('mysql')
		const customer = new Customer()
		customer.name = 'a'
		customer.orders.push(new Order())
		const name = 'a'

		await customerRepository.insert().execute(customer)

		let complete = customerRepository.insert(() => ({ name: name })).include(p => p.orders).complete()
		console.log(complete)
		const query = (name: string, description: string) => Categories.insert(() => ({ name: name, description: description }))
		complete = orm.lambda(query).complete('northwind')
		console.log(complete)

		const query2 = () => Customers
		console.log(orm.lambda(query2).expression)
		console.log(orm.lambda(query2).complete('northwind'))

		const query3 = () => Products.map(p => p).page(1, 1)
		console.log(orm.lambda(query3).expression)
		console.log(orm.lambda(query3).complete('northwind'))
		const query4 = (entity: any) => Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => (p.id === entity.id))
		console.log(orm.lambda(query4).complete('northwind'))

		// const result = await orm.lambda(query).execute({ name: 'test1', description: 'test1' })
		// console.log(result)
		// complete = customerRepository.update(p => [p.name, p.id]).include(p => p.orders).complete()
		// console.log(complete)

		// // const orderRespository = new OrderRepository('mysql')
		// // orderRespository.save(customer.orders, p => p.details)

		// complete = customerRepository.query().filter(p => p.name !== 'XX').include(p => p.orders.map(p => p.orderDate)).complete()
		// console.log(complete)

		// const result2 = await customerRepository.query().filter(p => p.name !== 'XX').include(p => p.orders.map(p => p.orderDate)).execute()

		// // const a = 'a'
		// // customerRepository.filter(p => p.name === a)

		// // customerRepository.query().filter(p => p.name === a).include(p => p.orders)

		// console.log(JSON.stringify(result2, null, 2))

		// const query2 = () => Customers
		// const result = await orm.lambda(query2).execute({}, 'mysql')
		// console.log(JSON.stringify(result, null, 2))
	} catch (error) {
		console.error(error)
	} finally {
		await orm.end()
	}
})()

// export async function apply (callback: any) {
// try {
// await orm.init()

// const query = () => Products.filter(p => p.price > 10).map(p => ({ name: p.name, category: p.category.name })).sort(p => p.category).page(1, 10)
// const sentence = await orm.expression(query).sentence('mysql', 'northwind')
// console.log(sentence)
// } catch (error) {
// console.error(error)
// } finally {
// await orm.end()
// callback()
// }
// }

// apply(function () { console.log('end') })

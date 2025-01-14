/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../syntax.d.ts" />
import { LoggerBuilder, orm, OrmH3lp, QueryPlan } from '../../../lib'
import { Categories, Customers, Products, Orders } from '../model/__model'
import { CategoryTest, ExpressionTest, ExecutionResult } from './testModel'
import { h3lp } from 'h3lp'
const helper = new OrmH3lp(h3lp, new LoggerBuilder().build())

async function exec (fn: any) {
	const t1 = Date.now()
	const result = await fn()
	const t2 = Date.now()
	console.log(t2 - t1)
	if (result) {
		if (typeof result === 'string' || result instanceof String) console.log(result)
		else console.log(JSON.stringify(result))
	}
	return result
}

async function writeTest (stages: string[], category: CategoryTest): Promise<number> {
	category.errors = 0
	for (const q in category.test) {
		const expressionTest = category.test[q] as ExpressionTest

		expressionTest.sentences = []
		expressionTest.errors = 0
		try {
			expressionTest.expression = orm.exp.convert(expressionTest.lambda, 'function')[0]
			// expressionTest.lambda = expressionTest.lambda.toString()
			expressionTest.normalizeExpression = orm.normalize(expressionTest.expression as string)
			expressionTest.model = orm.model(expressionTest.expression as string)
			expressionTest.parameters = orm.parameters(expressionTest.expression as string)
			expressionTest.constraints = orm.constraints(expressionTest.expression as string)
			expressionTest.metadata = orm.metadata(expressionTest.expression as string)
			for (const r in stages) {
				const stage = stages[r]
				let info: QueryPlan | undefined
				let error
				try {
					info = orm.plan(expressionTest.expression as string, { stage, view: 'default' })
				} catch (err: any) {
					error = err.toString()
				} finally {
					if (error !== undefined) {
						expressionTest.sentences.push({ stage, error })
						expressionTest.errors++
					} else if (info !== undefined) {
						expressionTest.sentences.push({ stage, info })
					} else {
						expressionTest.sentences.push({ stage, error: `error sentence ${stage} ${category.name}:${expressionTest.name}` })
						expressionTest.errors++
					}
				}
			}
			expressionTest.executions = []
			const results: ExecutionResult[] = []
			for (const p in stages) {
				const stage = stages[p]
				let result
				let error
				try {
					// console.log(expressionTest.expression)
					const data = expressionTest.data !== undefined ? category.data[expressionTest.data] : {}
					result = await orm.execute(expressionTest.lambda, data, { stage, view: 'default' })
				} catch (err: any) {
					error = err.toString()
				} finally {
					if (error !== undefined) {
						expressionTest.executions.push({ stage, error })
						expressionTest.errors++
					} else if (result !== undefined) {
						results.push({ stage, result })
					} else {
						expressionTest.executions.push({ stage, error: `error execution ${stage} ${category.name}:${expressionTest.name}` })
						expressionTest.errors++
					}
				}
			}
			if (results.length === 1) {
				expressionTest.result = results[0].result
				expressionTest.executions.push({ stage: results[0].stage })
			} else if (results.length > 1) {
				expressionTest.result = results[0].result
				expressionTest.executions.push({ stage: results[0].stage })
				const pattern = results[0].result
				for (let i = 1; i < results.length; i++) {
					const result = results[i].result
					if (helper.obj.equal(result, pattern, { strict: false })) {
						expressionTest.executions.push({ stage: results[i].stage })
					} else {
						expressionTest.executions.push({ stage: results[i].stage, error: `not equal ${results[0].stage}`, result: results[i].result })
						expressionTest.errors++
					}
				}
			}
		} catch (err: any) {
			expressionTest.error = err.toString()
			expressionTest.errors++
		}
		category.errors += expressionTest.errors
	}
	try {
		const yamlStr = helper.yaml.dump(JSON.parse(JSON.stringify(category)))
		await helper.fs.write('src/dev/northwind/test/data/' + category.name.replace(' ', '_') + '.yaml', yamlStr)
	} catch (error) {
		console.error(error)
		for (const q in category.test) {
			try {
				const expressionTest = category.test[q] as ExpressionTest
				const yamlStr = helper.yaml.dump(expressionTest)
			} catch (error) {
				console.error(error)
			}
		}
	}
	return category.errors
}

async function writeQueryTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'query',
		// stage: 'source',
		data: {
			a: { id: 1 },
			b: { minValue: 10, fromDate: '1997-01-01', toDate: '1997-12-31' }
		},
		test: [
			{ name: 'query 1', lambda: () => Products.sort(p => p.name) },
			{ name: 'query 2', lambda: () => Products.map(p => p).sort(p => p.id).page(1, 1) },
			{ name: 'query 3', lambda: () => Products.sort(p => p.id).page(1, 1) },
			{ name: 'query 4', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => p).sort(p => p.id) },
			{ name: 'query 5', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).sort(p => p.id) },
			{ name: 'query 6', data: 'a', lambda: () => Products.map(p => ({ category: p.category.name })).sort(p => p.category) },
			{ name: 'query 7', data: 'a', lambda: () => Products.map(p => ({ name: p.name, category: p.category.name })).sort(p => [p.category, p.name]) },
			{ name: 'query 8', lambda: () => Products.map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => p.name) },
			{ name: 'query 9', lambda: () => Products.filter(p => p.discontinued !== false).map(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })).sort(p => [p.category, desc(p.name)]) },
			{ name: 'query 10', data: 'b', lambda: (minValue: number, fromDate: Date, toDate: Date) => Orders.details.filter(p => between(p.order.shippedDate, fromDate, toDate) && p.unitPrice > minValue).map(p => ({ category: p.product.category.name, product: p.product.name, unitPrice: p.unitPrice, quantity: p.quantity })).sort(p => [p.category, p.product, p.unitPrice, p.quantity]) },
			{ name: 'query 11', lambda: () => Products.sort(p => p.id).page(1, 1) },
			{ name: 'query 12', lambda: () => Products.first(p => p) },
			{ name: 'query 13', lambda: () => Products.last(p => p) },
			{ name: 'query 14', lambda: () => Products.first(p => ({ category: p.category.name, name: p.name, quantity: p.quantity, inStock: p.inStock })) },
			{ name: 'query 15', lambda: () => Products.filter(p => p.discontinued !== false).last(p => p.id) },
			{ name: 'query 16', lambda: () => Products.distinct(p => p).sort(p => p.id) },
			{ name: 'query 17', data: 'a', lambda: () => Products.distinct(p => ({ category: p.category.name })).sort(p => p.category) },
			{ name: 'query 18', data: 'a', lambda: () => Products.distinct(p => ({ quantity: p.quantity, category: p.category.name })).sort(p => [p.quantity, p.category]) }
		]
	})
}
async function writeNumericTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'numeric',
		data: { a: { id: 1 } },
		test:
			[
				{ name: 'function abs', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price * -1, result: round(abs(p.price * -1), 10) })) },
				{ name: 'function acos', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 0.25, result: round(acos(0.25), 10) })) },
				{ name: 'function asin', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 0.25, result: round(asin(0.25), 10) })) },
				{ name: 'function atan', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 0.25, result: round(atan(0.25), 10) })) },
				{ name: 'function atan2', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 0.50, result: round(atan2(0.25, 1), 10) })) },
				{ name: 'function ceil', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 25.75, result: round(ceil(25.75), 10) })) },
				{ name: 'function cos', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 2, result: round(cos(2), 10) })) },
				{ name: 'function exp', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 1, result: round(exp(1), 10) })) },
				{ name: 'function floor', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 25.75, result: round(floor(25.75), 10) })) },
				{ name: 'function ln', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 2, result: round(ln(2), 10) })) },
				{ name: 'function log', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, m: 10, n: 20, result: round(log(10, 20), 10) })) },
				{ name: 'function round', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 135.375, result: round(135.375, 2) })) },
				{ name: 'function sign', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 255.5, result: round(sign(255.5), 10) })) },
				{ name: 'function tan', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 1.75, result: round(tan(1.75), 10) })) },
				{ name: 'function trunc', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: 135.375, result: round(trunc(135.375, 2), 10) })) }
			]
	})
}
async function writeGroupByTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'groupBy',
		data: { a: { id: 1 } },
		test:
			[{ name: 'groupBy 1', lambda: () => Products.map(p => ({ maxPrice: max(p.price) })) },
				{ name: 'groupBy 2', lambda: () => Products.map(p => ({ minPrice: min(p.price) })) },
				{ name: 'groupBy 3', lambda: () => Products.map(p => ({ total: sum(p.price) })) },
				{ name: 'groupBy 4', lambda: () => Products.map(p => ({ average: round(avg(p.price), 4) })) },
				{ name: 'groupBy 5', lambda: () => Products.map(p => ({ count: count(1) })) },
				{ name: 'groupBy 6', lambda: () => Products.map(p => ({ category: p.categoryId, largestPrice: max(p.price) })) },
				{ name: 'groupBy 7', lambda: () => Products.map(p => ({ category: p.category.name, largestPrice: max(p.price) })) },
				{ name: 'groupBy 8', data: 'a', lambda: (id: number) => Products.filter(p => p.id === id).map(p => ({ name: p.name, source: p.price, result: abs(p.price) })) },
				{ name: 'groupBy 9', lambda: () => Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })) },
				{ name: 'query 10', lambda: () => Orders.details.map(p => ({ subTotal: sum((p.unitPrice * p.quantity * (1 - p.discount / 100)) * 100) })).sort(p => p.subTotal) }
				// { name: 'groupBy 11', lambda: () => Products.having(p => max(p.price) > 100).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice)) },
				// { name: 'groupBy 12', lambda: () => Products.filter(p => p.price > 5).having(p => max(p.price) > 50).map(p => ({ category: p.category.name, largestPrice: max(p.price) })).sort(p => desc(p.largestPrice)) }
			]
	})
}
async function writeIncludeTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'include',
		// stage: 'source',
		data: { a: { id: 1 } },
		test:
			[
				{ name: 'include 1', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => p.customer) },
				{ name: 'include 2', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => p.details) },
				{ name: 'include 3', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.details, p.customer]) },
				{ name: 'include 4', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.details.include(q => q.product), p.customer]) },
				{ name: 'include 5', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.details.include(q => q.product.include(p => p.category)), p.customer]) },
				{ name: 'include 6', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.details.map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer]) },
				{ name: 'include 7', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.details.include(q => q.product).map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice, productId: p.productId })), p.customer]) },
				{ name: 'include 8', data: 'a', lambda: (id: number) => Orders.filter(p => p.id === id).include(p => [p.customer.map(p => p.name), p.details.include(p => p.product.include(p => p.category.map(p => p.name)).map(p => p.name)).map(p => [p.quantity, p.unitPrice])]) }
			]
	})
}
async function writeInsertsTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'inserts',
		// stage: 'source',
		data: {
			a: { name: 'Beverages20', description: 'Soft drinks, coffees, teas, beers, and ales' },
			b: { name: 'Beverages21', description: 'Soft drinks, coffees, teas, beers, and ales' },
			c: { entity: { name: 'Beverages22', description: 'Soft drinks, coffees, teas, beers, and ales' } },
			d: { entity: { name: 'Beverages23', description: 'Soft drinks, coffees, teas, beers, and ales' } },
			order: {
				customerId: 'VINET',
				employeeId: 5,
				orderDate: '1996-07-03T22:00:00.000Z',
				requiredDate: '1996-07-31T22:00:00.000Z',
				shippedDate: '1996-07-15T22:00:00.000Z',
				shipViaId: 3,
				freight: 32.38,
				name: 'Vins et alcools Chevalier',
				address: '59 rue de l-Abbaye',
				city: 'Reims',
				region: null,
				postalCode: '51100',
				country: 'France',
				details: [
					{
						productId: 11,
						unitPrice: 14,
						quantity: 12,
						discount: 10
					},
					{
						productId: 42,
						unitPrice: 9.8,
						quantity: 10,
						discount: 10
					},
					{
						productId: 72,
						unitPrice: 34.8,
						quantity: 5,
						discount: 10
					}
				]
			}
		},
		test:
			[
				{ name: 'insert 1', data: 'a', lambda: () => Categories.insert() },
				{ name: 'insert 2', data: 'b', lambda: (name: string, description: string) => Categories.insert(() => [name, description]) },
				{ name: 'insert 3', data: 'c', lambda: (entity: any) => Categories.insert(entity) },
				{ name: 'insert 4', data: 'd', lambda: (entity: any) => Categories.insert(entity) },
				{ name: 'insert 5', data: 'order', lambda: () => Orders.insert() },
				{ name: 'insert 6', data: 'order', lambda: () => Orders.insert().include(p => p.details) },
				{ name: 'insert 7', data: 'order', lambda: () => Orders.insert().include(p => [p.details, p.customer]) }
			]
	})
}
async function writeUpdateTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'update',
		// stage: 'source',
		data: {
			a: {
				id: 7,
				customerId: 'ANATR',
				employeeId: 7,
				orderDate: '1996-09-17T22:00:00.000Z',
				requiredDate: '1996-10-15T22:00:00.000Z',
				shippedDate: '1996-09-23T22:00:00.000Z',
				shipViaId: 3,
				freight: '1.6100',
				name: 'Ana Trujillo Emparedados y helados',
				address: 'Avda. de la Constitución 2222',
				city: 'Mexico D.F.',
				region: null,
				postalCode: '5021',
				country: 'Mexico',
				details: [
					{
						orderId: 7,
						productId: 69,
						unitPrice: '28.8000',
						quantity: '1.0000',
						discount: '0.0000'
					},
					{
						orderId: 7,
						productId: 70,
						unitPrice: '12.0000',
						quantity: '5.0000',
						discount: '0.0000'
					}
				]
			},
			b: {
				entity: {
					id: 8,
					customerId: 'ANATR',
					employeeId: 3,
					orderDate: '1997-08-07T22:00:00.000Z',
					requiredDate: '1997-09-04T22:00:00.000Z',
					shippedDate: '1997-08-13T22:00:00.000Z',
					shipViaId: 1,
					freight: '43.9000',
					name: 'Ana Trujillo Emparedados y helados',
					address: 'Avda. de la Constitución 2222',
					city: 'Mexico D.F.',
					region: null,
					postalCode: '5021',
					country: 'Mexico',
					details: [
						{
							orderId: 8,
							productId: 14,
							unitPrice: '23.2500',
							quantity: '3.0000',
							discount: '0.0000'
						},
						{
							orderId: 8,
							productId: 42,
							unitPrice: '14.0000',
							quantity: 'errors: 15.0000',
							discount: '0.0000'
						},
						{
							orderId: 8,
							productId: 60,
							unitPrice: '34.0000',
							quantity: '10.0000',
							discount: '0.0000'
						}
					]
				}
			},
			c: { postalCode: 'xxx' },
			d: {
				id: 'ALFKI',
				name: 'Alfreds Futterkiste',
				contact: 'Maria Anders',
				phone: 'Sales Representative',
				address: 'Obere Str. 57',
				city: 'Berlin',
				region: null,
				postalCode: '12209',
				country: 'Germany',
				orders: [
					{
						id: 1,
						customerId: 'ALFKI',
						employeeId: 6,
						orderDate: '1997-08-24T22:00:00.000Z',
						requiredDate: '1997-09-21T22:00:00.000Z',
						shippedDate: '1997-09-01T22:00:00.000Z',
						shipViaId: 1,
						freight: '29.4600',
						name: 'Alfreds Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 1,
								productId: 28,
								unitPrice: '45.6000',
								quantity: '15.0000',
								discount: '0.0000'
							},
							{
								orderId: 1,
								productId: 39,
								unitPrice: '18.0000',
								quantity: '21.0000',
								discount: '0.0000'
							},
							{
								orderId: 1,
								productId: 46,
								unitPrice: '12.0000',
								quantity: '2.0000',
								discount: '0.0000'
							}
						]
					},
					{
						id: 2,
						customerId: 'ALFKI',
						employeeId: 4,
						orderDate: '1997-10-02T22:00:00.000Z',
						requiredDate: '1997-10-30T23:00:00.000Z',
						shippedDate: '1997-10-12T22:00:00.000Z',
						shipViaId: 2,
						freight: '61.0200',
						name: 'Alfred-s Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 2,
								productId: 63,
								unitPrice: '43.9000',
								quantity: '20.0000',
								discount: '0.0000'
							}
						]
					},
					{
						id: 3,
						customerId: 'ALFKI',
						employeeId: 4,
						orderDate: '1997-10-12T22:00:00.000Z',
						requiredDate: '1997-11-23T23:00:00.000Z',
						shippedDate: '1997-10-20T22:00:00.000Z',
						shipViaId: 1,
						freight: '23.9400',
						name: 'Alfred-s Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 3,
								productId: 3,
								unitPrice: '10.0000',
								quantity: '6.0000',
								discount: '0.0000'
							},
							{
								orderId: 3,
								productId: 76,
								unitPrice: '18.0000',
								quantity: '15.0000',
								discount: '0.0000'
							}
						]
					},
					{
						id: 4,
						customerId: 'ALFKI',
						employeeId: 1,
						orderDate: '1998-01-14T23:00:00.000Z',
						requiredDate: '1998-02-11T23:00:00.000Z',
						shippedDate: '1998-01-20T23:00:00.000Z',
						shipViaId: 3,
						freight: '69.5300',
						name: 'Alfred-s Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 4,
								productId: 59,
								unitPrice: '55.0000',
								quantity: '15.0000',
								discount: '0.0000'
							},
							{
								orderId: 4,
								productId: 77,
								unitPrice: '13.0000',
								quantity: '2.0000',
								discount: '0.0000'
							}
						]
					},
					{
						id: 5,
						customerId: 'ALFKI',
						employeeId: 1,
						orderDate: '1998-03-15T23:00:00.000Z',
						requiredDate: '1998-04-26T22:00:00.000Z',
						shippedDate: '1998-03-23T23:00:00.000Z',
						shipViaId: 1,
						freight: '40.4200',
						name: 'Alfred-s Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 5,
								productId: 6,
								unitPrice: '25.0000',
								quantity: '16.0000',
								discount: '0.0000'
							},
							{
								orderId: 5,
								productId: 28,
								unitPrice: '45.6000',
								quantity: '2.0000',
								discount: '0.0000'
							}
						]
					},
					{
						id: 6,
						customerId: 'ALFKI',
						employeeId: 3,
						orderDate: '1998-04-08T22:00:00.000Z',
						requiredDate: '1998-05-06T22:00:00.000Z',
						shippedDate: '1998-04-12T22:00:00.000Z',
						shipViaId: 1,
						freight: '1.2100',
						name: 'Alfred-s Futterkiste',
						address: 'Obere Str. 57',
						city: 'Berlin',
						region: null,
						postalCode: '12209',
						country: 'Germany',
						details: [
							{
								orderId: 6,
								productId: 58,
								unitPrice: '13.2500',
								quantity: '40.0000',
								discount: '0.0000'
							},
							{
								orderId: 6,
								productId: 71,
								unitPrice: '21.5000',
								quantity: '20.0000',
								discount: '0.0000'
							}
						]
					}
				]
			}
		},
		test:
			[
				{ name: 'update 1', data: 'a', lambda: () => Orders.update() },
				{ name: 'update 2', data: 'b', lambda: (entity: any) => Orders.update(entity) },
				{ name: 'update 3', data: 'c', lambda: (postalCode: string) => Orders.updateAll(() => [postalCode]) },
				{ name: 'update 4', data: 'b', lambda: (entity: any) => Orders.update(p => ({ name: entity.name })).filter(p => p.id === entity.id) },
				{ name: 'update 5', data: 'b', lambda: (entity: any) => Orders.update(() => ({ name: entity.name })).include(p => p.details).filter(p => p.id === entity.id) },
				{ name: 'update 6', data: 'b', lambda: (entity: any) => Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => p)).filter(p => p.id === entity.id) },
				{ name: 'update 7', data: 'b', lambda: (entity: any) => Orders.update(() => ({ name: entity.name })).include(p => p.details.update(p => ({ unitPrice: p.unitPrice, productId: p.productId }))).filter(p => p.id === entity.id) },
				{ name: 'update 8', data: 'a', lambda: () => Orders.update().include(p => p.details) },
				{ name: 'update 9', data: 'd', lambda: () => Customers.update().include(p => p.orders.include(p => p.details)) }
			]
	})
}
async function writeDeleteTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'delete',
		// stage: 'source',
		data: {
			a: { id: 9 },
			b: {
				id: 1,
				customerId: 'ALFKI',
				employeeId: 6,
				orderDate: '1997-08-24T22:00:00.000Z',
				requiredDate: '1997-09-21T22:00:00.000Z',
				shippedDate: '1997-09-01T22:00:00.000Z',
				shipViaId: 1,
				freight: '29.4600',
				name: 'Alfreds Futterkiste',
				address: 'Obere Str. 57',
				city: 'Berlin',
				region: null,
				postalCode: '12209',
				country: 'Germany',
				details: [
					{
						orderId: 1,
						productId: 28,
						unitPrice: '45.6000',
						quantity: '15.0000',
						discount: '0.0000'
					},
					{
						orderId: 1,
						productId: 39,
						unitPrice: '18.0000',
						quantity: '21.0000',
						discount: '0.0000'
					},
					{
						orderId: 1,
						productId: 46,
						unitPrice: '12.0000',
						quantity: '2.0000',
						discount: '0.0000'
					}
				]
			},
			c: {
				id: 2,
				customerId: 'ALFKI',
				employeeId: 4,
				orderDate: '1997-10-02T22:00:00.000Z',
				requiredDate: '1997-10-30T23:00:00.000Z',
				shippedDate: '1997-10-12T22:00:00.000Z',
				shipViaId: 2,
				freight: '61.0200',
				name: 'Alfred-s Futterkiste',
				address: 'Obere Str. 57',
				city: 'Berlin',
				region: null,
				postalCode: '12209',
				country: 'Germany',
				details: [
					{
						orderId: 2,
						productId: 63,
						unitPrice: '43.9000',
						quantity: '20.0000',
						discount: '0.0000'
					}
				]
			},
			d: {
				id: 4,
				customerId: 'ALFKI',
				employeeId: 1,
				orderDate: '1998-01-14T23:00:00.000Z',
				requiredDate: '1998-02-11T23:00:00.000Z',
				shippedDate: '1998-01-20T23:00:00.000Z',
				shipViaId: 3,
				freight: '69.5300',
				name: 'Alfred-s Futterkiste',
				address: 'Obere Str. 57',
				city: 'Berlin',
				region: null,
				postalCode: '12209',
				country: 'Germany',
				details: [
					{
						orderId: 4,
						productId: 59,
						unitPrice: '55.0000',
						quantity: '15.0000',
						discount: '0.0000'
					},
					{
						orderId: 4,
						productId: 77,
						unitPrice: '13.0000',
						quantity: '2.0000',
						discount: '0.0000'
					}
				]
			},
			e: {
				entity: {
					orderId: 5,
					productId: 6,
					unitPrice: '25.0000',
					quantity: '16.0000',
					discount: '0.0000'
				}
			},
			f: {
				entity: {
					id: 5,
					customerId: 'ALFKI',
					employeeId: 1,
					orderDate: '1998-03-15T23:00:00.000Z',
					requiredDate: '1998-04-26T22:00:00.000Z',
					shippedDate: '1998-03-23T23:00:00.000Z',
					shipViaId: 1,
					freight: '40.4200',
					name: 'Alfred-s Futterkiste',
					address: 'Obere Str. 57',
					city: 'Berlin',
					region: null,
					postalCode: '12209',
					country: 'Germany',
					details: [
						{
							orderId: 5,
							productId: 6,
							unitPrice: '25.0000',
							quantity: '16.0000',
							discount: '0.0000'
						},
						{
							orderId: 5,
							productId: 28,
							unitPrice: '45.6000',
							quantity: '2.0000',
							discount: '0.0000'
						}
					]
				}
			}
		},
		test:
			[{ name: 'delete 1', data: 'a', lambda: (id: number) => Orders.details.delete().filter(p => p.orderId === id) },
				{ name: 'delete 2', data: 'b', lambda: () => Orders.delete().include(p => p.details) },
				{ name: 'delete 3', data: 'c', lambda: (id: number) => Orders.delete().filter(p => p.id === id).include(p => p.details) },
				{ name: 'delete 4', data: 'd', lambda: () => Orders.delete().include(p => p.details) },
				{ name: 'delete 4', data: 'd', lambda: (entity: any) => Orders.details.delete(entity) },
				{ name: 'delete 5', data: 'e', lambda: (entity: any) => Orders.delete(entity).include(p => p.details) },
				{ name: 'delete 6', lambda: () => Orders.details.deleteAll() }
			]
	})
}
// TODO: add delete on cascade , example Orders.delete().cascade(p=> p.details)
async function writeBulkInsertTest (stages: string[]): Promise<number> {
	return await writeTest(stages, {
		name: 'bulkInsert',
		// stage: 'source',
		data: {
			a: [{
				name: 'Beverages4',
				description: 'Soft drinks, coffees, teas, beers, and ales'
			},
			{
				name: 'Condiments4',
				description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
			}
			],
			b: [
				{

					customerId: 'ALFKI',
					employeeId: 6,
					orderDate: '1997-08-24T22:00:00.000Z',
					requiredDate: '1997-09-21T22:00:00.000Z',
					shippedDate: '1997-09-01T22:00:00.000Z',
					shipViaId: 1,
					freight: '29.4600',
					name: 'Alfreds Futterkiste',
					address: 'Obere Str. 57',
					city: 'Berlin',
					region: null,
					postalCode: '12209',
					country: 'Germany',
					details: [
						{
							productId: 28,
							unitPrice: '45.6000',
							quantity: 15,
							discount: 0
						},
						{
							productId: 39,
							unitPrice: '18.0000',
							quantity: 21,
							discount: 0
						},
						{
							productId: 46,
							unitPrice: '12.0000',
							quantity: 2,
							discount: 0
						}
					]
				},
				{
					customerId: 'ALFKI',
					employeeId: 4,
					orderDate: '1997-10-02T22:00:00.000Z',
					requiredDate: '1997-10-30T23:00:00.000Z',
					shippedDate: '1997-10-12T22:00:00.000Z',
					shipViaId: 2,
					freight: '61.0200',
					name: 'Alfred-s Futterkiste',
					address: 'Obere Str. 57',
					city: 'Berlin',
					region: null,
					postalCode: '12209',
					country: 'Germany',
					details: [
						{
							productId: 63,
							unitPrice: '43.9000',
							quantity: 20,
							discount: 0
						}
					]
				},
				{
					customerId: 'ALFKI',
					employeeId: 4,
					orderDate: '1997-10-12T22:00:00.000Z',
					requiredDate: '1997-11-23T23:00:00.000Z',
					shippedDate: '1997-10-20T22:00:00.000Z',
					shipViaId: 1,
					freight: '23.9400',
					name: 'Alfred-s Futterkiste',
					address: 'Obere Str. 57',
					city: 'Berlin',
					region: null,
					postalCode: '12209',
					country: 'Germany',
					details: [
						{
							productId: 3,
							unitPrice: '10.0000',
							quantity: 6,
							discount: 0
						},
						{
							productId: 76,
							unitPrice: '18.0000',
							quantity: 15,
							discount: 0
						}
					]
				}
			]

		},
		test:
			[{ name: 'bulkInsert 1', data: 'a', lambda: () => Categories.bulkInsert() },
				{ name: 'bulkInsert 2', data: 'b', lambda: () => Orders.bulkInsert().include(p => p.details) }
			]
	})
}
async function crud () {
	const order = { customerId: 'VINET', employeeId: 5, orderDate: '1996-07-03T22:00:00.000Z', requiredDate: '1996-07-31T22:00:00.000Z', shippedDate: '1996-07-15T22:00:00.000Z', shipViaId: 3, freight: 32.38, name: 'Vins et alcools Chevalier', address: '59 rue de l-Abbaye', city: 'Reims', region: null, postalCode: '51100', country: 'France', details: [{ productId: 11, unitPrice: 14, quantity: 12, discount: !1 }, { productId: 42, unitPrice: 9.8, quantity: 10, discount: !1 }, { productId: 72, unitPrice: 34.8, quantity: 5, discount: !1 }] }

	try {
		orm.transaction({ stage: 'source' }, async (tr) => {
			// create order
			const orderId = await tr.execute(() => Orders.insert().include(p => p.details), order)
			// get order
			const result = await tr.execute((id: number) => Orders.filter(p => p.id === id).include(p => p.details), { id: orderId })
			const order2 = result[0]
			// updated order
			order2.address = 'changed 59 rue de l-Abbaye'
			order2.details[0].discount = true
			order2.details[1].unitPrice = 10
			order2.details[2].quantity = 7
			const updateCount = await tr.execute(() => Orders.update().include(p => p.details), order2)
			console.log(updateCount)
			// get order
			const order3 = await tr.execute((id: number) => Orders.filter(p => p.id === id).include(p => p.details), { id: orderId })
			console.log(JSON.stringify(order3))
			// delete
			const deleteCount = await tr.execute(() => Orders.delete().include(p => p.details), order3[0])
			console.log(deleteCount)
			// get order
			const order4 = await tr.execute((id: number) => Orders.filter(p => p.id === id).include(p => p.details), { id: orderId })
			console.log(JSON.stringify(order4))
		})
	} catch (error) {
		console.log(error)
	}
}
async function bulkInsert () {
	const expression = 'Categories.bulkInsert()'
	const categories = [
		{
			name: 'Beverages2',
			description: 'Soft drinks, coffees, teas, beers, and ales'
		},
		{
			name: 'Condiments2',
			description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
		}
	]
	const result = await exec(async () => (await orm.execute(expression, categories, { stage: 'source', view: 'default' })))
}
async function bulkInsert2 () {
	const expression = 'Orders.bulkInsert().include(p=> p.details)'
	const orders = [
		{

			customerId: 'ALFKI',
			employeeId: 6,
			orderDate: '1997-08-24T22:00:00.000Z',
			requiredDate: '1997-09-21T22:00:00.000Z',
			shippedDate: '1997-09-01T22:00:00.000Z',
			shipViaId: 1,
			freight: '29.4600',
			name: 'Alfreds Futterkiste',
			address: 'Obere Str. 57',
			city: 'Berlin',
			region: null,
			postalCode: '12209',
			country: 'Germany',
			details: [
				{
					productId: 28,
					unitPrice: '45.6000',
					quantity: 15,
					discount: 0
				},
				{
					productId: 39,
					unitPrice: '18.0000',
					quantity: 21,
					discount: 0
				},
				{
					productId: 46,
					unitPrice: '12.0000',
					quantity: 2,
					discount: 0
				}
			]
		},
		{
			customerId: 'ALFKI',
			employeeId: 4,
			orderDate: '1997-10-02T22:00:00.000Z',
			requiredDate: '1997-10-30T23:00:00.000Z',
			shippedDate: '1997-10-12T22:00:00.000Z',
			shipViaId: 2,
			freight: '61.0200',
			name: 'Alfred-s Futterkiste',
			address: 'Obere Str. 57',
			city: 'Berlin',
			region: null,
			postalCode: '12209',
			country: 'Germany',
			details: [
				{
					productId: 63,
					unitPrice: '43.9000',
					quantity: 20,
					discount: 0
				}
			]
		},
		{
			customerId: 'ALFKI',
			employeeId: 4,
			orderDate: '1997-10-12T22:00:00.000Z',
			requiredDate: '1997-11-23T23:00:00.000Z',
			shippedDate: '1997-10-20T22:00:00.000Z',
			shipViaId: 1,
			freight: '23.9400',
			name: 'Alfred-s Futterkiste',
			address: 'Obere Str. 57',
			city: 'Berlin',
			region: null,
			postalCode: '12209',
			country: 'Germany',
			details: [
				{
					productId: 3,
					unitPrice: '10.0000',
					quantity: 6,
					discount: 0
				},
				{
					productId: 76,
					unitPrice: '18.0000',
					quantity: 15,
					discount: 0
				}
			]
		}
	]
	const result = await exec(async () => (await orm.execute(expression, orders, { stage: 'source', view: 'default' })))
}

async function stageExport (source: string) {
	const exportFile = 'data/' + source + '-export.json'
	console.log(JSON.stringify(orm.stage.export({ stage: source }).sentence(), null, 2))
	const data = await orm.stage.export({ stage: source }).execute()
	await helper.fs.write(exportFile, JSON.stringify(data))
}
async function stageImport (source: string, target: string) {
	const sourceFile = 'data/' + source + '-export.json'
	const content = await helper.fs.read(sourceFile) as string
	const data = JSON.parse(content)
	await orm.stage.import({ stage: target }).execute(data)
}

export async function apply (stages: string[], callback: any) {
	let errors = 0
	try {
		require('dotenv').config({ path: './config/northwind.env' })
		await orm.init('./config/northwind.yaml')
		await orm.stage.push({ stage: 'Source' }).execute()
		await stageExport('Source')
		for (const stage of stages) {
			await orm.stage.drop({ stage, tryAllCan: true }).execute()
			await orm.stage.push({ stage }).execute()
			await stageImport('Source', stage)
			await stageExport(stage)
		}
		errors = errors + await writeQueryTest(stages)
		errors = errors + await writeNumericTest(stages)
		errors = errors + await writeGroupByTest(stages)
		errors = errors + await writeIncludeTest(stages)
		errors = errors + await writeInsertsTest(stages)
		errors = errors + await writeUpdateTest(stages)

		// errors = errors + await writeDeleteTest(stages)
		// errors = errors + await writeBulkInsertTest(stages)

		// //operators comparative , mathematics
		// //string functions
		// //dateTime functions
		// //null functions
		// OLDS
		// await modify(orm)
		// await crud(orm)
		// await scriptsByDialect('northwind')
		// await applySchema(schemas)
		// await bulkInsert2(orm)
		await orm.end()
		console.log(`INFO: ${errors} errors`)
	} catch (error: any) {
		await orm.end()
		console.error(error)
		throw error
	}
	callback()
}
// apply(['MySQL', 'MariaDB', 'PostgreSQL', 'SqlServer'], function () { console.log('end') })
// apply(['MySQL', 'MariaDB', 'PostgreSQL','SqlServer','Oracle', 'MongoDB'], function () { console.log('end') })

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-tabs */

import { Connection, ConnectionConfig, ConnectionPool } from '..'
import { Parameter, Query, Data, MethodNotImplemented, NoSqlSentence } from '../../model'
import { MappingConfig, Helper } from '../../manager'

export class MongodbConnectionPool extends ConnectionPool {
	private static lib: any
	constructor(config: ConnectionConfig) {
		super(config)
		if (!MongodbConnectionPool.lib) {
			MongodbConnectionPool.lib = require('mongodb')
		}
	}

	public async init(): Promise<void> {
		console.log(`connection mongodb: ${this.config.name} initialized`)
	}

	public async acquire(): Promise<Connection> {
		const client = await MongodbConnectionPool.lib.MongoClient.connect(this.config.connection.url)
		const db = client.db(this.config.connection.database)
		const cnx = { client: client, db: db }
		return new MongodbConnection(cnx, this)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async release(connection: Connection): Promise<void> {
		connection.cnx.client.close()
	}

	public async end(): Promise<void> {
		console.log(`connection mongodb: ${this.config.name} finalized`)
	}
}

export class MongodbConnection extends Connection {
	private session?: any

	public async select(mapping: MappingConfig, query: Query, data: Data): Promise<any> {
		// https://medium.com/@tomas.knezek/handle-pagination-with-nodejs-and-mongodb-2910ff5e272b
		// https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/

		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		const params = this.dataToParameters(query, mapping, data)
		const aggregate: any[] = []

		const filter = sentence.filter ? this.templateToObject(sentence.filter, params) : {}
		if (sentence.map) {
			aggregate.push(this.templateToObject(sentence.map, params))
		}
		if (sentence.joins) {
			for (const i in sentence.joins) {
				aggregate.push(JSON.parse(sentence.joins[i]))
			}
		}
		if (sentence.groupBy) {
			aggregate.push(JSON.parse(sentence.groupBy))
		}
		if (sentence.having) {
			aggregate.push(JSON.parse(sentence.having))
		}
		if (sentence.sort) {
			aggregate.push(JSON.parse(sentence.sort))
		}
		if (sentence.page) {
			aggregate.push(JSON.parse(sentence.page))
		}

		const result = this.session
			? await this.cnx.db.collection(collection).find(filter, this.session).aggregate(aggregate).toArray()
			: await this.cnx.db.collection(collection).find(filter).aggregate(aggregate).toArray()
		return result
	}

	public async insert(mapping: MappingConfig, query: Query, data: Data): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		const params = this.dataToParameters(query, mapping, data)
		const obj = this.templateToObject(sentence.insert as string, params)

		const result = this.session
			? await this.cnx.db.collection(collection).insertOne(obj, this.session)
			: await this.cnx.db.collection(collection).insertOne(obj)

		return result.insertedId
	}

	public async bulkInsert(mapping: MappingConfig, query: Query, array: any[]): Promise<any[]> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		const list = this.arrayToList(query, sentence.insert as string, mapping, array)
		const result = this.session
			? await this.cnx.db.collection(collection).insertMany(list, this.session)
			: await this.cnx.db.collection(collection).insertMany(list)
		return result.insertedIds as string[]
	}

	public async update(mapping: MappingConfig, query: Query, data: Data): Promise<number> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		const params = this.dataToParameters(query, mapping, data)
		const filter = sentence.filter ? this.templateToObject(sentence.filter, params) : {}
		const obj = this.templateToObject(sentence.update as string, params)
		const result = this.session
			? await this.cnx.db.collection(collection).updateMany(filter, obj, this.session)
			: await this.cnx.db.collection(collection).updateMany(filter, obj)
		return result.modifiedCount as number
	}

	public async bulkUpdate(mapping: MappingConfig, query: Query, array: any[]): Promise<number> {
		throw new MethodNotImplemented('MongodbConnection', 'bulkUpdate')
	}

	public async delete(mapping: MappingConfig, query: Query, data: Data): Promise<number> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		const params = this.dataToParameters(query, mapping, data)
		const filter = sentence.filter ? this.templateToObject(sentence.filter, params) : {}
		const result = this.session
			? await this.cnx.db.collection(collection).deleteMany(filter, this.session)
			: await this.cnx.db.collection(collection).deleteMany(filter)
		return result.modifiedCount as number
	}

	public async bulkDelete(mapping: MappingConfig, query: Query, array: any[]): Promise<number> {
		throw new MethodNotImplemented('MongodbConnection', 'bulkDelete')
	}

	public async execute(query: Query): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'execute')
	}

	public async executeSentence(sentence: any): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'executeSentence')
	}

	public async executeDDL(query: Query): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'executeDDL')
	}

	public async beginTransaction(): Promise<void> {
		// https://www.mongodb.com/docs/drivers/node/current/fundamentals/transactions/
		// https://hevodata.com/learn/mongodb-transactions-on-nodejs/
		this.session = this.cnx.client.startSession()
		const transactionOptions = {
			readPreference: 'primary',
			readConcern: { level: 'local' },
			writeConcern: { w: 'majority' }
		}
		await this.session.startTransaction(transactionOptions)
		this.inTransaction = true
	}

	public async commit(): Promise<void> {
		await this.session.endSession()
		this.inTransaction = false
		this.session = null
	}

	public async rollback(): Promise<void> {
		await this.session.abortTransaction()
		this.inTransaction = false
		this.session = null
	}

	protected arrayToList(query: Query, template: string, mapping: MappingConfig, array: any[]): any[] {
		const list: any[] = []
		for (let i = 0; i < array.length; i++) {
			const item = array[i]
			let strObj: string | undefined
			for (let j = 0; j < query.parameters.length; j++) {
				const param = query.parameters[j]
				let value = item[param.name]
				if (value) {
					switch (param.type) {
						case 'boolean':
							value = value ? 'true' : 'false'; break
						case 'string':
							value = typeof value === 'string' ? value : value.toString()
							value = Helper.replace(value, '\n', '\\n')
							value = Helper.replace(value, '"', '\\"')
							value = `"${value}"`
							break
						case 'datetime':
							value = `"${this.writeDateTime(value, mapping)}"`
							break
						case 'date':
							value = `"${this.writeDate(value, mapping)}"`
							break
						case 'time':
							value = `"${this.writeTime(value, mapping)}"`
							break
					}
				} else {
					value = 'null'
				}
				strObj = Helper.replace(strObj || template, `{{${param.name}}}`, value)
			}
			try {
				const obj = strObj ? JSON.parse(strObj) : {}
				list.push(obj)
			} catch (error) {
				console.log(error)
			}
		}
		return list
	}

	private templateToObject(template: string, params: Parameter[]): any {
		let result: string | undefined
		const row: any = {}
		for (let i = 0; i < params.length; i++) {
			const param = params[i]
			let value = ''
			if (param.value) {
				switch (param.type) {
					case 'boolean':
						value = param.value ? 'true' : 'false'; break
					case 'string':
						value = typeof param.value === 'string' ? param.value : param.value.toString()
						value = Helper.replace(value, '\n', '\\n')
						value = Helper.replace(value, '"', '\\"')
						value = `"${value}"`
						break
					case 'datetime':
					case 'date':
					case 'time':
						// TODO: agregar formato de fecha a nivel de mapping para convertir en ese formato
						value = `"${new Date(param.value).toISOString()}"`; break
					default:
						value = param.value
				}
			} else {
				value = 'null'
			}
			result = Helper.replace(result || template, `{{${param.name}}}`, value)
		}
		return result ? JSON.parse(result) : {}
	}

	public async truncateEntity(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.codegrepper.com/code-examples/c/truncate+collection+mongodb
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).delete_many({})
	}

	public async createEntity(mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.createCollection(collection)
	}

	public async createIndex(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		if (sentence.columns) {
			const properties: any = {}
			for (const i in sentence.columns) {
				properties[sentence.columns[i]] = 1
			}
			await this.cnx.db.collection(collection).createIndex(properties, { name: sentence.name })
		}
	}

	public async addPk(mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		if (sentence.columns) {
			const properties: any = {}
			for (const i in sentence.columns) {
				properties[sentence.columns[i]] = 1
			}
			await this.cnx.db.collection(collection).createIndex(properties, { name: sentence.name, unique: true })
		}
	}

	public async addUk(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.mongodb.com/docs/drivers/node/current/fundamentals/indexes/#:~:text=By%20default%2C%20MongoDB%20creates%20a,the%20unique%20option%20to%20true%20.
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		if (sentence.columns) {
			const properties: any = {}
			for (const i in sentence.columns) {
				properties[sentence.columns[i]] = 1
			}
			await this.cnx.db.collection(collection).createIndex(properties, { name: sentence.name, unique: true })
		}
	}

	public async dropEntity(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.w3schools.com/nodejs/nodejs_mongodb_drop.asp
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).drop()
	}

	public async dropPk(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndex/
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		await this.cnx.db.collection(collection).dropIndex(sentence.name)
	}

	public async dropUk(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndex/
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		await this.cnx.db.collection(collection).dropIndex(sentence.name)
	}

	public async dropIndex(mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.mongodb.com/docs/manual/reference/method/db.collection.dropIndex/
		const collection = mapping.entityMapping(query.entity)
		const sentence = query.sentence as NoSqlSentence
		await this.cnx.db.collection(collection).dropIndex(sentence.name)
	}
}

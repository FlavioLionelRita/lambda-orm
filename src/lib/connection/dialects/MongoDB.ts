/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-tabs */

import { Connection, ConnectionConfig, ConnectionPool } from '..'
import { Parameter, Query, Data, MethodNotImplemented, SchemaError, RelationType, EntityMapping, Include } from '../../model'
import { MappingConfig, Dialect, Helper } from '../../manager'

export class MongoDBConnectionPool extends ConnectionPool {
	private static lib: any
	constructor (config: ConnectionConfig) {
		super(config)
		if (!MongoDBConnectionPool.lib) {
			MongoDBConnectionPool.lib = require('mongodb')
		}
	}

	public async init (): Promise<void> {
		console.log(`connection MongoDB: ${this.config.name} initialized`)
	}

	public async acquire (): Promise<Connection> {
		const client = await MongoDBConnectionPool.lib.MongoClient.connect(this.config.connection.url)
		const db = client.db(this.config.connection.database)
		const cnx = { client: client, db: db }
		return new MongodbConnection(cnx, this)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async release (connection: Connection): Promise<void> {
		connection.cnx.client.close()
	}

	public async end (): Promise<void> {
		// console.log(`connection MongoDB: ${this.config.name} finalized`)
	}
}

export class MongodbConnection extends Connection {
	private session?: any

	public async select (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any> {
		// https://medium.com/@tomas.knezek/handle-pagination-with-nodejs-and-MongoDB-2910ff5e272b
		// https://www.MongoDB.com/docs/manual/reference/operator/aggregation-pipeline/

		const collectionName = query.entity.includes('.') ? query.entity.split('.')[0] : query.entity
		const collection = mapping.entityMapping(collectionName)
		const params = this.dataToParameters(mapping, dialect, query, data)
		const aggregate = this.parseTemplate(mapping, dialect, query.sentence, params)

		// TODO:solve transaction
		// const result = this.session
		// 	? await this.cnx.db.collection(collection).find(filter, this.session).aggregate(aggregate).toArray()
		// 	: await this.cnx.db.collection(collection).find(filter).aggregate(aggregate).toArray()
		const result = await this.cnx.db.collection(collection).aggregate(aggregate || []).toArray()

		if (result && result.length > 0 && result[0].__distinct) {
			return result.map((p: any) => p.__distinct)
		} else {
			return result
		}
	}

	public async insert (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any> {
		const entity = mapping.getEntity(query.entity)
		if (entity === undefined) {
			throw new SchemaError(`EntityMapping not found for entity ${query.entity}`)
		}
		const list = await this.getInsertList(mapping, dialect, query, entity, [data.data])
		const obj = list[0]
		if (entity.sequence && entity.primaryKey && entity.primaryKey.length === 1) {
			const propertyPk = entity.primaryKey[0]
			const mappingPk = entity.properties.find(p => p.name === propertyPk)
			if (mappingPk) {
				obj[mappingPk.mapping] = await this.getNextSequenceValue(entity.sequence)
			}
		}

		const result = this.session
			? await this.cnx.db.collection(entity.mapping).insertOne(obj, this.session)
			: await this.cnx.db.collection(entity.mapping).insertOne(obj)

		return typeof result.insertedId === 'object' ? result.insertedId.toString() : result.insertedId
	}

	public async bulkInsert (mapping: MappingConfig, dialect: Dialect, query: Query, array: any[]): Promise<any[]> {
		const entity = mapping.getEntity(query.entity)
		if (entity === undefined) {
			throw new SchemaError(`EntityMapping ${query.entity} not found`)
		}
		const list = await this.getInsertList(mapping, dialect, query, entity, array)
		const result = this.session
			? await this.cnx.db.collection(entity.mapping).insertMany(list, this.session)
			: await this.cnx.db.collection(entity.mapping).insertMany(list)

		const ids: any[] = []
		for (const p in result.insertedIds) {
			const id = result.insertedIds[p]
			ids.push(typeof id === 'object' ? id.toString() : id)
		}
		return ids
	}

	private async getInsertList (mapping: MappingConfig, dialect: Dialect, query: Query, entity:EntityMapping, array: any[]): Promise<any[]> {
		const list = this.arrayToList(mapping, dialect, query, query.sentence, array)
		if (entity.sequence && entity.primaryKey.length === 1) {
			const propertyPk = entity.primaryKey[0]
			const mappingPk = entity.properties.find(p => p.name === propertyPk)
			if (mappingPk) {
				const first = await this.getNextSequenceValue(entity.sequence, list.length)
				for (let i = 0; i < list.length; i++) {
					list[i][mappingPk.mapping] = first + i
				}
			}
		}

		await this.getInsertListIncludes(mapping, dialect, query, array, list)
		return list
	}

	private async getInsertListIncludes (mapping: MappingConfig, dialect: Dialect, query: Query, array: any[], list:any[]):Promise<void> {
		for (const include of query.includes) {
			if (include.relation.composite) {
				const relationEntity = mapping.getEntity(include.relation.entity)
				if (relationEntity === undefined) {
					throw new SchemaError(`EntityMapping ${include.relation.entity} not found`)
				}
				await this.getInsertListInclude(mapping, dialect, query, include, relationEntity, array, list)
			}
		}
	}

	private async getInsertListInclude (mapping: MappingConfig, dialect: Dialect, query: Query, include:Include, relationEntity:EntityMapping, array: any[], list:any[]):Promise<void> {
		const relationEntityMapping = dialect.delimiter(relationEntity.mapping)
		for (let i = 0; i < array.length; i++) {
			const source = array[i]
			const target = list[i]
			const children = source[include.relation.name]
			const fromProperty = mapping.getProperty(query.entity, include.relation.from)
			if (include.relation.type === RelationType.manyToOne || (include.relation.type === RelationType.oneToOne && !fromProperty.required)) {
				// Assign parentID to child relation property
				for (const _children of children) {
					const toProperty = mapping.getProperty(include.relation.entity, include.relation.to)
					_children[toProperty.name] = target[fromProperty.mapping]
				}
			}
			if (include.relation.type === RelationType.manyToOne) {
				target[relationEntityMapping] = await this.getInsertList(mapping, dialect, include.query, relationEntity, children)
			} else {
				const result = await this.getInsertList(mapping, dialect, include.query, relationEntity, [children])
				if (result && result.length > 0) {
					target[relationEntityMapping] = result[0]
				}
			}
		}
	}

	public async update (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = JSON.parse(query.sentence)
		const params = this.dataToParameters(mapping, dialect, query, data)
		const obj = this.getObject(mapping, dialect, query, data)
		const filter = this.parseTemplate(mapping, dialect, sentence.filter, params)
		const result = this.session
			? await this.cnx.db.collection(collection).updateMany(filter, obj, this.session)
			: await this.cnx.db.collection(collection).updateMany(filter, obj)
		return result.modifiedCount as number
	}

	public async bulkUpdate (_mapping: MappingConfig, _dialect: Dialect, _query: Query, _array: any[]): Promise<number> {
		throw new MethodNotImplemented('MongodbConnection', 'bulkUpdate')
	}

	private getObject (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): any {
		const sentence = JSON.parse(query.sentence)
		const params = this.dataToParameters(mapping, dialect, query, data)
		const obj = this.parseTemplate(mapping, dialect, sentence.set, params)
		for (const include of query.includes) {
			const children = data.get(include.relation.name)
			if (!children || !include.relation.composite) {
				continue
			}
			const relationEntity = mapping.getEntity(include.relation.entity)
			if (relationEntity === undefined) {
				throw new SchemaError(`EntityMapping ${include.relation.entity} not found`)
			}
			const relationProperty = dialect.delimiter(relationEntity.mapping)
			if (include.relation.type === RelationType.manyToOne) {
				const childList: any[] = []
				for (const child of children) {
					const childData = new Data(child, data)
					const childObj = this.getObject(mapping, dialect, include.query, childData)
					childList.push(childObj)
				}
				obj[relationProperty] = childList
			} else {
				const childData = new Data(children, data)
				const childObj = this.getObject(mapping, dialect, include.query, childData)
				obj[relationProperty] = childObj
			}
		}
		return obj
	}

	public async delete (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number> {
		const collection = mapping.entityMapping(query.entity)
		const sentence = JSON.parse(query.sentence)
		const params = this.dataToParameters(mapping, dialect, query, data)
		const filter = this.parseTemplate(mapping, dialect, sentence.filter, params)
		const result = this.session
			? await this.cnx.db.collection(collection).deleteMany(filter, this.session)
			: await this.cnx.db.collection(collection).deleteMany(filter)
		return result.modifiedCount as number
	}

	public async execute (_query: Query): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'execute')
	}

	public async executeSentence (_sentence: any): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'executeSentence')
	}

	public async executeDDL (_query: Query): Promise<any> {
		throw new MethodNotImplemented('MongodbConnection', 'executeDDL')
	}

	public async beginTransaction (): Promise<void> {
		// https://www.MongoDB.com/docs/drivers/node/current/fundamentals/transactions/
		// https://hevodata.com/learn/MongoDB-transactions-on-nodejs/
		this.session = this.cnx.client.startSession()
		const transactionOptions = {
			readPreference: 'primary',
			readConcern: { level: 'local' },
			writeConcern: { w: 'majority' }
		}
		await this.session.startTransaction(transactionOptions)
		this.inTransaction = true
	}

	public async commit (): Promise<void> {
		await this.session.endSession()
		this.inTransaction = false
		this.session = null
	}

	public async rollback (): Promise<void> {
		await this.session.abortTransaction()
		this.inTransaction = false
		this.session = null
	}

	private arrayToList (mapping: MappingConfig, dialect: Dialect, query: Query, template: string, array: any[]): any[] {
		const list: any[] = []
		for (const item of array) {
			let strObj: string | undefined
			if (query.parameters && query.parameters.length > 0) {
				for (const param of query.parameters) {
					const value = this.getValue(mapping, dialect, item[param.name], param.type)
					strObj = Helper.replace(strObj || template, `{{${param.name}}}`, value)
				}
			} else {
				strObj = template
			}
			const obj = strObj ? JSON.parse(strObj) : {}
			list.push(obj)
		}
		return list
	}

	private parseTemplate (mapping: MappingConfig, dialect: Dialect, template: string, params: Parameter[]): any | undefined {
		let result: string | undefined
		const row: any = {}
		if (params.length && params.length > 0) {
			for (const param of params) {
				const value = this.getValue(mapping, dialect, param.value, param.type)
				result = Helper.replace(result || template, `{{${param.name}}}`, value)
			}
		} else {
			result = template
		}
		return result ? JSON.parse(result) : undefined
	}

	private getValue (mapping: MappingConfig, dialect: Dialect, source: any, type: string) {
		let value: any
		if (source === undefined || source === null) {
			return 'null'
		}
		switch (type) {
		case 'array':
			if (source.length === 0) {
				return ''
			}
			if (typeof source[0] === 'string') {
				return source.map((p:string) => `"${p}"`).join(',')
			} else {
				return source.join(',')
			}
		case 'boolean':
			return source ? 'true' : 'false'
		case 'string':
			value = typeof source === 'string' ? source : source.toString()
			value = Helper.replace(value, '\n', '\\n')
			value = Helper.replace(value, '"', '\\"')
			return `"${value}"`
		case 'datetime':
			return `"${this.writeDateTime(source, mapping, dialect)}"`
		case 'date':
			return `"${this.writeDate(source, mapping, dialect)}"`
		case 'time':
			return `"${this.writeTime(source, mapping, dialect)}"`
		default:
			if (typeof source === 'string') {
				value = Helper.replace(source, '\n', '\\n')
				value = Helper.replace(value, '"', '\\"')
				return `"${value}"`
			} else {
				return source
			}
		}
	}

	private async getNextSequenceValue (sequence: string, count = 1) {
		// https://www.MongoDB.com/docs/manual/reference/method/db.collection.findOneAndUpdate/#MongoDB-method-db.collection.findOneAndUpdate
		const sequenceDocument = await this.cnx.db.collection('__sequences').findOneAndUpdate(
			{ _id: sequence },
			{ $inc: { sequence_value: count } },
			{ returnNewDocument: true }
		)
		return sequenceDocument.value.sequence_value
	}

	public async truncateEntity (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).delete_many({})
	}

	public async createEntity (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.createCollection(collection)
	}

	public async createSequence (_mapping: MappingConfig, query: Query): Promise<any> {
		await this.cnx.db.collection('__sequences').insertOne(JSON.parse(query.sentence))
	}

	public async createIndex (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		const data = JSON.parse(query.sentence)
		await this.cnx.db.collection(collection).createIndex(data.properties, data.options)
	}

	public async addPk (mapping: MappingConfig, query: Query): Promise<any> {
		await this.createIndex(mapping, query)
	}

	public async addUk (mapping: MappingConfig, query: Query): Promise<any> {
		await this.createIndex(mapping, query)
	}

	public async dropSequence (_mapping: MappingConfig, query: Query): Promise<any> {
		const filter = JSON.parse(query.sentence)
		await this.cnx.db.collection('__sequences').deleteOne(filter)
	}

	public async dropEntity (mapping: MappingConfig, query: Query): Promise<any> {
		// https://www.w3schools.com/nodejs/nodejs_mongodb_drop.asp
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).drop()
	}

	public async dropPk (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).dropIndex(query.sentence)
	}

	public async dropUk (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).dropIndex(query.sentence)
	}

	public async dropIndex (mapping: MappingConfig, query: Query): Promise<any> {
		const collection = mapping.entityMapping(query.entity)
		await this.cnx.db.collection(collection).dropIndex(query.sentence)
	}
}

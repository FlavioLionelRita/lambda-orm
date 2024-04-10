/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-tabs */

import { ConnectionPoolAdapter } from './base/connectionPool'
import { ConnectionAdapter } from './base/connection'
import { ConnectionConfig } from '../../domain'
import { OrmH3lp } from '../../../shared/application'
import { Connection } from '../../application'
import { MappingConfigService, Data, EntityMapping } from 'lambdaorm-base'
import { DialectService } from '../../../language/application'
import { Query } from '../../../query/domain'

export class SQLjsConnectionPoolAdapter extends ConnectionPoolAdapter {
	private static lib: any
	private db: any
	constructor (config: ConnectionConfig, helper:OrmH3lp) {
		super(config, helper)
		if (!SQLjsConnectionPoolAdapter.lib) { SQLjsConnectionPoolAdapter.lib = require('sql.js') }
	}

	public async init (): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const me = this
		const fileBuffer = await this.helper.fs.read(me.config.connection)
		this.db = await new Promise<void>((resolve, reject) => {
			SQLjsConnectionPoolAdapter.lib.then(function (SQL: any) {
				// Load the db
				try {
					const db = new SQL.Database(fileBuffer)
					resolve(db)
				} catch (error) {
					reject(error)
				}
			})
		})
	}

	public async acquire (): Promise<Connection> {
		return new SQLjsConnectionAdapter(this.db, this, this.helper)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async release (_connection: Connection): Promise<void> {
		await this.helper.logger.log('SQLjs release pool not Implemented')
	}

	public async end (): Promise<void> {
		const data = this.db.export()
		await this.helper.fs.write(this.config.connection, data)
	}
}

export class SQLjsConnectionAdapter extends ConnectionAdapter {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public merge (mapping: MappingConfigService, dialect: DialectService, query: Query, data: Data): Promise<any> {
		throw new Error('Method not implemented.')
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public bulkMerge (mapping: MappingConfigService, dialect: DialectService, query: Query, array: any[]): Promise<any[]> {
		throw new Error('Method not implemented.')
	}

	public async select (mapping: MappingConfigService, dialect: DialectService, query: Query, data: Data): Promise<any> {
		return this._execute(mapping, dialect, query, data)
	}

	public async insert (mapping: MappingConfigService, dialect: DialectService, query: Query, data: Data): Promise<number> {
		const result = await this._execute(mapping, dialect, query, data)
		return result as number
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async bulkInsert (mapping: MappingConfigService, dialect: DialectService, query: Query, array: any[]): Promise<number[]> {
		const sql = query.sentence
		try {
			if (!array || array.length === 0) {
				return []
			}
			// https://github.com/sidorares/node-mysql2/issues/830
			const rows = this.arrayToRows(mapping, dialect, query, array)
			const result = await this.cnx.query(sql, [rows])

			// https://github.com/sidorares/node-mysql2/issues/435
			const start = result[0].insertId
			const end = result[0].insertId + (result[0].affectedRows - 1)
			const lastInsertedIds: number[] = []
			for (let i = start; i <= end; i++)lastInsertedIds.push(i)
			return lastInsertedIds
		} catch (error: any) {
			throw new Error(`sentence: ${sql} error: ${error.message}`)
		}
	}

	public async update (mapping: MappingConfigService, dialect: DialectService, query: Query, data: Data): Promise<number> {
		return this._execute(mapping, dialect, query, data)
	}

	public async delete (mapping: MappingConfigService, dialect: DialectService, query: Query, data: Data): Promise<number> {
		return this._execute(mapping, dialect, query, data)
	}

	public async execute (query: Query): Promise<any> {
		return this.cnx._query(query)
	}

	public async executeDDL (query: Query): Promise<any> {
		return this.cnx.db.run(query.sentence)
	}

	public async executeSentence (sentence: any): Promise<any> {
		return this.cnx.db.run(sentence)
	}

	public async beginTransaction (): Promise<void> {
		this.inTransaction = true
	}

	public async commit (): Promise<void> {
		this.inTransaction = false
	}

	public async rollback (): Promise<void> {
		this.inTransaction = false
	}

	protected async _execute (mapping: MappingConfigService, dialect:DialectService, query: Query, data: Data): Promise<any> {
		const sql = query.sentence
		const params = this.dataToParameters(mapping, dialect, query, data)
		const values: any[] = []
		for (const param of params) {
			values.push(param.value)
		}
		return this.cnx.db.run(sql, values)
	}

	protected async _query (mapping: MappingConfigService, dialect:DialectService, query: Query, data: Data): Promise<any[]> {
		const sql = query.sentence
		const params = this.dataToParameters(mapping, dialect, query, data)
		const values: any[] = []
		for (const param of params) {
			values.push(param.value)
		}
		const result = this.cnx.db.run(sql, values)

		const rows:any[] = []
		const cols = result.columns
		for (const value of result.values) {
			const row: any = {}
			for (let j = 0; j < cols.length; j++) {
				const col = cols[j] as string
				row[col] = value[j]
			}
			rows.push(row)
		}
		return rows
	}
}


import { Connection, ConnectionConfig, ConnectionPool } from '..'
import { Query, Data, MethodNotImplemented } from '../../model'
import { MappingConfig, Dialect, Helper } from '../../manager'

// https://node-postgres.com/features/connecting

export class PostgreSQLConnectionPool extends ConnectionPool {
	private static lib: any
	constructor (config: ConnectionConfig) {
		super(config)
		if (!PostgreSQLConnectionPool.lib) {
			const pg = require('pg')
			// Solve error number as string in queries
			// https://stackoverflow.com/questions/39168501/pg-promise-returns-integers-as-strings
			// https://www.npmjs.com/package/pg-types
			pg.types.setTypeParser(pg.types.builtins.INT2, (value: string) => {
				return parseInt(value)
			})
			pg.types.setTypeParser(pg.types.builtins.INT4, (value: string) => {
				return parseInt(value)
			})
			pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
				return parseInt(value)
			})
			pg.types.setTypeParser(pg.types.builtins.FLOAT4, (value: string) => {
				return parseFloat(value)
			})
			pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
				return parseFloat(value)
			})
			pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
				return parseFloat(value)
			})
			pg.types.setTypeParser(pg.types.builtins.MONEY, (value: string) => {
				return parseFloat(value)
			})
			PostgreSQLConnectionPool.lib = pg
		}
	}

	public async init (): Promise<void> {
		// console.info('PostgreSQL init pool not Implemented')
	}

	public async acquire (): Promise<Connection> {
		// if (this.pool === undefined) {
		// await this.init()
		// }
		const cnx = new PostgreSQLConnectionPool.lib.Client(this.config.connection)
		cnx.connect()
		return new PostgreSQLConnection(cnx, this)
	}

	public async release (connection: Connection): Promise<void> {
		await connection.cnx.end()
	}

	public async end (): Promise<void> {
		// console.info('PostgreSQL end pool not Implemented')
	}
}
export class PostgreSQLConnection extends Connection {
	public async select (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any> {
		const result = await this._execute(mapping, query, data)
		return result.rows
	}

	public async insert (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<any> {
		try {
			const result = await this._execute(mapping, query, data)
			return result.rows.length > 0 ? result.rows[0].id : null
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async bulkInsert (mapping: MappingConfig, dialect: Dialect, query: Query, array: any[]): Promise<any[]> {
		const fieldIds = mapping.getFieldIds(query.entity)
		const fieldId = fieldIds && fieldIds.length === 1 ? fieldIds[0] : null
		// const fieldId: string | undefined = autoIncrement && autoIncrement.mapping ? autoIncrement.mapping : undefined
		const sql = query.sentence
		let _query = ''
		try {
			// const rows:string[] = []
			// for (const p in array) {
			// const values = array[p]
			// const row:any[] = []
			// for (let i = 0; i < params.length; i++) {
			// const parameter = params[i]
			// let value = values[i]
			// if (value == null || value === undefined) {
			// value = 'null'
			// } else {
			// switch (parameter.type) {
			// case 'boolean':
			// value = value ? 'true' : 'false'; break
			// case 'string':
			// value = Helper.escape(value)
			// value = Helper.replace(value, '\\\'', '\\\'\'')
			// break
			// case 'datetime':
			// case 'date':
			// case 'time':
			// value = Helper.escape(value); break
			// }
			// }
			// row.push(value)
			// }
			// rows.push(`(${row.join(',')})`)
			// }
			const rows = this.arrayToRows(query, mapping, array)
			const returning = fieldId ? 'RETURNING ' + fieldId.mapping + ' AS "' + fieldId.name + '"' : ''
			_query = `${sql} ${rows.join(',')} ${returning};`
			const result = await this.cnx.query(_query)
			const ids: any[] = []
			if (fieldId) {
				for (const p in result.rows) {
					const id = result.rows[p][fieldId.name]
					ids.push(id)
				}
			}
			return ids
		} catch (error) {
			console.log(_query)
			console.error(error)
			throw error
		}
	}

	protected override arrayToRows (query: Query, mapping: MappingConfig, array: any[]): any[] {
		const rows: any[] = []
		for (let i = 0; i < array.length; i++) {
			const item = array[i]
			const row: any[] = []
			for (let j = 0; j < query.parameters.length; j++) {
				const parameter = query.parameters[j]
				let value = item[parameter.name]
				if (value == null || value === undefined) {
					value = 'null'
				} else {
					switch (parameter.type) {
					case 'boolean':
						value = value ? 'true' : 'false'; break
					case 'string':
						value = Helper.escape(value)
						value = Helper.replace(value, '\\\'', '\\\'\'')
						break
					case 'datetime':
						value = Helper.escape(this.writeDateTime(value, mapping))
						break
					case 'date':
						value = Helper.escape(this.writeDate(value, mapping))
						break
					case 'time':
						value = Helper.escape(this.writeTime(value, mapping))
						break
					}
				}
				row.push(value)
			}
			rows.push(`(${row.join(',')})`)
		}
		return rows
	}

	public async update (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number> {
		const result = await this._execute(mapping, query, data)
		return result.rowCount
	}

	public async bulkUpdate (mapping: MappingConfig, dialect: Dialect, query: Query, array: any[]): Promise<number> {
		throw new MethodNotImplemented('PostgresConnection', 'updateMany')
	}

	public async delete (mapping: MappingConfig, dialect: Dialect, query: Query, data: Data): Promise<number> {
		const result = await this._execute(mapping, query, data)
		return result.rowCount
	}

	public async bulkDelete (mapping: MappingConfig, dialect: Dialect, query: Query, array: any[]): Promise<number> {
		throw new MethodNotImplemented('PostgresConnection', 'deleteMany')
	}

	public async execute (query: Query): Promise<any> {
		return await this.cnx.query(query.sentence)
	}

	public async executeDDL (query: Query): Promise<any> {
		return await this.cnx.query(query.sentence)
	}

	public async executeSentence (sentence: any): Promise<any> {
		return await this.cnx.query(sentence)
	}

	public async beginTransaction (): Promise<void> {
		await this.cnx.query('BEGIN')
		this.inTransaction = true
	}

	public async commit (): Promise<void> {
		await this.cnx.query('COMMIT')
		this.inTransaction = false
	}

	public async rollback (): Promise<void> {
		await this.cnx.query('ROLLBACK')
		this.inTransaction = false
	}

	protected async _execute (mapping: MappingConfig, query: Query, data: Data): Promise<any> {
		const values: any[] = []
		let sql = query.sentence as string
		const params = this.dataToParameters(query, mapping, data)
		if (params) {
			for (let i = 0; i < params.length; i++) {
				const param = params[i]
				if (param.type === 'array') {
					// https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
					// https://www.it-swarm-es.com/es/node.js/node-postgres-como-ejecutar-la-consulta-where-col-lista-de-valores-dinamicos/1066948040/
					// https://www.postgresql.org/docs/9.2/functions-array.html
					// https://newbedev.com/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
					if (param.value.length > 0) {
						const type = typeof param.value[0]
						switch (type) {
						case 'string':
							if (param.value.length === 1) {
								values.push(param.value[0])
							} else {
								sql = Helper.replace(sql, '($' + (i + 1) + ')', '(SELECT(UNNEST($' + (i + 1) + '::VARCHAR[])))')
								values.push(param.value)
							}
							break
						case 'bigint':
						case 'number':
							if (param.value.length === 1) {
								values.push(param.value[0])
							} else {
								sql = Helper.replace(sql, '($' + (i + 1) + ')', '(SELECT(UNNEST($' + (i + 1) + '::INTEGER[])))')
								values.push(param.value)
							}
							break
						default:
							values.push(param.value)
						}
					} else {
						values.push([])
					}
				} else {
					values.push(param.value)
				}
			}
		}
		try {
			if (values && values.length > 0) {
				return await this.cnx.query(sql, values)
			} else {
				return await this.cnx.query(sql)
			}
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
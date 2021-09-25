/* eslint-disable linebreak-style */
import { Connection, ConnectionConfig, ConnectionPool } from './..'
import { MySqlConnection } from './mysql'

export class MariadbConnectionPool extends ConnectionPool {
	private static mariadb:any
	private pool:any
	constructor (config:ConnectionConfig) {
		super(config)
		if (!MariadbConnectionPool.mariadb) { MariadbConnectionPool.mariadb = require('mysql2/promise') }
		this.pool = MariadbConnectionPool.mariadb.createPool(config.connection)
	}

	public async acquire (): Promise<Connection> {
		const cnx = await this.pool.getConnection()
		return new MySqlConnection(cnx, this)
	}

	public async release (connection:Connection):Promise<void> {
		await connection.cnx.release()
	}

	public async end (): Promise<void> {
		this.pool.end()
	}
}

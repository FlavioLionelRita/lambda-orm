import { Dialect } from 'lambdaorm-base'
import { ConnectionFacade } from '../application'
import { ConnectionPoolService } from '../application/services/connectionPoolService'
import { DialectPoolService } from '../application/services/dialectPoolService'
import { AcquireConnection } from '../application/useCases/acquire'
import { ReleaseConnection } from '../application/useCases/release'
import { MySQLConnectionPoolAdapter } from './adapters/MySQL'
import { MariaDBConnectionPoolAdapter } from './adapters/MariaDB'
import { PostgreSQLConnectionPoolAdapter } from './adapters/PostgreSQL'
import { SQLjsConnectionPoolAdapter } from './adapters/SQLjs'
import { SqlServerConnectionPoolAdapter } from './adapters/SqlServer'
import { OracleConnectionPoolAdapter } from './adapters/Oracle'
import { MongoDBConnectionPoolAdapter } from './adapters/MongoDB'
import { OrmH3lp } from '../../shared/infrastructure'

export class ConnectionFacadeBuilder {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly helper:OrmH3lp) {}
	public build ():ConnectionFacade {
		const dialectService = new DialectPoolService(this.helper)
		const poolService = new ConnectionPoolService(dialectService)
		const acquireConnection = new AcquireConnection(poolService)
		const releaseConnection = new ReleaseConnection(poolService)
		const connectionFacade = new ConnectionFacade(dialectService, poolService, acquireConnection, releaseConnection)
			.addDialect(Dialect.MySQL, MySQLConnectionPoolAdapter)
			.addDialect(Dialect.MariaDB, MariaDBConnectionPoolAdapter)
			.addDialect(Dialect.PostgreSQL, PostgreSQLConnectionPoolAdapter)
			.addDialect(Dialect.SqlServer, SqlServerConnectionPoolAdapter)
			.addDialect(Dialect.SQLjs, SQLjsConnectionPoolAdapter)
			.addDialect(Dialect.Oracle, OracleConnectionPoolAdapter)
			.addDialect(Dialect.MongoDB, MongoDBConnectionPoolAdapter)
		return connectionFacade
	}
}

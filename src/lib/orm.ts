/* eslint-disable @typescript-eslint/ban-types */

import { ActionObserver, Dialect, IOrm, OrmOptions, Schema, Stage, MetadataParameter, MetadataConstraint, MetadataSentence, MetadataModel, Metadata, Query } from './model'
import { ExpressionManager, Transaction, StageFacade, Executor, SchemaManager, Routing, Languages } from './manager'
import { ConnectionManager, MySQLConnectionPool, MariaDBConnectionPool, SqlServerConnectionPool, PostgreSQLConnectionPool, SQLjsConnectionPool, OracleConnectionPool, MongoDBConnectionPool } from './connection'
import { SqlLanguage } from './language/SQL'
import { NoSqlLanguage } from './language/NoSQL'
import { expressions, Expressions, Cache, MemoryCache } from 'js-expressions'
import modelConfig from './expression/model.json'
import { OrmExtensionLib } from './expression/extension'

/**
 * Facade through which you can access all the functionalities of the library.
 */
export class Orm implements IOrm {
	private _cache: Cache
	private stageFacade: StageFacade
	private connectionManager: ConnectionManager
	private languages: Languages
	// private libManager: LibManager
	private expressionManager: ExpressionManager
	private routing: Routing
	private executor:Executor
	private static _instance: Orm
	private schemaManager: SchemaManager
	private _expressions: Expressions
	private observers:any={};

	/**
 * Singleton
 */
	public static get instance (): Orm {
		if (!this._instance) {
			this._instance = new Orm()
		}
		return this._instance
	}

	constructor (workspace: string = process.cwd()) {
		this._expressions = expressions
		this._expressions.config.load(modelConfig)
		this._expressions.config.addLibrary(new OrmExtensionLib())

		this.schemaManager = new SchemaManager(workspace, this._expressions)
		this._cache = new MemoryCache()
		this.connectionManager = new ConnectionManager()

		this.languages = new Languages()
		this.languages.add(new SqlLanguage(this._expressions))
		this.languages.add(new NoSqlLanguage(this._expressions))
		this.connectionManager.addType(Dialect.MySQL, MySQLConnectionPool)
		this.connectionManager.addType(Dialect.MariaDB, MariaDBConnectionPool)
		this.connectionManager.addType(Dialect.PostgreSQL, PostgreSQLConnectionPool)
		this.connectionManager.addType(Dialect.SqlServer, SqlServerConnectionPool)
		this.connectionManager.addType(Dialect.SQLjs, SQLjsConnectionPool)
		this.connectionManager.addType(Dialect.Oracle, OracleConnectionPool)
		this.connectionManager.addType(Dialect.MongoDB, MongoDBConnectionPool)

		this.routing = new Routing(this.schemaManager, this._expressions)
		this.expressionManager = new ExpressionManager(this._cache, this.schemaManager, this.languages, this._expressions, this.routing)
		this.executor = new Executor(this.connectionManager, this.languages, this.schemaManager, this.expressionManager, this._expressions)
		this.stageFacade = new StageFacade(this.schemaManager, this.routing, this.expressionManager, this.languages, this.executor)
	}

	public get defaultStage ():Stage {
		return this.schemaManager.stage.get()
	}

	/**
 * initialize the orm library
 * @param source optional parameter to specify the location of the configuration file. In the case that it is not passed, it is assumed that it is "lambdaORM.yaml" in the root of the project
 * @returns promise void
 */
	public async init (source?: string | Schema, connect = true): Promise<Schema> {
		const schema = await this.schemaManager.init(source)
		// set connections
		if (connect && schema.sources) {
			for (const p in schema.sources) {
				const dataSource = schema.sources[p]
				this.connectionManager.load(dataSource)
			}
		}
		// add enums
		if (schema.enums) {
			const enums: any = {}
			for (const i in schema.enums) {
				const _enum = schema.enums[i]
				const values:any = {}
				for (const j in _enum.values) {
					values[_enum.values[j].name] = _enum.values[j].value
				}
				enums[_enum.name] = values
			}
			expressions.config.load({ enums: enums })
		}
		return schema
	}

	/**
  * Frees the resources used, for example the connection pools
  */
	public async end (): Promise<void> {
		await this.connectionManager.end()
	}

	/**
	 * Get workspace path
	 */
	public get workspace (): string {
		return this.schemaManager.workspace
	}

	/**
	 * Get dialect of dataSource
	 * @param dataSource Name of DataSource
	 * @returns
	 */
	public dialect (dataSource:string): string {
		return this.schemaManager.dataSource.get(dataSource).dialect
	}

	/**
	* Get reference to stage manager
	*/
	public get stage (): StageFacade {
		return this.stageFacade
	}

	/**
	 * Get reference to SchemaConfig
	 */
	public get schema (): SchemaManager {
		return this.schemaManager
	}

	/**
	 * Get reference to SchemaConfig
	 */
	public get expressions (): Expressions {
		return this._expressions
	}

	/**
	* set to cache manager
	*/
	public setCache (value: Cache):void {
		this._cache = value
	}

	/**
	 * Convert a lambda expression to a query expression
	 * @param lambda lambda expression
	 * @returns Expression manager
	 */
	public toExpression (lambda: Function): string {
		return this.expressionManager.toExpression(lambda)
	}

	/**
	 * Normalize expression
	 * @param expression query expression
	 * @returns Expression normalized
	 */
	public normalize(expression:Function): string
	public normalize(expression:string): string
	public normalize (expression: string|Function): string {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		return this.expressionManager.normalize(expression)
	}

	/**
	 * Get model of expression
	 * @param expression query expression
	 * @returns Model of expression
	 */
	public model(expression:Function): MetadataModel[]
	public model(expression:string): MetadataModel[]
	public model (expression: string|Function): MetadataModel[] {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		return this.expressionManager.model(expression)
	}

	/**
	 * Get parameters of expression
	 * @param expression query expression
	 * @returns Parameters of expression
	 */
	public parameters(expression:Function): MetadataParameter[];
	public parameters(expression:string): MetadataParameter[];
	public parameters (expression: string|Function): MetadataParameter[] {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		return this.expressionManager.parameters(expression)
	}

	/**
	 * Get constraints of expression
	 * @param expression query expression
	 * @returns Constraints of expression
	 */
	public constraints(expression:Function): MetadataConstraint;
	public constraints(expression:string): MetadataConstraint;
	public constraints (expression: string|Function): MetadataConstraint {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		return this.expressionManager.constraints(expression)
	}

	/**
	 * Get metadata of expression
	 * @param expression query expression
	 * @returns metadata of expression
	 */
	public metadata(expression: Function): Metadata
	public metadata (expression:string):Metadata
	public metadata (expression: string|Function): Metadata {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		return this.expressionManager.metadata(expression)
	}

	/**
	 * Get sentence of expression
	 * @param expression query expression
	 * @param options options of execution
	 */
	public sentence(expression: Function, options?: OrmOptions): MetadataSentence;
	public sentence(expression: string, options?: OrmOptions): MetadataSentence;
	public sentence (expression: string|Function, options: OrmOptions|undefined): MetadataSentence {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		const _options = this.schemaManager.solveOptions(options)
		return this.expressionManager.sentence(expression, _options)
	}

	/**
	 * Execute expression
	 * @param expression query expression
	 * @param data Data with variables
	 * @param options options of execution
	 * @returns Result of execution
	 */
	public async execute(expression: Function, data?: any, options?: OrmOptions):Promise<any>;
	public async execute(expression: string, data?: any, options?: OrmOptions):Promise<any>;
	public async execute (expression: string|Function, data: any = {}, options: OrmOptions|undefined = undefined): Promise<any> {
		if (typeof expression !== 'string') {
			expression = this.expressionManager.toExpression(expression)
		}
		const _options = this.schemaManager.solveOptions(options)
		const query = this.expressionManager.toQuery(expression, _options)
		try {
			this.beforeExecutionNotify(query, data, _options)
			const result = await this.executor.execute(query, data, _options)
			this.afterExecutionNotify(query, data, _options, result)
			return result
		} catch (error) {
			this.errorExecutionNotify(query, data, _options, error)
			throw error
		}
	}

	/**
	 * Create a transaction
	 * @param options options of execution
	 * @param callback Code to be executed in transaction
	 */
	public async transaction (options: OrmOptions|undefined, callback: { (tr: Transaction): Promise<void> }): Promise<void> {
		const _options = this.schemaManager.solveOptions(options)
		return this.executor.transaction(_options, callback)
	}

	// Listeners and subscribers

	public subscribe (observer:ActionObserver):void {
		if (!this.observers[observer.action]) {
			this.observers[observer.action] = []
		}
		this.observers[observer.action].push(observer)
	}

	public unsubscribe (observer:ActionObserver): void {
		const observers = this.observers[observer.action]
		if (!observers) {
			return
		}
		const index = observers.indexOf(observer)
		if (index === -1) {
			throw new Error('Subject: Nonexistent observer.')
		}
		observers.splice(index, 1)
	}

	private beforeExecutionNotify (query: Query, data: any, options: OrmOptions) {
		const observers = this.observers[query.action]
		if (!observers) {
			return
		}
		observers.forEach((observer:ActionObserver) => {
			if (observer.condition === undefined) {
				observer.before(query, data, options)
			} else {
				const context = { query: query, options: options }
				if (this.expressions.eval(observer.condition, context)) {
					observer.before(query, data, options)
				}
			}
		})
	}

	private afterExecutionNotify (query: Query, data: any, options: OrmOptions, result:any) {
		const observers = this.observers[query.action]
		if (!observers) {
			return
		}
		observers.forEach((observer:ActionObserver) => {
			if (observer.condition === undefined) {
				observer.after(query, data, options, result)
			} else {
				const context = { query: query, options: options }
				if (this.expressions.eval(observer.condition, context)) {
					observer.after(query, data, options, result)
				}
			}
		})
	}

	private errorExecutionNotify (query: Query, data: any, options: OrmOptions, error:any) {
		const observers = this.observers[query.action]
		if (!observers) {
			return
		}
		observers.forEach((observer:ActionObserver) => {
			if (observer.condition === undefined) {
				observer.error(query, data, options, error)
			} else {
				const context = { query: query, options: options }
				if (this.expressions.eval(observer.condition, context)) {
					observer.error(query, data, options, error)
				}
			}
		})
	}
}

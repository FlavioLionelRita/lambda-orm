
import { Cache, IOrm, Context, Config, Query } from './model'
import { Model, ParserManager } from './parser/index'
import { Expression, MemoryCache, Transaction, LibManager } from './manager'
import { SchemaManager } from './schema/schemaManager'
import { DatabaseManager } from './database'
import { ExpressionCompleter } from './manager/expressionCompleter'
import { ConnectionManager, MySqlConnectionPool, MariadbConnectionPool, MssqlConnectionPool, PostgresConnectionPool, SqlJsConnectionPool, ConnectionConfig } from './connection'
import { LanguageManager, Operand, Sentence, Language } from './language'
import { SqlQueryBuilder, SqlSchemaBuilder } from './language/sql'
import { NoSqlQueryBuilder, NoSqlSchemaBuilder } from './language/nosql'
import { CoreLib } from './language/lib/coreLib'
import modelConfig from './parser/config.json'
import sqlConfig from './language/sql/config.json'
import nosqlConfig from './language/nosql/config.json'
import { Helper } from './helper'

/**
 * Facade through which you can access all the functionalities of the library.
 */
export class Orm implements IOrm {
	private _cache: Cache
	private languageModel: Model
	private parserManager: ParserManager
	private schemaManager: SchemaManager
	private databaseManager: DatabaseManager
	private connectionManager: ConnectionManager
	private languageManager: LanguageManager
	private libManager: LibManager
	private expressionCompleter:ExpressionCompleter
	private static _instance: Orm
	/**
	 * Property that exposes the configuration
	 */
	public config: Config

	public workspace:string
	/**
	 * Singleton
	 */
	public static get instance (): Orm {
		if (!this._instance) {
			this._instance = new Orm()
		}
		return this._instance
	}

	constructor (workspace:string = process.cwd()) {
		this.config = { app: { src: 'src', data: 'data', models: 'models' }, databases: [], schemas: [] }
		this.workspace = workspace
		this._cache = new MemoryCache()
		this.connectionManager = new ConnectionManager()
		this.libManager = new LibManager(this)

		this.languageModel = new Model()
		this.languageModel.load(modelConfig)
		this.parserManager = new ParserManager(this.languageModel)
		this.expressionCompleter = new ExpressionCompleter()

		this.schemaManager = new SchemaManager(this)
		this.databaseManager = new DatabaseManager(this)

		const sqlLanguage = new Language('sql', new SqlQueryBuilder(), new SqlSchemaBuilder())
		sqlLanguage.addLibrary({ name: 'sql', dialects: sqlConfig.dialects })

		const nosqlLanguage = new Language('nosql', new NoSqlQueryBuilder(), new NoSqlSchemaBuilder())
		nosqlLanguage.addLibrary({ name: 'nosql', dialects: nosqlConfig.dialects })

		this.languageManager = new LanguageManager(this.languageModel)
		this.language.addLibrary(new CoreLib())
		this.language.add(sqlLanguage)
		this.language.add(nosqlLanguage)

		this.connection.addType('mysql', MySqlConnectionPool)
		this.connection.addType('mariadb', MariadbConnectionPool)
		this.connection.addType('postgres', PostgresConnectionPool)
		this.connection.addType('mssql', MssqlConnectionPool)
		this.connection.addType('sqljs', SqlJsConnectionPool)
		// this.connection.addType('oracle',OracleConnectionPool)
	}

	/**
	 * metodo para incializar la libreria de orm
	 * @param source optional parameter to specify the location of the configuration file. In the case that it is not passed, it is assumed that it is "lambdaorm.yaml" in the root of the project
	 * @returns promise void
	 */
	public async init (source?: string | Config, connect = true): Promise<void> {
		if (source === undefined || typeof source === 'string') {
			this.config = await this.libManager.getConfig(source)
		} else {
			const _config = source as Config
			if (_config === undefined) {
				throw new Error(`Config: ${source} not supported`)
			}
			this.config = _config
		}
		Helper.solveEnriromentVariables(this.config)
		if (this.config.schemas) {
			for (const p in this.config.schemas) {
				this.schema.load(this.config.schemas[p])
			}
		}
		if (this.config.databases) {
			for (const p in this.config.databases) {
				const database = this.config.databases[p]
				const connectionConfig: ConnectionConfig = { name: database.name, dialect: database.dialect, connection: {} }
				connectionConfig.connection = database.connection
				if (connect) {
					this.connection.load(connectionConfig)
				}
				this.database.load(database)
			}
		}
		this.database.default = this.config.app.defaultDatabase
		await this.connection.init()
	}

	/**
	 * Frees the resources used, for example the connection pools
	 */
	public async end (): Promise<void> {
		await this.connection.end()
	}

	/**
	* Get reference to config manager
	*/
	public get lib (): LibManager {
		return this.libManager
	}

	/**
	* Get reference to parser manager
	*/
	public get parser (): ParserManager {
		return this.parserManager
	}

	/**
	* Get reference to schema manager
	*/
	public get schema (): SchemaManager {
		return this.schemaManager
	}

	/**
	* Get reference to language manager
	*/
	public get language (): LanguageManager {
		return this.languageManager
	}

	/**
	* Get reference to database manager
	*/
	public get database (): DatabaseManager {
		return this.databaseManager
	}

	/**
	* Get reference to connection manager
	*/
	public get connection (): ConnectionManager {
		return this.connectionManager
	}

	/**
	* Get reference to cache manager
	*/
	public get cache (): Cache {
		return this._cache
	}

	/**
	* set to cache manager
	*/
	public set cache (value: Cache) {
		this._cache = value
	}

	/**
	 * complete the expression. Since in some cases the expressions use simplifications, this method is in charge of returning a complete expression from a simplified expression.
	 * @param expression expression that can be simplified
	 * @param schema schema name
	 * @returns full expression
	 */
	public complete (expression: string, schema: string): string {
		try {
			const _schema = this.schemaManager.getInstance(schema)
			const node = this.parser.parse(expression)
			const completeNode = this.expressionCompleter.complete(node, _schema)
			this.parser.setParent(completeNode)
			return this.parser.toExpression(completeNode)
		} catch (error: any) {
			console.log(error)
			throw new Error('complete expression: ' + expression + ' error: ' + error.toString())
		}
	}

	/**
	 * Build expression
	 * @param expression expression to build
	 * @param schema schema name
	 * @returns Operand
	 */
	public async build (expression: string, schema: string): Promise<Operand> {
		try {
			const key = 'build_' + expression
			let operand = await this._cache.get(key)
			if (!operand) {
				const _schema = this.schemaManager.getInstance(schema)
				const node = this.parser.parse(expression)
				const completeNode = this.expressionCompleter.complete(node, _schema)
				this.parser.setParent(completeNode)
				operand = this.language.build(completeNode, _schema)
				await this._cache.set(key, operand)
			}
			return operand as Operand
		} catch (error: any) {
			console.log(error)
			throw new Error('build expression: ' + expression + ' error: ' + error.toString())
		}
	}

	/**
	 * Build expression and convert in Query
	 * @param expression expression to build
	 * @param dialect Dialect name
	 * @param schema Schema name
	 * @returns Query
	 */
	public async query (expression: string, dialect: string, schema: string): Promise<Query> {
		try {
			const key = dialect + '-query_' + expression
			let operand = await this._cache.get(key)
			if (!operand) {
				const sentence = await this.build(expression, schema) as Sentence
				operand = this.language.query(dialect, sentence)
				await this._cache.set(key, operand)
			}
			return operand as Query
		} catch (error: any) {
			throw new Error('query expression: ' + expression + ' error: ' + error.toString())
		}
	}

	/**
	 * Read expression
	 * @param expression string expression
	 * @returns Expression manager
	 */
	public expression (expression: string): Expression {
		if (!expression) {
			throw new Error('empty expression}')
		}
		return new Expression(this, expression)
	}

	/**
	 * Read lambda expression
	 * @param func lambda expression
	 * @returns Expression manager
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public lambda (func: Function): Expression {
		if (!func) {
			throw new Error('empty lambda function}')
		}
		let expression = Helper.clearLambda(func)
		const node = this.parser.parse(expression)
		let aux = node
		while (aux.type !== 'var') {
			if (aux.children.length > 0) {
				aux = aux.children[0]
			}
		}
		if (aux.name.includes('.')) {
			// Example: model_1.Products.map(p=>p) =>  Products.map(p=>p)
			aux.name = aux.name.split('.')[1]
		}
		expression = this.parser.toExpression(node)
		return new Expression(this, expression)
	}

	/**
	 * Evaluate and solve expression
	 * @param expression  string expression
	 * @param context Context with variables
	 * @param schema Schema name
	 * @returns Result of the evaluale expression
	 */
	public async eval (expression: string, context: any, schema: string): Promise<any> {
		const operand = await this.build(expression, schema)
		const _context = new Context(context)
		return this.language.eval(operand, _context)
	}

	/**
	 * Execute expression and return result
	 * @param expression string expression
	 * @param context Context with variables
	 * @param database Database name
	 * @returns result of expression
	 */
	public async execute (expression: string, context: any = {}, database?: string): Promise<any> {
		try {
			if (typeof context !== 'object') {
				throw new Error(`object type ${typeof context} is invalied`)
			}

			const db = this.database.get(database)
			const operand = await this.query(expression, db.dialect, db.schema)
			const _context = new Context(context)
			let result
			if (operand.children.length === 0) {
				const executor = this.connectionManager.createExecutor(db.name)
				result = await this.language.execute(db.dialect, operand, _context, executor)
			} else {
				const tr = this.connectionManager.createTransaction(db.name)
				try {
					await tr.begin()
					result = await this.language.execute(db.dialect, operand, _context, tr)
					await tr.commit()
				} catch (error) {
					console.log(error)
					tr.rollback()
					throw error
				}
			}
			return result
		} catch (error: any) {
			throw new Error('execute: ' + expression + ' error: ' + error.toString())
		}
	}

	/**
	 * Execute Sentence
	 * @param sentence Sentence
	 * @param database Database name
	 * @returns result of sentence
	 */
	public async executeSentence (sentence: any, database: string): Promise<any> {
		const executor = this.connectionManager.createExecutor(database)
		return await executor.execute(sentence)
	}

	/**
	 * Crea una transaccion
	 * @param database Database name
	 * @param callback Codigo que se ejecutara en transaccion
	 */
	public async transaction (database: string, callback: { (tr: Transaction): Promise<void> }): Promise<void> {
		const _database = this.database.get(database)
		const tr = this.connectionManager.createTransaction(database)
		try {
			await tr.begin()
			const transaction = new Transaction(this, _database, tr)
			await callback(transaction)
			await tr.commit()
		} catch (error) {
			console.log(error)
			tr.rollback()
			throw error
		}
	}
}

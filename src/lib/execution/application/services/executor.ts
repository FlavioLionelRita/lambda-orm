
import { Query, ExecuteResult, QueryOptions } from '../../../query/domain'
import { SchemaService } from '../../../schema/application'
import { LanguagesService } from '../../../language/application'
import { QueryExecutor } from './queryExecutor'
import { Transaction } from '../../domain'
import { IOrmExpressions } from '../../../shared/domain'
import { ConnectionFacade } from '../../../connection/application'

export class Executor {
	// eslint-disable-next-line no-useless-constructor
	constructor (private readonly connectionFacade: ConnectionFacade,
		private readonly languages: LanguagesService,
		private readonly schemaService: SchemaService,
		private readonly expressions: IOrmExpressions) {}

	public async execute (query: Query, data: any, options: QueryOptions): Promise<any> {
		let error: any
		let result: any
		if (query.includes && query.includes.length > 0) {
			await this.transaction(options, async function (tr: Transaction) {
				result = await tr.execute(query, data)
			})
		} else {
			const queryExecutor = new QueryExecutor(this.connectionFacade, this.languages, this.schemaService, this.expressions, options, false)
			try {
				result = await queryExecutor.execute(query, data)
			} catch (_error) {
				error = _error
			} finally {
				await queryExecutor.release()
			}
			if (error) {
				throw error
			}
		}
		return result
	}

	public async executeList (queries: Query[], options: QueryOptions): Promise<ExecuteResult[]> {
		const results: ExecuteResult[] = []

		if (options.tryAllCan) {
			for (const query of queries) {
				const queryExecutor = new QueryExecutor(this.connectionFacade, this.languages, this.schemaService, this.expressions, options, false)
				try {
					const result = await queryExecutor.execute(query, {})
					results.push(result)
				} catch (error: any) {
					results.push({ error })
				} finally {
					await queryExecutor.release()
				}
			}
		} else {
			await this.transaction(options, async function (tr: Transaction) {
				for (const query of queries) {
					const result = await tr.execute(query)
					results.push({ result })
				}
			})
		}
		return results
	}

	/**
 * Create a transaction
 * @param source Database name
 * @param callback Code to be executed in transaction
 */
	public async transaction (options: QueryOptions, callback: { (tr: Transaction): Promise<void> }): Promise<void> {
		const queryExecutor = new QueryExecutor(this.connectionFacade, this.languages, this.schemaService, this.expressions, options, true)
		let error: any
		try {
			const transaction = new Transaction(queryExecutor)
			await callback(transaction)
			await queryExecutor.commit()
		} catch (_error) {
			error = _error
			await queryExecutor.rollback()
		} finally {
			await queryExecutor.release()
		}
		if (error) {
			throw error
		}
	}
}

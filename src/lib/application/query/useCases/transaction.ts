/* eslint-disable @typescript-eslint/ban-types */
import { Query } from '../../../domain'
import { SentenceService } from '../../sentence'
import { QueryService, QueryExecutor } from '..'

export class Transaction {
	private sentenceService:SentenceService
	private queryService:QueryService
	private queryExecutor: QueryExecutor
	constructor (sentenceService:SentenceService, queryService: QueryService, queryExecutor: QueryExecutor) {
		this.sentenceService = sentenceService
		this.queryService = queryService
		this.queryExecutor = queryExecutor
	}

	public async execute(expression: Function, data?: any):Promise<any>;
	public async execute(expression: string, data?: any):Promise<any>;
	public async execute (expression: string|Function, data: any = {}): Promise<any> {
		if (typeof expression !== 'string') {
			expression = this.sentenceService.toExpression(expression)
		}
		const query = this.queryService.create(expression, this.queryExecutor.options, true)
		return this.queryExecutor.execute(query, data)
	}

	public async executeQuery (query: Query, data: any = {}): Promise<any> {
		return this.queryExecutor.execute(query, data)
	}
}
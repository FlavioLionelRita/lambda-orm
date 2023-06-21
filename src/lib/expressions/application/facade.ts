/* eslint-disable @typescript-eslint/ban-types */

import { SentenceFacade } from '../../sentence/application'
import { Query, QueryInfo, QueryOptions } from '../../query/domain'
import { QueryHelper } from './services/queryHelper'
import { GetInfoQuery } from './useCases/getInfo'
import { SchemaFacade } from '../../schema/application'
import { LanguagesService } from '../../language/application'
import { IQueryBuilder } from '../domain'
import { QueryBuilder } from './services/queryBuilder'
import { QueryBuilderCacheDecorator } from './services/queryBuilderCacheDecorator'
import { ExpressionExecute } from './useCases/execute'
import { ExpressionTransaction } from './useCases/transaction'
import { ICache } from 'h3lp'
import { Expressions } from '3xpr'
import { Executor } from '../../execution/domain'
import { Helper } from '../../shared/application'

export class ExpressionFacade {
	private queryHelper:QueryHelper
	private getInfoQuery:GetInfoQuery
	private builder:IQueryBuilder
	private expressionExecute:ExpressionExecute
	constructor (
		private readonly sentenceFacade: SentenceFacade,
		private readonly schemaFacade: SchemaFacade,
		private readonly languages: LanguagesService,
		executor:Executor,
		expressions: Expressions,
		cache: ICache<string, string>,
		helper:Helper) {
		this.builder = new QueryBuilderCacheDecorator(new QueryBuilder(this.sentenceFacade, this.schemaFacade, this.languages), cache, helper)
		this.getInfoQuery = new GetInfoQuery(this.builder)
		this.queryHelper = new QueryHelper(this.schemaFacade.stage, this.schemaFacade.view)
		this.expressionExecute = new ExpressionExecute(this.builder, executor, expressions)
	}

	public build (expression: string, options?: QueryOptions): Query {
		return this.builder.build(expression, this.solveOptions(options))
	}

	public getInfo (expression: string, options?: QueryOptions): QueryInfo {
		return this.getInfoQuery.getInfo(expression, this.solveOptions(options))
	}

	public solveOptions (options?: QueryOptions):QueryOptions {
		return this.queryHelper.solveOptions(options)
	}

	public async execute (expression: string, data: any = {}, options?: QueryOptions): Promise<any> {
		return this.expressionExecute.execute(expression, data, this.solveOptions(options))
	}

	// public async executeQuery (query: Query, data: any, options: QueryOptions): Promise<any> {
	// return this._executeQuery.executeQuery(query, data, options)
	// }

	public async executeList (expressions: string[], options?: QueryOptions): Promise<any> {
		return this.expressionExecute.executeList(expressions, this.solveOptions(options))
	}

	public async transaction (options: QueryOptions|undefined = undefined, callback: { (tr: ExpressionTransaction): Promise<void> }): Promise<void> {
		return this.expressionExecute.transaction(this.solveOptions(options), callback)
	}
}
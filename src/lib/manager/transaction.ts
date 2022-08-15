import { Query } from '../model'
import { QueryExecutor, ExpressionManager } from '.'

export class Transaction {
	private expressionManager:ExpressionManager
	private queryExecutor: QueryExecutor
	constructor (expressionManager: ExpressionManager, queryExecutor: QueryExecutor) {
		this.expressionManager = expressionManager
		this.queryExecutor = queryExecutor
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	public async lambda (lambda: Function, data: any): Promise<any> {
		const expression = this.expressionManager.toExpression(lambda)
		return this.expression(expression, data)
	}

	public async expression (expression:string, data:any):Promise<any> {
		const query = this.expressionManager.toQuery(expression, this.queryExecutor.options)
		return this.execute(query, data)
	}

	public async execute (query: Query, data: any = {}): Promise<any> {
		return this.queryExecutor.execute(query, data)
	}
}

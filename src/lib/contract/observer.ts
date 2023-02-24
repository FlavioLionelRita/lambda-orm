/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Query, QueryOptions, SentenceAction } from './index'

export enum ObservableAction {
	select = 'select',
	insert = 'insert',
	bulkInsert = 'bulkInsert',
	update = 'update',
	delete = 'delete',
	ddl = 'ddl'
}

export interface ActionObserverArgs{
	expression:string
	query: Query
	data: any
	options: QueryOptions
	result?:any
	error?:any
}

export abstract class ActionObserver {
	public actions:SentenceAction[]
	public condition?:string
	constructor (actions:SentenceAction[], condition?:string) {
		this.actions = actions
		this.condition = condition
	}

	public async before (args:ActionObserverArgs):Promise<void> {}
	public async after (args:ActionObserverArgs):Promise<void> {}
	public async error (args:ActionObserverArgs):Promise<void> {}
}

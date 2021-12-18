import { Query } from '../model/index'
import { Helper } from '../manager/helper'
import { DDLBuilder } from '../manager/ddlBuilder'
import { StageActionDDL } from './stageActionDDL'

export class StageSync extends StageActionDDL {
	public async queries (): Promise<Query[]> {
		const state = await this.state.get(this.stage)
		const _old = state && state.model ? state.model : null
		const delta = Helper.deltaWithSimpleArrays(this.schema.model.entities, _old?.entities)
		return new DDLBuilder(this.schema, this.routing, this.languageManager, this.stage).sync(delta)
	}

	public async execute (tryAllCan = false): Promise<any[]> {
		const queries = await this.queries()
		const result = await this.executor.executeList(this.stage, queries, tryAllCan)
		await this.state.updateModel(this.stage, this.schema.model.get())
		return result
	}
}
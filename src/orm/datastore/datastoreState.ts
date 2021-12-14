import { Mapping, MappingState } from '../model'
import { ConfigManager } from '../manager'
import { Helper } from '../helper'
const path = require('path')

export class DatastoreState {
	private config: ConfigManager
	constructor (config:ConfigManager) {
		this.config = config
	}

	public async get (name:string):Promise<MappingState> {
		const file = this.getFile(name)
		const exists = await Helper.existsPath(file)
		if (exists) {
			const content = await Helper.readFile(file)
			if (content) {
				return JSON.parse(content)
			}
		}
		return { mapping: { name: '', entities: [] }, mappingData: {}, pendingData: [] }
	}

	public async updateMapping (name:string, mapping:Mapping):Promise<void> {
		const stateFile = this.getFile(name)
		const state = await this.get(name)
		state.mapping = mapping
		await Helper.writeFile(stateFile, JSON.stringify(state))
	}

	public async updateData (name:string, mappingData:any, pendingData:any[]):Promise<void> {
		const stateFile = this.getFile(name)
		const state = await this.get(name)
		state.mappingData = mappingData
		state.pendingData = pendingData
		await Helper.writeFile(stateFile, JSON.stringify(state))
	}

	public async remove (name:string):Promise<any> {
		const file = this.getFile(name)
		await Helper.removeFile(file)
	}

	public getFile (name: string) {
		return path.join(this.config.workspace, this.config.config.app.data, `${name}-state.json`)
	}
}

import { Schema, SchemaError } from '../domain'
import path from 'path'
import { helper } from '../../shared/application/helper'
import { IFileSchemaReader } from '../application'
import { SchemaFileHelper } from './schemaFileHelper'
const yaml = require('js-yaml')

export class FileSchemaReader implements IFileSchemaReader {
	// eslint-disable-next-line no-useless-constructor
	constructor (private helper: SchemaFileHelper) {}

	public async read (source:string): Promise<Schema|null> {
		const configPath = await this.helper.getConfigPath(source)
		if (!configPath) {
			return null
		}
		const content = await this.readConfig(configPath)
		if (content === undefined || content === null) {
			throw new SchemaError(`Schema file: ${configPath} empty`)
		} else if (path.extname(configPath) === '.yaml' || path.extname(configPath) === '.yml') {
			return yaml.load(content)
		} else if (path.extname(configPath) === '.json') {
			return JSON.parse(content)
		} else {
			throw new SchemaError(`Schema file: ${configPath} not supported`)
		}
	}

	private async readConfig (path:string):Promise<string|null> {
		if (path.startsWith('http')) {
			return await helper.http.get(path)
		}
		return await helper.fs.read(path)
	}
}

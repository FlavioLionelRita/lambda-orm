import { ConfigManager, SchemaHelper } from '.'
import { Sentence, LanguageManager } from '../language'
import { DialectMetadata } from '../language/dialectMetadata'
import { Query, Database, Include, Entity } from '../model'

export abstract class LanguageDMLBuilder {
	abstract build (sentence:Sentence, schema:SchemaHelper, database:string, metadata:DialectMetadata):Query
}

export class DMLBuilder {
	private configManager: ConfigManager
	private languageManager: LanguageManager
	private schema:SchemaHelper
	public database: Database

	constructor (configManager:ConfigManager, schema:SchemaHelper, languageManager: LanguageManager, database: Database) {
		this.configManager = configManager
		this.schema = schema
		this.languageManager = languageManager
		this.database = database
	}

	private getDatabase (entity: string): Database {
		if (entity !== undefined) {
			const _entity = this.schema.getEntity(entity) as Entity
			if (_entity.database !== undefined && _entity.database !== this.database.name) {
				return this.configManager.database.get(_entity.database)
			}
		}
		return this.database
	}

	public build (sentence:Sentence):Query {
		const children = []
		const includes = sentence.getIncludes()
		const database = this.getDatabase(sentence.entity)
		const metadata = this.languageManager.dialectMetadata(database.dialect)

		for (const p in includes) {
			const sentenceInclude = includes[p]
			const query = this.build(sentenceInclude.children[0] as Sentence)
			const include = new Include(sentenceInclude.name, [query], sentenceInclude.relation)
			children.push(include)
		}
		const query = this.languageManager.dmlBuilder(database.dialect).build(sentence, this.schema, database.name, metadata)
		query.children = children
		return query
	}
}
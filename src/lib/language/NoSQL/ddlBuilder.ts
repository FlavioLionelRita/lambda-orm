/* eslint-disable @typescript-eslint/no-unused-vars */
import { Property, Relation, Index, Query, EntityMapping, PropertyMapping } from '../../model'
import { LanguageDDLBuilder } from '../../manager'

export class NoSqlDDLBuilder extends LanguageDDLBuilder {
	public truncateEntity (entity: EntityMapping): Query | undefined {
		// https://www.codegrepper.com/code-examples/c/truncate+collection+MongoDB
		return new Query({ name: 'truncateEntity', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: '', entity: entity.name })
	}

	public createEntity (entity: EntityMapping): Query | undefined {
		return new Query({ name: 'createEntity', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: '', entity: entity.name })
	}

	public createFk (_entity: EntityMapping, _relation: Relation): Query | undefined {
		return undefined
	}

	public createSequence (entity: EntityMapping): Query | undefined {
		// https://www.tutorialspoint.com/MongoDB/mongodb_autoincrement_sequence.htm
		const sentence = `{ "_id" : "${this.dialect.delimiter(entity.sequence)}", "sequence_value": 1 }`
		return new Query({ name: 'createSequence', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public createIndex (entity: EntityMapping, index: Index): Query | undefined {
		const columns: string[] = []
		for (const field of index.fields) {
			const propertyMapping = entity.properties.find(p => p.name === field) as PropertyMapping
			columns.push(this.dialect.delimiter(propertyMapping.mapping))
		}
		const properties: any = {}
		for (const i in columns) {
			properties[columns[i]] = 1
		}
		const sentence = JSON.stringify({
			properties: properties,
			options: { name: this.dialect.delimiter(entity.mapping + '_' + index.name) }
		})
		return new Query({ name: 'createIndex', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public alterProperty (_entity: EntityMapping, _property: Property): Query | undefined {
		return undefined
	}

	public addProperty (_entity: EntityMapping, _property: Property): Query | undefined {
		return undefined
	}

	public addPk (entity: EntityMapping, primaryKey: string[]): Query | undefined {
		const columns: string[] = []
		for (const primaryKeyItem of primaryKey) {
			const property = entity.properties.find(p => p.name === primaryKeyItem) as PropertyMapping
			columns.push(this.dialect.delimiter(property.mapping))
		}
		const properties: any = {}
		for (const i in columns) {
			if (columns[i] !== '_id') {
				properties[columns[i]] = 1
			}
		}
		const sentence = JSON.stringify({
			properties: properties,
			options: { name: this.dialect.delimiter(entity.mapping + '_PK'), unique: true }
		})
		return new Query({ name: 'addPk', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public addUk (entity: EntityMapping, uniqueKey: string[]): Query | undefined {
		// https://www.MongoDB.com/docs/drivers/node/current/fundamentals/indexes/#:~:text=By%20default%2C%20MongoDB%20creates%20a,the%20unique%20option%20to%20true%20.
		const columns: string[] = []
		for (const uniqueKeyItem of uniqueKey) {
			const property = entity.properties.find(p => p.name === uniqueKeyItem) as PropertyMapping
			columns.push(this.dialect.delimiter(property.mapping))
		}
		const properties: any = {}
		for (const i in columns) {
			properties[columns[i]] = 1
		}
		const sentence = JSON.stringify({
			properties: properties,
			options: { name: this.dialect.delimiter(entity.mapping + '_UK'), unique: true }
		})
		return new Query({ name: 'addUk', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public addFk (_entity: EntityMapping, _relation: Relation): Query | undefined {
		return undefined
	}

	public dropEntity (entity: EntityMapping): Query | undefined {
		return new Query({ name: 'dropEntity', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: '', entity: entity.name })
	}

	public dropProperty (_entity: EntityMapping, _property: Property): Query | undefined {
		return undefined
	}

	public dropPk (entity: EntityMapping): Query | undefined {
		// https://www.MongoDB.com/docs/manual/reference/method/db.collection.dropIndex/
		const sentence = this.dialect.delimiter(entity.mapping + '_PK')
		return new Query({ name: 'dropPk', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public dropUk (entity: EntityMapping): Query | undefined {
		// https://www.MongoDB.com/docs/manual/reference/method/db.collection.dropIndex/
		const sentence = this.dialect.delimiter(entity.mapping + '_UK')
		return new Query({ name: 'dropUk', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public setNull (_entity: EntityMapping, _relation: Relation): Query | undefined {
		return undefined
	}

	public dropFk (_entity: EntityMapping, _relation: Relation): Query | undefined {
		return undefined
	}

	public dropIndex (entity: EntityMapping, index: Index): Query | undefined {
		// https://www.MongoDB.com/docs/manual/reference/method/db.collection.dropIndex/
		const sentence = this.dialect.delimiter(entity.mapping + '_' + index.name)
		return new Query({ name: 'dropIndex', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}

	public dropSequence (entity: EntityMapping): Query | undefined {
		const sentence = JSON.stringify({
			_id: this.dialect.delimiter(entity.sequence)
		})
		return new Query({ name: 'dropSequence', dialect: this.dataSource.dialect, dataSource: this.dataSource.name, sentence: sentence, entity: entity.name })
	}
}

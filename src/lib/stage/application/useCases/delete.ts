import { Entity, SchemaError } from 'lambdaorm-base'
import { Query } from '../../../query/domain'
import { StageActionDML } from './base/actionDML'

export class StageDelete extends StageActionDML {
	public async execute (): Promise<void> {
		const queries = this.build()
		await this.executor.executeList(queries, this.options)
	}

	protected sort (entities: Entity[]): Entity[] {
		const onlyUnique = function (value:any, index:number, self:any) {
			return self.indexOf(value) === index
		}
		const _entities = entities.map(p => p.name).filter(onlyUnique)
		const sortedEntities = this.domain.sortByRelations(_entities, _entities).reverse()
		const result:Entity[] = []
		for (const sortedEntity of sortedEntities) {
			const entity = entities.find(p => p.name === sortedEntity)
			if (entity !== undefined) {
				result.push(entity)
			}
		}
		return result
	}

	protected build (): Query[] {
		const entities = this.sort(this.domain.entities)
		const queries = this.createUpdateQueries(entities)
		for (const entity of entities) {
			const query = this.createQuery(entity)
			queries.push(query)
		}
		return queries
	}

	protected createUpdateQueries (entities: Entity[]): Query[] {
		const queries:Query[] = []
		for (const entity of entities) {
			if (entity.view) {
				continue
			}
			if (entity.relations) {
				for (const relation of entity.relations) {
					const fromProperty = entity.properties?.find(p => p.name === relation.from)
					if (fromProperty === undefined) {
						throw new SchemaError(`property ${relation.from} not found in ${entity.name} `)
					}
					if (!fromProperty.required) {
						const query = this.expressionFacade.build(`${entity.name}.updateAll({${relation.from}:null})`, this.options)
						queries.push(query)
					}
				}
			}
		}
		return queries
	}

	protected createQuery (entity:Entity):Query {
		return this.expressionFacade.build(`${entity.name}.deleteAll()`, this.options)
	}
}

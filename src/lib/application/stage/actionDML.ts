import { Query, Entity, QueryOptions, IModelConfigService } from '../../domain'
import { Executor } from '../'
import { QueryManager } from '../query'
import { StageMapping } from './state'

export abstract class StageActionDML {
	protected state: StageMapping
	protected model: IModelConfigService
	protected queryManager: QueryManager
	protected executor: Executor
	protected options: QueryOptions
	protected arrowVariables = ['p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o']
	constructor (state: StageMapping, model: IModelConfigService, queryManager: QueryManager, executor: Executor, options: QueryOptions) {
		this.state = state
		this.model = model
		this.queryManager = queryManager
		this.executor = executor
		this.options = options
	}

	public async sentence (): Promise<any> {
		const sentences: any[] = []
		const queries = this.queries()
		for (const query of queries) {
			sentences.push(query.sentence)
		}
		return sentences
	}

	public queries (): Query[] {
		const queries: Query[] = []
		for (const i in this.model.entities) {
			const entity = this.model.entities[i]
			if (!this.model.isChild(entity.name)) {
				const query = this.createQuery(entity)
				queries.push(query)
			}
		}
		return queries
	}

	protected abstract createQuery(entity: Entity): Query

	protected createInclude (entity: Entity, level = 0): string {
		const arrowVariable = this.arrowVariables[level]
		const includes: string[] = []
		for (const i in entity.relations) {
			const relation = entity.relations[i]
			if (relation.composite) {
				const childEntity = this.model.getEntity(relation.entity)
				if (childEntity !== undefined) {
					const childInclude = this.createInclude(childEntity, level + 1)
					includes.push(`${arrowVariable}.${relation.name}${childInclude}`)
				}
			}
		}
		return includes.length === 0
			? ''
			: `.include(${arrowVariable}=>[${includes.join(',')}])`
	}

	protected getAllEntities (queries: Query[]): string[] {
		const entities: string[] = []
		for (const p in queries) {
			const query = queries[p]
			entities.push(query.entity)
			if (query.includes && query.includes.length > 0) {
				const include = query.includes.map(q => q.query)
				const childrenEntities = this.getAllEntities(include)
				for (const i in childrenEntities) {
					entities.push(childrenEntities[i])
				}
			}
		}
		return entities
	}
}

import { helper, SchemaManager } from '../manager'
import { Entity, SchemaError, SintaxisError } from '../contract'
import { Operand, OperandType, Position, IModelManager, IOperandNormalizer } from '3xpr'

/**
 *  Expression completer
 */
export class SentenceNormalizer implements IOperandNormalizer {
	// eslint-disable-next-line no-useless-constructor
	public constructor (protected readonly model: IModelManager, protected readonly schema: SchemaManager) {}

	public normalize (operand: Operand): Operand {
		if (operand.type === OperandType.Var && operand.children.length === 0) {
			// Example: Products => Products.map(p=>p)
			const arrowVariable = new Operand(operand.pos, 'p', OperandType.Var)
			const allFields = new Operand(operand.pos, 'p', OperandType.Var)
			const map = new Operand(operand.pos, 'map', OperandType.Arrow, [operand, arrowVariable, allFields])
			this.normalizeOperand(map)
			return map
		} else {
			this.normalizeOperand(operand)
			return operand
		}
	}

	protected normalizeOperand (operand: Operand): void {
		if (operand.type === OperandType.Arrow || operand.type === OperandType.ChildFunc || operand.type === OperandType.CallFunc) {
			const alias = this.model.functionAlias.find(p => p[0] === operand.name)
			if (alias) {
				operand.name = alias[1]
			}
			this.completeSentence(operand)
		} else if (operand.type === OperandType.Operator) {
			const alias = this.model.operatorAlias.find(p => p[0] === operand.name)
			if (alias) {
				operand.name = alias[1]
			}
		}
		for (const child of operand.children) {
			this.normalizeOperand(child)
		}
	}

	private getClauses (operand: Operand): any {
		const clauses: any = {}
		let current = operand
		while (current) {
			const name = current.type === OperandType.Var ? 'from' : current.name
			clauses[name] = current
			if (current.children.length > 0) { current = current.children[0] } else { break }
		}
		return clauses
	}

	private completeSentence (mainOperand: Operand, entityName?: string): void {
		let compeleInclude: any
		const clauses: any = this.getClauses(mainOperand)
		const entity = this.schema.model.getForcedEntity(entityName || clauses.from.name)
		if (clauses.insert) {
			compeleInclude = this.completeInsertInclude
			this.completeInsertNode(entity, clauses.insert)
		} else if (clauses.bulkInsert) {
			compeleInclude = this.completeBulkInsertInclude
			this.completeInsertNode(entity, clauses.bulkInsert)
		} else if (clauses.update) {
			compeleInclude = this.completeUpdateInclude
			this.completeFilterNode(entity, clauses, clauses.update)
			this.completeUpdateNode(entity, clauses.update)
		} else if (clauses.updateAll) {
			compeleInclude = this.completeUpdateInclude
			clauses.updateAll.name = 'update'
			// validate that it has an object defined
			// Example: Entity.update({name:'test'})
		} else if (clauses.delete) {
			compeleInclude = this.completeDeleteInclude
			this.completeFilterNode(entity, clauses, clauses.delete)
		} else if (clauses.deleteAll) {
			compeleInclude = this.completeDeleteInclude
			clauses.deleteAll.name = 'delete'
		} else if (clauses.map) {
			compeleInclude = this.completeMapInclude
			this.completeMapNode(entity, clauses.map)
		} else if (clauses.distinct) {
			compeleInclude = this.completeMapInclude
			this.completeDistinctNode(clauses, entity)
		} else if (clauses.first) {
			compeleInclude = this.completeMapInclude
			this.completeFirstNode(clauses, mainOperand, entity)
		} else if (clauses.last) {
			compeleInclude = this.completeMapInclude
			this.completeLastNode(clauses, mainOperand, entity)
		} else {
			// Solve expresión without map example: Products.filter(p=> id==1)
			compeleInclude = this.completeMapInclude
			const varArrow = new Operand(mainOperand.pos, 'p', OperandType.Var)
			const varAll = new Operand(mainOperand.pos, 'p', OperandType.Var)
			mainOperand.children[0] = new Operand(mainOperand.pos, 'map', OperandType.Arrow, [mainOperand.children[0], varArrow, varAll])
			clauses.map = mainOperand.children[0]
			this.completeMapNode(entity, clauses.map)
		}

		if (clauses.sort) {
			this.completeSortNode(clauses)
		}
		if (clauses.page && !clauses.sort) {
			this.addSortNode(clauses, mainOperand, 'asc')
		}
		if (clauses.include) {
			this.completeIncludeNode(clauses, compeleInclude, entity)
		}
	}

	private completeFilterNode (entity: Entity, clauses: any, clause:any): void {
		if (!clauses.filter) {
			this.createClauseFilter(entity, clause)
		}
	}

	private completeDistinctNode (clauses: any, entity: Entity): void {
		// Replace distinct for map and add function distinct to child of map
		clauses.map = clauses.distinct
		clauses.map.name = 'map'
		this.completeMapNode(entity, clauses.map)
		clauses.map.children[2] = new Operand(clauses.map.pos, 'distinct', OperandType.CallFunc, [clauses.map.children[2]])
	}

	private completeFirstNode (clauses: any, mainOperand: Operand, entity: Entity): void {
		// Add orderby and limit , replace first for map
		// example: SELECT * FROM Orders ORDER BY OrderId LIMIT 0,1
		clauses.map = clauses.first
		clauses.map.name = 'map'
		this.completeMapNode(entity, clauses.map)
		if (!clauses.sort) {
			this.addSortNode(clauses, mainOperand, 'asc')
		}
		if (!clauses.page) {
			const constPage = new Operand(mainOperand.pos, '1', OperandType.Const, [])
			const constRecords = new Operand(mainOperand.pos, '1', OperandType.Const, [])
			mainOperand.children[0] = new Operand(mainOperand.pos, 'page', OperandType.ChildFunc, [mainOperand.children[0], constPage, constRecords])
		}
	}

	private completeLastNode (clauses: any, mainOperand: Operand, entity: Entity): void {
		// Add orderby desc and limit, replace last for map
		// example: SELECT * FROM Orders ORDER BY OrderId DESC LIMIT 0,1
		clauses.map = clauses.last
		clauses.map.name = 'map'
		this.completeMapNode(entity, clauses.map)
		if (!clauses.sort) {
			this.addSortNode(clauses, mainOperand, 'desc')
		}
		if (!clauses.page) {
			const constPage = new Operand(mainOperand.pos, '1', OperandType.Const, [])
			const constRecords = new Operand(mainOperand.pos, '1', OperandType.Const, [])
			mainOperand.children[0] = new Operand(mainOperand.pos, 'page', OperandType.ChildFunc, [mainOperand.children[0], constPage, constRecords])
		}
	}

	private addSortNode (clauses: any, mainOperand: Operand, order: string): void {
		// if the order is not defined, order by the first field
		const firstKeyVal = clauses.map.children[2].children[0]
		const varArrow = new Operand(mainOperand.pos, 'p', OperandType.Var, [])
		const varSort = new Operand(mainOperand.pos, 'p.' + firstKeyVal.name, OperandType.Var, [])
		const funcAsc = new Operand(mainOperand.pos, order, OperandType.CallFunc, [varSort])
		mainOperand.children[0] = new Operand(mainOperand.pos, 'sort', OperandType.Arrow, [mainOperand.children[0], varArrow, funcAsc])
	}

	private completeSortNode (clauses: any): void {
		// sets ascending order in the case that it has not already been specified
		const body = clauses.sort.children[2]
		if (body.type === 'array') {
			for (let i = 0; i < body.children.length; i++) {
				if (body.children[i].type === 'var') {
					body.children[i] = new Operand(body.pos, 'asc', OperandType.CallFunc, [body.children[i]])
				}
			}
		} else if (body.type === 'var') {
			clauses.sort.children[2] = new Operand(clauses.sort.pos, 'asc', OperandType.CallFunc, [body])
		}
	}

	private completeIncludeNode (clauses: any, compeleInclude:any, entity: Entity): void {
		if (!compeleInclude) {
			throw new SchemaError('Include not implemented!!!')
		}
		const clauseInclude = clauses.include
		const arrowVar = clauseInclude.children[1].name
		const body = clauseInclude.children[2]
		if (body.type === 'array') {
			for (let i = 0; i < body.children.length; i++) {
				body.children[i] = compeleInclude.bind(this)(entity, arrowVar, body.children[i])
				if (clauses.map) {
					this.addChildFieldField(clauses.map, entity, body.children[i])
				}
			}
		} else {
			clauseInclude.children[2] = compeleInclude.bind(this)(entity, arrowVar, body)
			if (clauses.map) {
				this.addChildFieldField(clauses.map, entity, body)
			}
		}
	}

	private addChildFieldField (map: Operand, entity: Entity, include: Operand): void {
		const relation = this.getIncludeRelation(entity, include)
		const objArrowVar = map.children[1].name
		const fieldToAdd = new Operand(map.pos, objArrowVar + '.' + relation.from, OperandType.Var)
		const keyVal = new Operand(map.pos, '__' + relation.from, OperandType.KeyVal, [fieldToAdd])
		map.children[2].children.push(keyVal)
	}

	private completeMapNode (entity: Entity, operand: Operand): void {
		if (operand.children && operand.children.length === 3) {
			const arrowVar = operand.children[1].name
			const fields = operand.children[2]
			if (fields.children.length === 0 && fields.name === arrowVar) {
				// Example: Entity.map(p=> p) to  Entity.map(p=> {field1:p.field1,field2:p.field2,field3:p.field3,...})
				operand.children[2] = this.createReadNodeFields(operand.pos, entity, arrowVar)
			} else if (fields.type === OperandType.Var) {
				// Example: Entity.map(p=> p.name) to  Entity.map(p=> {name:p.name})
				const keyVal = this.fieldToKeyVal(arrowVar, fields)
				operand.children[2] = new Operand(operand.pos, 'obj', OperandType.Obj, [keyVal])
			} else if (fields.type === OperandType.List) {
				// Example: Entity.map(p=> [p.id, p.name]) to  Entity.map(p=> {id:p.id,name:p.name})
				const obj = new Operand(operand.pos, 'obj', OperandType.Obj, [])
				for (const child of fields.children) {
					const keyVal = this.fieldToKeyVal(arrowVar, child)
					obj.children.push(keyVal)
				}
				operand.children[2] = obj
			}
		} else {
			const varArrow = new Operand(operand.pos, 'p', OperandType.Var, [])
			const fields = this.createReadNodeFields(operand.pos, entity, 'p')
			operand.children.push(varArrow)
			operand.children.push(fields)
		}
	}

	private fieldToKeyVal (arrowVar: string, field: Operand): Operand {
		let key: string
		if (field.name.startsWith(arrowVar + '.')) {
			key = field.name.replace(arrowVar + '.', '')
			if (key.includes('.')) {
				key = helper.str.replace(key, '.', '_')
			}
		} else {
			key = field.name
		}
		return new Operand(field.pos, key, OperandType.KeyVal, [field])
	}

	private completeInsertNode (entity: Entity, operand: Operand): void {
		if (operand.children.length === 1) {
			// example: Entity.insert()
			const fields = this.createWriteNodeFields(operand.pos, entity, undefined, false, true)
			operand.children.push(fields)
		} else if (operand.children.length === 2 && operand.children[1].type === OperandType.Var) {
			// example: Entity.insert(entity)
			operand.children[1] = this.createWriteNodeFields(operand.pos, entity, operand.children[1].name, false, true)
		}
	}

	private completeUpdateNode (entity: Entity, operand: Operand): void {
		if (operand.children.length === 1) {
			// Example: Entity.update()
			// In the case that the mapping is not defined, it assumes that the data will be the entity to update
			const fields = this.createWriteNodeFields(operand.pos, entity, undefined, false, true)
			operand.children.push(fields)
		} else if (operand.children.length === 2 && operand.children[1].type === OperandType.Var) {
			// Example: Entity.update(entity)
			// In the case that a mapping was not defined but a variable is passed, it is assumed that this variable will be the entity to update
			operand.children[1] = this.createWriteNodeFields(operand.pos, entity, operand.children[1].name, true)
		} else if (operand.children.length === 3 && operand.type === OperandType.Arrow && operand.children[1].name === operand.children[2].name) {
			// Example: Entity.update({ name: entity.name }).include(p => p.details.update(p => p))
			operand.children[2] = this.createWriteNodeFields(operand.pos, entity, operand.children[1].name, true)
		}
	}

	private createReadNodeFields (pos:Position, entity: Entity, parent?: string): Operand {
		const obj = new Operand(pos, 'obj', OperandType.Obj, [])
		for (const i in entity.properties) {
			const property = entity.properties[i]
			const field = new Operand(pos, parent ? parent + '.' + property.name : property.name, OperandType.Var, [])
			const keyVal = new Operand(pos, property.name, OperandType.KeyVal, [field])
			obj.children.push(keyVal)
		}
		return obj
	}

	private createWriteNodeFields (pos:Position, entity: Entity, parent?: string, excludePrimaryKey = false, excludeAutoIncrement = false): Operand {
		const obj = new Operand(pos, 'obj', OperandType.Obj, [])
		for (const i in entity.properties) {
			const property = entity.properties[i]
			if ((!property.autoIncrement || !excludeAutoIncrement) && ((entity.primaryKey !== undefined && !entity.primaryKey.includes(property.name)) || !excludePrimaryKey)) {
				const field = new Operand(pos, parent ? parent + '.' + property.name : property.name, OperandType.Var, [])
				const keyVal = new Operand(pos, property.name, OperandType.KeyVal, [field])
				obj.children.push(keyVal)
			}
		}
		return obj
	}

	private createClauseFilter (entity: Entity, operand: Operand): void {
		if (operand.children.length === 1 || operand.children.length === 3) {
			// Example operand.children.length === 1: Entity.delete()
			// Example operand.children.length === 3:
			// Entity.update({name:entity.name}).include(p=> p.details.update(p=> ({unitPrice:p.unitPrice,productId:p.productId })))
			// Aplica al update del include, en el caso del ejemplo seria a: p.details.update(p=> ({unitPrice:p.unitPrice,productId:p.productId })
			const condition = this.createFilter(operand.pos, entity, 'p')
			const arrowVar = new Operand(operand.pos, 'p', OperandType.Var, [])
			operand.children[0] = new Operand(operand.pos, 'filter', OperandType.Arrow, [operand.children[0], arrowVar, condition])
		} else if (operand.children.length === 2 && (operand.children[1].type === OperandType.Var || operand.children[1].type === OperandType.Obj)) {
			// Example operand.children[1].type === OperandType.Var: Entity.update(entity) ,Entity.delete(entity)
			// Example operand.children[1].type === 'obj': Entity.update({unitPrice:unitPrice,productId:productId})
			// const condition = this.createFilter(entity, 'p', operand.children[1].name)
			const parentVariable = operand.children[1].type === OperandType.Var ? operand.children[1].name : undefined
			const condition = this.createFilter(operand.pos, entity, 'p', parentVariable)
			const arrowVar = new Operand(operand.pos, 'p', OperandType.Var, [])
			operand.children[0] = new Operand(operand.pos, 'filter', OperandType.Arrow, [operand.children[0], arrowVar, condition])
		}
	}

	private createFilter (pos:Position, entity: Entity, parent?: string, parentVariable?: string): Operand {
		if (entity.primaryKey === undefined || entity.primaryKey.length === 0) {
			throw new SchemaError(`Entity ${entity.name} cannot be create filter because the primary key is empty`)
		}
		let condition
		for (const name of entity.primaryKey) {
			const field = entity.properties.find(p => p.name === name)
			if (field === undefined) {
				throw new SchemaError(`Entity ${entity.name} not found property ${name} defined in primary key`)
			}
			const fieldOperand = new Operand(pos, parent ? parent + '.' + field.name : field.name, OperandType.Var)
			const variableOperand = new Operand(pos, parentVariable ? parentVariable + '.' + name : name, OperandType.Var)
			const equal = new Operand(pos, '==', OperandType.Operator, [fieldOperand, variableOperand])
			condition = condition ? new Operand(pos, '&&', OperandType.Operator, [condition, equal]) : equal
		}
		return condition
	}

	private completeMapInclude (entity: Entity, arrowVar: string, operand: Operand): Operand {
		return this.completeSelectInclude(entity, arrowVar, operand, 'map')
	}

	private completeSelectInclude (entity: Entity, _arrowVar: string, operand: Operand, clause: string): Operand {
		let map: Operand, relation: any
		if (operand.type === OperandType.Arrow) {
			// resuelve el siguiente caso  .includes(details.map(p=>p))
			let current = operand
			while (current) {
				if (current.type === OperandType.Var) {
					// p.details
					const parts = current.name.split('.')
					const relationName = parts[1]
					relation = entity.relations.find(p => p.name === relationName)
					break
				}
				if (current.children.length > 0) { current = current.children[0] } else { break }
			}
			map = operand// new Node(clause,'childFunc',[operand])
			this.completeSentence(map, relation.entity)
		} else if (operand.type === OperandType.Var) {
			// resuelve el caso que solo esta la variable que representa la relación , ejemplo: .include(p=> p.details)
			// entones agregar map(p=>p) a la variable convirtiéndolo en .include(p=> p.details.map(p=>p))
			const varArrowNode = new Operand(operand.pos, 'p', OperandType.Var, [])
			const varAll = new Operand(operand.pos, 'p', OperandType.Var, [])
			const parts = operand.name.split('.')
			const relationName = parts[1]
			relation = entity.relations.find(p => p.name === relationName)
			map = new Operand(operand.pos, clause, OperandType.Arrow, [operand, varArrowNode, varAll])
			this.completeSentence(map, relation.entity)
		} else {
			throw new SintaxisError('Error to add include operand ' + operand.type + ':' + operand.name)
		}
		// add filter with parent
		const clauses: any = this.getClauses(map)
		const childFilter = clauses.filter
		const arrowFilterVar = childFilter ? childFilter.children[1].name : 'p'
		const fieldRelation = new Operand(operand.pos, arrowFilterVar + '.' + relation.to, OperandType.Var) // new SqlField(relation.entity,relation.to,toField.type,child.alias + '.' + toField.mapping)
		const varRelation = new Operand(operand.pos, 'LambdaOrmParentId', OperandType.Var)
		const filterInclude = new Operand(operand.pos, 'in', OperandType.CallFunc, [varRelation, fieldRelation])
		if (!childFilter) {
			const varFilterArrowNode = new Operand(operand.pos, arrowFilterVar, OperandType.Var, [])
			map.children[0] = new Operand(operand.pos, 'filter', OperandType.Arrow, [map.children[0], varFilterArrowNode, filterInclude])
		} else {
			childFilter.children[0] = new Operand(operand.pos, '&&', OperandType.Operator, [childFilter.children[0], filterInclude])
		}
		// If the column for which the include is to be resolved is not in the select, it must be added
		const arrowSelect = clauses.map.children[1].name
		const field = new Operand(operand.pos, arrowSelect + '.' + relation.to, OperandType.Var)
		clauses.map.children[2].children.push(new Operand(operand.pos, 'LambdaOrmParentId', OperandType.KeyVal, [field]))
		return map
	}

	private completeBulkInsertInclude (entity: Entity, arrowVar: string, operand: Operand): Operand {
		return this.completeInclude(entity, arrowVar, operand, 'bulkInsert')
	}

	private completeInsertInclude (entity: Entity, arrowVar: string, operand: Operand): Operand {
		return this.completeInclude(entity, arrowVar, operand, 'insert')
	}

	private completeUpdateInclude (entity: Entity, arrowVar: string, operand: Operand): Operand {
		return this.completeInclude(entity, arrowVar, operand, 'update')
	}

	private completeDeleteInclude (entity: Entity, arrowVar: string, operand: Operand): Operand {
		return this.completeInclude(entity, arrowVar, operand, 'delete')
	}

	private getIncludeRelation (entity: Entity, operand: Operand): any {
		if (operand.type === OperandType.Arrow) {
			// resuelve el siguiente caso  .includes(details.insert())
			let current = operand
			while (current) {
				if (current.type === OperandType.Var) {
					// p.details
					const parts = current.name.split('.')
					const relationName = parts[1]
					return entity.relations.find(p => p.name === relationName)
				}
				if (current.children.length > 0) { current = current.children[0] } else { break }
			}
		} else if (operand.type === OperandType.Var) {
			// resuelve el caso que solo esta la variable que representa la relación , ejemplo: .include(p=> p.details)
			// entones agregar map(p=>p) a la variable convirtiéndolo en Details.insert()
			const parts = operand.name.split('.')
			const relationName = parts[1]
			return entity.relations.find(p => p.name === relationName)
		} else {
			throw new SchemaError('not found relation in include operand ' + operand.type + ':' + operand.name)
		}
	}

	private completeInclude (entity: Entity, _arrowVar: string, operand: Operand, clause: string): Operand {
		if (operand.type === OperandType.Arrow) {
			// resuelve el siguiente caso  .includes(details.insert())
			const relation = this.getIncludeRelation(entity, operand)
			const clauses: any = this.getClauses(operand)
			const clauseNode = clauses[clause] ? clauses[clause] : new Operand(operand.pos, clause, OperandType.CallFunc, [operand])
			this.completeSentence(clauseNode, relation.entity)
			return clauseNode
		} else if (operand.type === OperandType.Var) {
			// resuelve el caso que solo esta la variable que representa la relación , ejemplo: .include(p=> p.details)
			// entones agregar map(p=>p) a la variable convirtiéndolo en Details.insert()
			const relation = this.getIncludeRelation(entity, operand)
			if (!relation) {
				throw new SchemaError(`Relation ${operand.name} not found in ${entity.name}`)
			}
			const clauseNode = new Operand(operand.pos, clause, OperandType.CallFunc, [operand])
			this.completeSentence(clauseNode, relation.entity)
			return clauseNode
		} else {
			throw new SchemaError('Error to add include operand ' + operand.type + ':' + operand.name)
		}
	}
}
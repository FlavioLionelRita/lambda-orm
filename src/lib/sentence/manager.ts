
import { MetadataParameter, MetadataConstraint, MetadataModel, Metadata, source, Sentence, SentenceInfo, ObservableAction } from '../contract'
import { SchemaManager, Routing, ViewConfig, helper } from '../manager'
import { IExpressions, Type, OperandType } from '3xpr'
import { MemoryCache, ICache } from 'h3lp'
import { SentenceCompleter, SentenceBuilder } from '.'

// class SentenceSerializer {
// public serialize (sentence: Sentence): string {
// return JSON.stringify(this._serialize(sentence))
// }

// public deserialize (value: string): Sentence {
// return (this._deserialize(JSON.parse(value))) as Sentence
// }

// private _serialize (operand: Operand): Metadata {
// const children:Metadata[] = []
// for (const child of operand.children) {
// children.push(this._serialize(child))
// }
// if (operand instanceof Sentence) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, columns: operand.columns, parameters: operand.parameters, entity: operand.entity, constraints: operand.constraints }
// } else if (operand instanceof SentenceInclude) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, relation: operand.relation }
// } else if (operand instanceof Insert) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, clause: operand.clause }
// } else if (operand instanceof Update) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, alias: operand.alias }
// } else if (operand instanceof Delete) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, alias: operand.alias }
// } else if (operand instanceof KeyValue) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, property: operand.property }
// } else if (operand instanceof Field) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, entity: operand.entity, alias: operand.alias, isRoot: operand.isRoot }
// } else if (operand instanceof From) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, alias: operand.alias }
// } else if (operand instanceof Join) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, entity: operand.entity, alias: operand.alias }
// } else if (operand instanceof Variable) {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type, number: operand.number }
// } else {
// return { name: operand.name, classtype: operand.constructor.name, children, type: operand.type }
// }
// }

// private _deserialize (value: Metadata): Operand {
// const children:Operand[] = []
// if (value.children) {
// for (const k in value.children) {
// children.push(this._deserialize(value.children[k]))
// }
// }
// switch (value.classtype) {
// case 'Sentence':
// // eslint-disable-next-line no-case-declarations
// const sentence = new Sentence(
// value.name,
// children,
// value.entity as string,
// value.alias as string,
// value.columns || []
// )
// sentence.parameters = value.parameters || []
// sentence.constraints = value.constraints || []
// sentence.values = value.values || []
// sentence.defaults = value.defaults || []
// return sentence
// case 'SentenceInclude':
// return new SentenceInclude(value.name, children, value.relation as Relation)
// case 'Delete':
// return new Delete(value.name, children, value.alias || '')
// case 'Update':
// return new Update(value.name, children, value.alias || '')
// case 'Insert':
// return new Insert(value.name, children, value.clause as string)
// case 'Page':
// return new Page(value.name, children, value.alias)
// case 'Sort':
// return new Sort(value.name, children, value.alias)
// case 'Having':
// return new Having(value.name, children, value.alias)
// case 'GroupBy':
// return new GroupBy(value.name, children, value.alias)
// case 'Filter':
// return new Filter(value.name, children, value.alias)
// case 'Map':
// return new Map(value.name, children, value.alias)
// case 'Join':
// return new Join(value.name, children, value.entity || '', value.alias || '')
// case 'From':
// return new From(value.name, value.alias || '')
// case 'Field':
// return new Field(value.entity as string, value.name, value.type as string, value.alias, value.isRoot)
// case 'Constant2':
// return new Constant2(value.name)
// case 'ArrowFunction':
// return new ArrowFunction(value.name, children)
// case 'ChildFunction':
// return new ChildFunction(value.name, children)
// case 'FunctionRef':
// return new FunctionRef(value.name, children)
// case 'Operator':
// return new Operator(value.name, children)
// case 'List':
// return new List(value.name, children)
// case 'Obj':
// return new Obj(value.name, children)
// case 'KeyValue':
// // eslint-disable-next-line no-case-declarations
// const keyValue = new KeyValue(value.name, children, value.type)
// keyValue.property = value.property
// return keyValue
// case 'Property':
// return new exp.Property(value.name, children, value.type)
// case 'Block':
// return new exp.Block(value.name, children, value.type)
// case 'If':
// return new exp.If(value.name, children, value.type)
// case 'ElseIf':
// return new exp.ElseIf(value.name, children, value.type)
// case 'Else':
// return new exp.Else(value.name, children, value.type)
// case 'While':
// return new exp.While(value.name, children, value.type)
// case 'For':
// return new exp.For(value.name, children, value.type)
// case 'ForIn':
// return new exp.ForIn(value.name, children, value.type)
// case 'Switch':
// return new exp.Switch(value.name, children, value.type)
// case 'Break':
// return new exp.Break(value.name, children, value.type)
// case 'Continue':
// return new exp.Continue(value.name, children, value.type)
// case 'Function':
// return new exp.Function(value.name, children, value.type)
// case 'Return':
// return new exp.Return(value.name, children, value.type)
// case 'Try':
// return new exp.Try(value.name, children, value.type)
// case 'Catch':
// return new exp.Catch(value.name, children, value.type)
// case 'Throw':
// return new exp.Throw(value.name, children, value.type)
// case 'Case':string
// return new exp.Case(value.name, children, value.type)
// case 'Default':
// return new exp.Default(value.name, children, value.type)
// case 'Template':
// return new exp.Template(value.name, value.type)
// case 'Constant':
// return new Constant(value.name)
// case 'Variable':
// // eslint-disable-next-line no-case-declarations
// const variable = new Variable(value.name, value.type)
// variable.number = value.number
// return variable
// default:
// throw new SintaxisError(`Deserialize ${value.type} not implemented`)
// }
// }
// }

export class SentenceManager {
	// private serializer: SentenceSerializer
	private builder: SentenceBuilder
	private schema: SchemaManager
	private routing: Routing
	private completer: SentenceCompleter
	private cache: ICache<string, Sentence>
	private expressions: IExpressions

	constructor (schema: SchemaManager, expressions: IExpressions, routing: Routing) {
		this.schema = schema
		this.routing = routing
		// this.serializer = new SentenceSerializer()
		this.expressions = expressions
		this.builder = new SentenceBuilder(schema, expressions)
		this.completer = new SentenceCompleter(expressions)
		this.cache = new MemoryCache<string, Sentence>()
	}

	public normalize (expression: string): string {
		return this.builder.normalize(expression)
	}

	/**
	 * Get model of expression
	 * @param expression expression
	 * @returns Model of expression
	 */
	public model (expression: string): MetadataModel[] {
		const sentence = this.getSentence(expression)
		return this.modelFromSentence(sentence)
	}

	/**
	 * Get constraints of expression
	 * @param expression expression
	 * @returns constraints
	 */
	public constraints (expression: string): MetadataConstraint {
		const sentence = this.getSentence(expression)
		return this.constraintsFromSentence(sentence)
	}

	/**
	 * Get parameters of expression
	 * @param expression  expression
	 * @returns Parameters of expression
	 */
	public parameters (expression: string): MetadataParameter[] {
		const sentence = this.getSentence(expression)
		return this.parametersFromSentence(sentence)
	}

	/**
	 * Get metadata of expression
	 * @param expression expression
	 * @returns metadata of expression
	 */
	public metadata (expression: string): Metadata {
		const sentence = this.getSentence(expression)
		return this.metadataFromSentence(sentence)
	}

	public create (expression: string, view: ViewConfig, stage:string): Sentence {
		const expressionKey = helper.utils.hashCode(expression)
		const key = `${expressionKey}-${stage}-${view.name}`
		const value = this.cache.get(key)
		if (value) {
			return value
		}
		const sentence = this.getSentence(expression)
		// TODO: se debería clonar sentence antes de modificarla ( al invocar complete )
		this.complete(sentence, view, stage)
		this.cache.set(key, sentence)
		return sentence
	}

	public getDataSource (sentence: Sentence, stage: string): source {
		const sentenceInfo: SentenceInfo = { entity: sentence.entity, action: ObservableAction[sentence.action] }
		const dataSourceName = this.routing.getDataSource(sentenceInfo, stage)
		return this.schema.source.get(dataSourceName)
	}

	public getSentence (expression: string): Sentence {
		const sentence = this.builder.build(expression)
		return sentence
		// TODO: se debe clonar para poder usar el cache.
		// const key = helper.utils.hashCode(expression)
		// const value = this.cache.get(key.toString())
		// if (value) {
		// return value
		// }
		// const sentence = this.builder.build(expression)
		// this.cache.set(key.toString(), sentence)
		// return sentence
	}

	private metadataFromSentence (sentence: Sentence): Metadata {
		const children: Metadata[] = []
		for (const sentenceInclude of sentence.getIncludes()) {
			const child = this.metadataFromSentence(sentenceInclude.children[0] as Sentence)
			children.push(child)
		}
		return {
			classtype: sentence.constructor.name,
			name: sentence.name,
			children,
			type: Type.toString(sentence.returnType),
			entity: sentence.entity,
			columns: sentence.columns,
			// property: sentence.p
			parameters: sentence.parameters,
			constraints: sentence.constraints,
			values: sentence.values,
			defaults: sentence.defaults,
			// relation: sentence.rel,
			clause: sentence.action,
			alias: sentence.alias,
			// isRoot: sentence.
			number: sentence.number
		}
	}

	private complete (sentence: Sentence, view: ViewConfig, stage: string) {
		const sentenceIncludes = sentence.getIncludes()
		for (const p in sentenceIncludes) {
			const sentenceInclude = sentenceIncludes[p]
			this.complete(sentenceInclude.children[0] as Sentence, view, stage)
		}
		const source = this.getDataSource(sentence, stage)
		const mapping = this.schema.mapping.getInstance(source.mapping)
		this.completer.complete(mapping, view, sentence)
	}

	private modelFromSentence (sentence: Sentence): MetadataModel[] {
		const result: MetadataModel[] = []
		for (const column of sentence.columns) {
			if (!column.name.startsWith('__')) {
				result.push({ name: column.name, type: column.type })
			}
		}
		const includes = sentence.getIncludes()
		for (const p in includes) {
			const include = includes[p]
			const childType = include.relation.entity + (include.relation.type === 'manyToOne' ? '[]' : '')
			const child: MetadataModel = { name: include.relation.name, type: childType, children: [] }
			child.children = this.modelFromSentence(include.children[0] as Sentence)
			result.push(child)
		}
		return result
	}

	private parametersFromSentence (sentence: Sentence): MetadataParameter[] {
		const parameters: MetadataParameter[] = []
		for (const parameter of sentence.parameters) {
			parameters.push({ name: parameter.name, type: parameter.type ? parameter.type : 'any' })
		}
		const includes = sentence.getIncludes()
		for (const p in includes) {
			const include = includes[p]
			const relationParameter: MetadataParameter = {
				name: include.relation.name,
				type: include.relation.entity,
				children: []
			}
			const children = this.parametersFromSentence(include.children[0] as Sentence)
			for (const q in children) {
				const child = children[q]
				relationParameter.children?.push(child)
			}
			parameters.push(relationParameter)
		}
		return parameters
	}

	private constraintsFromSentence (sentence: Sentence): MetadataConstraint {
		const result: MetadataConstraint = { entity: sentence.entity, constraints: sentence.constraints }
		const includes = sentence.getIncludes()
		for (const p in includes) {
			const include = includes[p]
			const child = this.constraintsFromSentence(include.children[0] as Sentence)
			if (!result.children) {
				result.children = []
			}
			result.children.push(child)
		}
		return result
	}

	/**
	 * Convert a lambda expression to a query expression
	 * @param lambda lambda expression
	 * @returns Expression manager
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	public toExpression (func: Function): string {
		if (!func) {
			throw new Error('empty lambda function}')
		}
		const expression = helper.sentence.clearLambda(func)
		const operand = this.expressions.build(expression)
		let aux = operand
		while (aux.type !== OperandType.Var) {
			if (aux.children.length > 0) {
				aux = aux.children[0]
			}
		}
		if (aux.name.includes('.')) {
			// Example: __model_1.Products.map(p=>p) =>  Products.map(p=>p)
			// Example: __model_1.Orders.details.map(p=>p) =>  Orders.details.map(p=>p)
			const names:string[] = aux.name.split('.')
			if (names[0].startsWith('__')) {
				aux.name = names.slice(1).join('.')
			}
		}
		return helper.operand.toExpression(operand)
	}

	// private serialize (sentence: Sentence): string {
	// return this.serializer.serialize(sentence)
	// }
	// private deserialize (value: string): Sentence {
	// return this.serializer.deserialize(value)
	// }
}

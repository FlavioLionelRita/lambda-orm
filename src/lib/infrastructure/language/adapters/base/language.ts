import { IExpressions } from '3xpr'
import { NotImplemented, Source, Query, Sentence } from '../../../../domain'
import { DialectService, LanguagePort, LanguageDDLBuilder, MappingConfigService } from '../../../../application'

export abstract class LanguageAdapter implements LanguagePort {
	public dialects: DialectService[]
	public name: string
	public solveComposite?: boolean
	protected expressions: IExpressions

	constructor (name: string, dialects: any, expressions: IExpressions) {
		this.name = name
		this.expressions = expressions

		this.dialects = []
		for (const p in dialects) {
			const data = dialects[p]
			const dialect = new DialectService(p, data)
			this.dialects.push(dialect)
		}
	}

	public getDialect (name: string): DialectService {
		const dialect = this.dialects.find(p => p.name === name)
		if (!dialect) {
			throw new NotImplemented(`Dialect ${name} not implemented`)
		}
		return dialect
	}

	public abstract ddlBuilder(source: Source, mapping: MappingConfigService): LanguageDDLBuilder

	public abstract dmlBuild(source: Source, mapping: MappingConfigService, sentence: Sentence): Query
}
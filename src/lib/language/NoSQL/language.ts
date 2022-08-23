import { LanguageDDLBuilder, MappingConfig } from '../../manager'
import { source, Sentence, Query } from '../../model'
import { Language } from '../../manager/language'
import { NoSqlDMLBuilder } from './dmlBuilder'
import { NoSqlDDLBuilder } from './ddlBuilder'
import config from './config.json'
import { Expressions } from 'js-expressions'

export class NoSqlLanguage extends Language {
	constructor (expressions: Expressions) {
		super('NoSQL', config.dialects, expressions)
		this.solveComposite = true
	}

	public ddlBuilder (source: source, mapping: MappingConfig): LanguageDDLBuilder {
		return new NoSqlDDLBuilder(source, mapping, this.getDialect(source.dialect))
	}

	public dmlBuild (source: source, mapping: MappingConfig, sentence: Sentence): Query {
		return new NoSqlDMLBuilder(source, mapping, this.getDialect(source.dialect), this.expressions).build(sentence)
	}
}

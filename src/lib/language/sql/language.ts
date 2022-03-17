import { LanguageDMLBuilder, LanguageDDLBuilder, MappingConfig } from '../../manager'
import { Language } from '../language'
import { SqlDMLBuilder } from './dmlBuilder'
import { SqlDDLBuilder } from './ddlBuilder'
import sqlConfig from './config.json'
import { Expressions } from 'js-expressions'

export class SqlLanguage extends Language {
	constructor () {
		super(sqlConfig.dialects)
	}

	public ddlBuilder (dataSource: string, dialect: string, mapping: MappingConfig): LanguageDDLBuilder {
		return new SqlDDLBuilder(dataSource, mapping, this.dialectMetadata(dialect))
	}

	public dmlBuilder (dataSource: string, dialect: string, mapping: MappingConfig, expressions:Expressions): LanguageDMLBuilder {
		return new SqlDMLBuilder(dataSource, mapping, this.dialectMetadata(dialect), expressions)
	}
}

import { IQueryBuilder } from './iQueryBuilder'
import { ISchemaBuilder } from './iSchemaBuilder'
import { IOperandExecutor } from './iOperandExecutor'
export interface ILanguage
{
    name:string
    dialects:any
    get schema():ISchemaBuilder
    get query():IQueryBuilder
    get executor():IOperandExecutor
}

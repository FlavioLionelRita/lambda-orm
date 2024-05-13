import { Operand } from '3xpr';
import { Source, Field, Sentence, Page, MappingConfigService } from 'lambdaorm-base';
import { Query } from '../../../../query/domain';
import { OrmH3lp } from '../../../../shared/infrastructure';
import { DialectService, DmlBuilder } from '../../../../language/application';
export declare abstract class DmlBuilderBase implements DmlBuilder {
    protected readonly source: Source;
    protected readonly mapping: MappingConfigService;
    protected readonly dialect: DialectService;
    protected readonly helper: OrmH3lp;
    constructor(source: Source, mapping: MappingConfigService, dialect: DialectService, helper: OrmH3lp);
    abstract build(sentence: Sentence): Query;
    protected buildSentence(sentence: Sentence): string;
    protected abstract buildSelectSentence(sentence: Sentence): string;
    protected abstract buildInsertSentence(sentence: Sentence): string;
    protected abstract buildUpdateSentence(sentence: Sentence): string;
    protected abstract buildDeleteSentence(sentence: Sentence): string;
    protected buildOperand(operand: Operand): string;
    protected abstract buildField(field: Field): string;
    protected abstract buildObject(operand: Operand): string;
    protected buildPage(sentence: string, operand: Page): string;
    protected buildArrowFunction(operand: Operand): string;
    protected buildFunctionRef(operand: Operand): string;
    protected buildOperator(operand: Operand): string;
    protected buildBlock(operand: Operand): string;
    protected buildList(operand: Operand): string;
    protected buildKeyValue(operand: Operand): string;
    protected buildVariable(operand: Operand): string;
    protected buildConstant(operand: Operand): string;
}
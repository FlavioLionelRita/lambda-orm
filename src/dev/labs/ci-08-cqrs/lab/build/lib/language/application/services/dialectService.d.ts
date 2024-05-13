import { DialectFormat } from '../../domain';
export declare class DialectService {
    name: string;
    format: DialectFormat;
    private _operators?;
    private _functions?;
    private _others?;
    private _support?;
    private _dml?;
    private _ddl?;
    private _dbTypes?;
    private _types?;
    private _reservedWords;
    constructor(name: string, data: any);
    private addOperators;
    private addFunctions;
    get solveComposite(): boolean;
    isReservedWord(name: string): boolean;
    operator(name: string, operands: number): string;
    function(name: string): any;
    support(name: string): string;
    dml(name: string): string;
    other(name: string): string;
    ddl(name: string): string;
    dbType(name: string): string;
    type(name: string): string;
    delimiter(name: string, force?: boolean, excludeUnderscore?: boolean): string;
    string(name: string): string;
    getOperatorMetadata(name: string, operands: number): string | null;
    getFunctionMetadata(name: string): string | null;
}
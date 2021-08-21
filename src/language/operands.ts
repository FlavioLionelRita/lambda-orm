import {Operand,Context,Entity,Property,Parameter} from './../model/index'
import {Helper} from '../helper'

export class Constant extends Operand
{    
    constructor(name:string){
      super(name,[],Helper.getType(name));
    }
    eval():any
    {
        return this.name;
    }
}
export class Variable extends Operand
{
    public context?: Context
    public _number?:number   
    constructor(name:string,type:string='any'){
        super(name,[],type);  
        this.context  = undefined;
        this._number  = undefined;
    }    
    eval():any{
        return this.context?this.context.get(this.name):null;
    }
    set(value:any){
        if(this.context)
          this.context.set(this.name,value);
    }
}
export class Field extends Operand
{    
    public entity:string
    public mapping:string 
    constructor(entity:string,name:string,type:string,mapping:string){
        super(name,[],type);
        this.entity = entity;
        this.mapping  = mapping;  
    }
    clone(){
        return new Field(this.entity,this.name,this.type,this.mapping);
    }
} 
export class KeyValue extends Operand
{
    public field?:Field
    eval():any{
        return this.children[0].eval();
    }
}
export class Array extends Operand
{
    constructor(name:string,children:Operand[]=[]){
        super(name,children,'array');
    }
    eval():any{
        let values = [];
        for(let i=0;i<this.children.length;i++){
            values.push(this.children[i].eval());    
        }
        return values;
    } 
}
export class Object extends Operand
{
    constructor(name:string,children:Operand[]=[]){
        super(name,children,'object');
    }
    eval():any{        
        let obj:{[k: string]: any} = {};
        for(let i=0;i<this.children.length;i++){
            let value = this.children[i].eval();
            obj[this.children[i].name]=value;
        }
        return obj;
    }
} 
export class Operator extends Operand
{
    protected _function:any
    constructor(name:string,children:Operand[]=[],_function:any=null){
        super(name,children); 
        this._function = _function;
    }    
    eval():any{        
        let args= []
        for(let i=0;i<this.children.length;i++){
            args.push(this.children[i].eval()); 
        }
        return this._function(...args);  
    }
}                             
export class FunctionRef extends Operand
{
    protected _function:any
    constructor(name:string,children:Operand[]=[],_function:any=null){
        super(name,children); 
        this._function = _function;
    }    
    eval():any{        
        let args= []
        for(let i=0;i<this.children.length;i++){
            args.push(this.children[i].eval()); 
        }
        return this._function(...args);  
    }
}
export class ArrowFunction extends FunctionRef 
{
    public context?: Context
    constructor(name:string,children:Operand[]=[],_function:any=null){
        super(name,children,_function); 
        this.context = undefined;
    } 
}
export class Block extends Operand
{    
    eval():any{
        for(let i=0;i<this.children.length;i++){
            this.children[i].eval();    
        }
    } 
}
export class From extends Operand{}
export class Join extends Operand{}
export class Map extends ArrowFunction {}
export class Filter extends ArrowFunction {}
export class GroupBy extends ArrowFunction {}
export class Having extends ArrowFunction {}
export class Sort extends ArrowFunction {}
export class Insert extends ArrowFunction 
{
    public autoincrement?:Property
    public clause:string
    constructor(name:string,children:Operand[]=[],clause:string,autoincrement?:Property){
        super(name,children);
        this.autoincrement = autoincrement;
        this.clause=clause;
    }
}
export  class Update extends ArrowFunction{}
export class Delete extends ArrowFunction {}
export class Sentence extends FunctionRef 
{
    public columns:Property[]
    public parameters:Parameter[]
    public entity:string
    public autoincrement?:Property
    public alias:string
    public clause:string
    constructor(name:string,children:Operand[]=[],entity:string,alias:string,autoincrement?:Property,columns:Property[]=[],parameters:Parameter[]=[]){
        super(name,children);
        this.entity=entity;
        this.autoincrement=autoincrement;
        this.alias=alias;
        this.columns=columns;
        this.parameters=parameters;
        this.clause='';
    }
    public getIncludes():SentenceInclude[]
    {
        return this.children.filter(p=> p instanceof SentenceInclude) as SentenceInclude[];
    } 
    public loadVariables(){
        let map =  this.children.find(p=> p.name=='map');   
        let first = this.children.find(p=> p.name=='first');
        let select = (first?first:map) as Operand; 
        let filter = this.children.find(p=> p.name=='filter'); 
        let groupBy = this.children.find(p=> p.name=='groupBy');
        let having = this.children.find(p=> p.name=='having'); 
        let sort = this.children.find(p=> p.name=='sort'); 
        let insert = this.children.find(p=> p instanceof Insert) as Insert|undefined;
        let update = this.children.find(p=> p instanceof Update) as Update|undefined;
        let _delete = this.children.find(p=> p instanceof Delete) as Delete|undefined;

        let variables:Variable[]=[];
        if(select)this._loadVariables(select,variables);
        if(insert)this._loadVariables(insert,variables);
        if(update)this._loadVariables(update,variables);
        if(_delete)this._loadVariables(_delete,variables);
        if(filter)this._loadVariables(filter,variables);
        if(groupBy)this._loadVariables(groupBy,variables);
        if(having)this._loadVariables(having,variables);
        if(sort)this._loadVariables(sort,variables);
        for(let i=0;i<variables.length;i++ ){
            variables[i]._number = i+1;
        }        
    }
    protected _loadVariables(operand:Operand,variables:Variable[])
    {        
        if(operand instanceof Variable)
            variables.push(operand);
        for(let i=0;i<operand.children.length;i++ )
            this._loadVariables(operand.children[i],variables);
    }
}
export class SentenceInclude extends Operand
{
    public relation:any
    public variable:string
    constructor(name:string,children:Operand[]=[],relation:any,variable:string){
        super(name,children);
        this.relation=relation;
        this.variable=variable;
    }
}
// export class Query extends Operand
// {
//     public sentence:Sentence
//     public dialect:string
//     public entity:string
//     public autoincrement?:Property
//     public columns:Property[]
//     public parameters:Parameter[]
//     constructor(sentence:Sentence,children:Operand[]=[],dialect:string,entity:string,autoincrement?:Property,columns:Property[]=[],parameters:Parameter[]=[]){
//         super(sentence.name,children);
//         this.dialect=dialect;
//         this.sentence=sentence;
//         this.entity=entity;
//         this.autoincrement=autoincrement;
//         this.columns=columns;
//         this.parameters=parameters;
//     }
// }
// export class Include extends Operand
// {
//     public relation:any
//     public variable:string
//     constructor(name:string,children:Operand[]=[],relation:any,variable:string){
//         super(name,children);
//         this.relation=relation;
//         this.variable=variable;
//     }
// }


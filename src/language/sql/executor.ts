import {Operand,Context,Parameter } from './../../model'
import {IOperandExecutor} from '../'
import {IExecutor}  from '../../connection'
import {SqlSentenceInclude,SqlQuery} from './operands'
import {SqlLanguage} from './language'

export class SqlExecutor implements IOperandExecutor
{
    private language:SqlLanguage
    constructor(language:SqlLanguage){
        this.language=language;
    }
    public async execute(operand:Operand,context:Context,executor:IExecutor):Promise<any>
    {       
        let query:SqlQuery = operand as SqlQuery
        let result:any;    
        switch(query.name){
            case 'select': result= await this.select(query,context,executor);break;
            case 'insert': result=  await this.insert(query,context,executor);break;
            case 'update': result=  await this.update(query,context,executor);break;
            case 'delete': result=  await this.delete(query,context,executor);break;
            case 'bulkInsert': result=  await this.bulkInsert(query,context,executor);break;
            default:  throw `sentence ${query.name} not implemented`;
        }
        return result;
    }
    protected async select(query:SqlQuery,context:Context,executor:IExecutor):Promise<any>
    {           
        let mainResult = await executor.select(query.sentence,this.params(query.parameters,context));
        if(mainResult.length>0){
            for(const p in query.children){
                let include = query.children[p] as SqlSentenceInclude;
                if(!context.contains(include.variable)){
                    let ids:any[] = [];
                    for(let i=0;i< mainResult.length;i++){
                        let id = mainResult[i][include.relation.from];
                        if(!ids.includes(id))
                        ids.push(id)
                    }
                    context.set(include.variable,ids);
                }                
                let includeResult= await this.execute(include.children[0] as SqlQuery,context,executor);
                for(let i=0;i< mainResult.length;i++){
                    let element = mainResult[i];
                    let relationId = element[include.relation.from];
                    element[include.name] = (include.relation.type== 'manyToOne')
                                                            ?includeResult.filter((p:any) => p[include.relation.to] == relationId)
                                                            :includeResult.find((p:any) => p[include.relation.to] == relationId)
                }          
            }
        }
        return mainResult;
    }
    protected async insert(query:SqlQuery,context:Context,executor:IExecutor):Promise<number>
    {        
        // before insert the relationships of the type oneToOne and oneToMany
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                switch(include.relation.type){
                    case "oneToOne":
                    case "oneToMany":    
                        let relationContext = new Context(relation,context);
                        let relationId= await this.execute(include.children[0] as SqlQuery,relationContext,executor);
                        context.set(include.relation.from,relationId);
                }
            }
        }        
        //insert main entity
        let insertId = await executor.insert(query.sentence,this.params(query.parameters,context));
        if(query.autoincrement)
           context.set(query.autoincrement.name,insertId); 
        // after insert the relationships of the type oneToOne and manyToOne          
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                if(include.relation.type== 'manyToOne'){
                    let parentId = context.get(include.relation.from);
                    let childPropertyName = include.relation.to;
                    for(let i=0;i< relation.length;i++){
                        let child = relation[i];
                        child[childPropertyName]=parentId;
                        let childContext = new Context(child,context);
                        let childId= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                    }       
                }
            }
        }        
        return insertId;
    }
    protected async bulkInsert(query:SqlQuery,context:Context,executor:IExecutor):Promise<number[]>
    {        
        // before insert the relationships of the type oneToOne and oneToMany
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                switch(include.relation.type){
                    case "oneToOne":
                    case "oneToMany":    
                        let relationContext = new Context(relation,context);
                        let relationId= await this.execute(include.children[0] as SqlQuery,relationContext,executor);
                        context.set(include.relation.from,relationId);
                }
            }
        }        
        //insert main entity
        let insertId = await executor.bulkInsert(query.sentence,this.rows(query.parameters,context.data));
        if(query.autoincrement)
           context.set(query.autoincrement.name,insertId); 
        // after insert the relationships of the type oneToOne and manyToOne          
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                if(include.relation.type== 'manyToOne'){
                    let parentId = context.get(include.relation.from);
                    let childPropertyName = include.relation.to;
                    for(let i=0;i< relation.length;i++){
                        let child = relation[i];
                        child[childPropertyName]=parentId;
                        let childContext = new Context(child,context);
                        let childId= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                    }       
                }
            }
        }        
        return [];
    }
    protected async update(query:SqlQuery,context:Context,executor:IExecutor):Promise<any>
    { 
        let changeCount = await executor.update(query.sentence,this.params(query.parameters,context));
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                switch(include.relation.type){
                    case 'manyToOne':                        
                        for(let i=0;i< relation.length;i++){
                            let child = relation[i];
                            let childContext = new Context(child,context);
                            let includeResult= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                        }
                        break;
                    case "oneToOne":
                    case "oneToMany":    
                        let childContext = new Context(relation,context);
                        let includeResult= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                        break;
                } 
            }                   
        }        
        return changeCount; 
    }
    protected async delete(query:SqlQuery,context:Context,executor:IExecutor):Promise<any>
    { 
        //before remove relations entities
        for(const p in query.children){
            let include = query.children[p] as SqlSentenceInclude;
            let relation = context.get(include.relation.name);
            if(relation){
                switch(include.relation.type){
                    case 'manyToOne':                        
                        for(let i=0;i< relation.length;i++){
                            let child = relation[i];
                            let childContext = new Context(child,context);
                            let includeResult= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                        }
                        break;
                    case "oneToOne":
                    case "oneToMany":    
                        let childContext = new Context(relation,context);
                        let includeResult= await this.execute(include.children[0] as SqlQuery,childContext,executor);
                        break;
                } 
            }                   
        }
        //remove main entity 
        let changeCount = await executor.delete(query.sentence,this.params(query.parameters,context));
        return changeCount;  
    }
    protected  params(parameters:Parameter[],context:Context):Parameter[]
    {   
        for(const p in parameters){
            let parameter = parameters[p];
            parameter.value= context.get(parameter.name);
        }
        return parameters;
        // let params:Parameter[]=[];
        // for(const p in parameters){
        //     let variable = variables[p];
        //     let value = context.get(variable);
        //     //TODO: ver si se puede determinar el tipo de la variable desde el parser
        //     // , dado que por valor , podria ser null y no podria determinar que tipo corresponde
        //     let type="";
        //     if(Array.isArray(value))
        //         type='array';
        //     else
        //         //TODO: determine if it is integer or decimal  
        //         type=typeof value;
        //     params.push({name:variable,type:type,value:value});
        // }
        // return params;
    }
    protected rows(params:Parameter[],array:any[]){
        let rows:any[]=[];
        for(let i=0;i<array.length;i++){
            const item = array[i];
            let row:any[]=[];
            for(let j=0;j<params.length;j++){
                let value = item[params[j].name];                
                row.push(value=== undefined?null:value);
            }
            rows.push(row);
        }
        return rows;
    }
}
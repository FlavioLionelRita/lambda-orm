import {Property,Relation,Index,Delta} from './../../model'
import {ISchemaBuilder} from '../'
import {SchemaHelper} from '../../schema/schemaHelper'
import {SqlDialectMetadata} from './dialectMetadata'
import {SqlLanguage} from './language'

export class SqlSchemaBuilder implements ISchemaBuilder
{    
    private language:SqlLanguage
    constructor(language:SqlLanguage){
        this.language=language;
    } 
    public sync(delta:Delta,dialect:string,schema:SchemaHelper):string[]
    {       
        let metadata = this.language.dialects[dialect] as SqlDialectMetadata 
        let sql:string[]=[];
        //removes
        for(const name in delta.changed){
            const newEntity = delta.changed[name].new;
            const oldEntity = delta.changed[name].old;
            this.modifyEntityRemoveIndexes(sql,newEntity,metadata);
            this.modifyEntityRemoveConstraint(sql,newEntity,metadata);
        }
        for(const name in delta.remove){
            const oldEntity = delta.remove[name].old;
            this.removeEntity(sql,oldEntity,metadata);
        }
        // create entities
        for(const name in delta.new){
            const newEntity = delta.new[name].new;
            this.createEntity(sql,schema,newEntity,metadata);
        }
        // alter and remove columns
        for(const name in delta.changed){
            const newEntity = delta.changed[name].new;
            const oldEntity = delta.changed[name].old;
            this.modifyEntityAlterAndAddColumns(sql,newEntity,metadata);
            this.modifyEntityRemoveColumns(sql,newEntity,metadata);
        }
        // create news constraints      
        for(const name in delta.changed){
            const newEntity = delta.changed[name].new;
            const oldEntity = delta.changed[name].old;
            this.modifyEntityAddConstraint(sql,schema,newEntity,metadata);
        }
        for(const name in delta.new){
            const newEntity = delta.new[name].new;
            this.createEntityCreateFk(sql,schema,newEntity,metadata);
        }
        // create new indexes
        for(const name in delta.changed){
            const newEntity = delta.changed[name].new;
            const oldEntity = delta.changed[name].old;
            this.modifyEntityCreateIndexes(sql,newEntity,metadata);
        }
        for(const name in delta.new){
            const newEntity = delta.new[name].new;
            this.createEntityCreateIndexes(sql,newEntity,metadata);
        }
        return sql;
    }
    public drop(dialect:string,schema:SchemaHelper):string[]
    {
        let metadata = this.language.dialects[dialect] as SqlDialectMetadata 
        let sql:string[]=[];
        for(const name in schema.entity){
            const entity = schema.entity[name];
            this.removeEntity(sql,entity,metadata);
        }
        return sql;
    }
    public truncate(dialect:string,schema:SchemaHelper):string[]
    {
        let metadata = this.language.dialects[dialect] as SqlDialectMetadata 
        let sql:string[]=[];
        for(const name in schema.entity){
            const entity = schema.entity[name];
            this.truncateEntity(sql,entity,metadata);
        }
        return sql;
    }
    private truncateEntity(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    { 
        let text = metadata.ddl('truncateTable');
        text =text.replace('{name}',metadata.solveName(entity.mapping));
        sql.push(text);
    }
    private createDatabase(sql:string[],schema:SchemaHelper,metadata:SqlDialectMetadata):void
    {
        let text = metadata.ddl('createDatabase');
        text =text.replace('{name}',metadata.solveName(schema.mapping));
        sql.push(text);
    }
    private createEntity(sql:string[],schema:SchemaHelper,entity:any,metadata:SqlDialectMetadata):void
    {
        let define:string[]=[];
        for(const name in entity.property){
            define.push(this.createColumn(entity.property[name],metadata));
        }
        if(entity.primaryKey && entity.primaryKey.length > 0){
            define.push(this.createPk(entity,metadata));
        }
        if(entity.uniqueKey && entity.uniqueKey.length > 0){
            define.push(this.createUk(entity,metadata));
        }

        let text = metadata.ddl('createTable');
        text =text.replace('{name}',metadata.solveName(entity.mapping));
        text =text.replace('{define}',define.join(','));

        sql.push(text);
    }
    private createEntityCreateFk(sql:string[],schema:SchemaHelper,entity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));
        if(entity.relation)
        for(const name in entity.relation){
            const _new = entity.relation[name] as Relation;
            if(_new.type == 'oneToMany' || _new.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.addFk(schema,entity,_new,metadata));  
        }
    }
    private createEntityCreateIndexes(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {                 
        if(entity.index)
            for(const name in entity.index)
                sql.push(this.createIndex(entity,entity.index[name],metadata));
    }
    private modifyEntity(sql:string[],schema:SchemaHelper,entity:any,oldEntity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));
        //remove indexes
        for(const name in entity.index.remove){
            const old = entity.index.remove[name].old;
            sql.push(this.dropIndex(entity,old,metadata));
        }
        //remove constraint
        for(const name in entity.uniqueKey.remove){
            const old = entity.uniqueKey.remove.old;
            sql.push(alterEntity+' '+this.dropUk(old,metadata));
            sql.push(this.dropUkIndex(entity,metadata));  
        }
        for(const name in entity.uniqueKey.changed){
            const _new = entity.uniqueKey.changed[name].new;
            const old = entity.uniqueKey.changed[name].old;
            sql.push(this.dropUkIndex(entity,metadata)); 
            sql.push(alterEntity+' '+this.dropUk(old,metadata));
        }
        for(const name in entity.primaryKey.remove){
            const old = entity.primaryKey.remove.old;
            sql.push(alterEntity+' '+this.dropPk(old,metadata));
        }
        for(const name in entity.primaryKey.changed){
            const _new = entity.primaryKey.changed[name].new;
            const old = entity.primaryKey.changed[name].old;
            sql.push(alterEntity+' '+this.dropPk(old,metadata));
        }
        for(const name in entity.relation.remove){
            const old = entity.relation.remove[name].old as Relation;
            if(old.type == 'oneToMany' || old.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));
        }
        for(const name in entity.relation.changed){
            const _new = entity.relation.changed[name].new;
            const old = entity.relation.changed[name].old as Relation;
            if(old.type == 'oneToMany' || old.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));
        }
        //remove columns
        for(const name in entity.property.remove){
            const old = entity.property.remove[name].old;
            sql.push(alterEntity+' '+this.dropColumn(old,metadata));
        }
        //add and alter columns
        for(const name in entity.property.new){
            const _new = entity.property.new[name].new;
            sql.push(alterEntity+' '+this.addColumn(_new,metadata));  
        }
        for(const name in entity.property.changed){
            const _new = entity.property.changed[name].new;
            const old = entity.property.changed[name].old;
            sql.push(alterEntity+' '+this.alterColumn(_new,metadata));
        }
        //add constraints
        for(const name in entity.primaryKey.new){
            const _new = entity.primaryKey.new;
            sql.push(alterEntity+' '+this.addPk(_new,metadata));  
        }
        for(const name in entity.primaryKey.changed){
            const _new = entity.primaryKey.changed[name].new;
            const old = entity.primaryKey.changed[name].old;
            sql.push(alterEntity+' '+this.addPk(_new,metadata)); 
        }
        for(const name in entity.uniqueKey.new){
            const _new = entity.uniqueKey.new;
            sql.push(alterEntity+' '+this.addUk(_new,metadata));
        }
        for(const name in entity.uniqueKey.changed){
            const _new = entity.uniqueKey.changed[name].new;
            const old = entity.uniqueKey.changed[name].old;
            sql.push(alterEntity+' '+this.addUk(_new,metadata));
        }
        for(const name in entity.relation.new){
            const _new = entity.relation.new[name].new as Relation;
            if(_new.type == 'oneToMany' || _new.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.addFk(schema,entity,_new,metadata));  
        }
        for(const name in entity.relation.changed){
            const _new = entity.relation.changed[name].new as Relation;
            const old = entity.relation.changed[name].old as Relation;
            if(_new.type == 'oneToMany' || _new.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.addFk(schema,entity,_new,metadata));
            if(_new.type == 'manyToOne' && (old.type == 'oneToMany' || old.type == 'oneToOne'))
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));      
        }
        //create indexes
        for(const name in entity.index.new){
            const _new = entity.index.new[name].new;
            sql.push(this.createIndex(entity,_new,metadata));
        }
        for(const name in entity.index.changed){
            const _new = entity.index.changed[name].new;
            const old = entity.index.changed[name].old;
            sql.push(this.dropIndex(entity,old,metadata));
            sql.push(this.createIndex(entity,_new,metadata));
        } 
    }
    private modifyEntityRemoveColumns(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));
        for(const name in entity.property.remove){
            const old = entity.property.remove[name].old;
            sql.push(alterEntity+' '+this.dropColumn(old,metadata));
        }
    }
    private modifyEntityAlterAndAddColumns(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));
        for(const name in entity.property.new){
            const _new = entity.property.new[name].new;
            sql.push(alterEntity+' '+this.addColumn(_new,metadata));  
        }
        for(const name in entity.property.changed){
            const _new = entity.property.changed[name].new;
            const old = entity.property.changed[name].old;
            sql.push(alterEntity+' '+this.alterColumn(_new,metadata));
        }
    }
    private modifyEntityRemoveIndexes(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {
        for(const name in entity.index.remove){
            const old = entity.index.remove[name].old;
            sql.push(this.dropIndex(entity,old,metadata));
        }
        for(const name in entity.uniqueKey.remove){
            sql.push(this.dropUkIndex(entity,metadata)); 
        }
        for(const name in entity.uniqueKey.changed){
            sql.push(this.dropUkIndex(entity,metadata)); 
        }       
    }
    private modifyEntityRemoveConstraint(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));

        for(const name in entity.uniqueKey.remove){
            const old = entity.uniqueKey.remove.old;
            sql.push(alterEntity+' '+this.dropUk(old,metadata));
            sql.push(this.dropUkIndex(entity,metadata));  
        }
        for(const name in entity.uniqueKey.changed){
            const _new = entity.uniqueKey.changed[name].new;
            const old = entity.uniqueKey.changed[name].old;
            sql.push(this.dropUkIndex(entity,metadata)); 
            sql.push(alterEntity+' '+this.dropUk(old,metadata));
        }
        for(const name in entity.primaryKey.remove){
            const old = entity.primaryKey.remove.old;
            sql.push(alterEntity+' '+this.dropPk(old,metadata));
        }
        for(const name in entity.primaryKey.changed){
            const _new = entity.primaryKey.changed[name].new;
            const old = entity.primaryKey.changed[name].old;
            sql.push(alterEntity+' '+this.dropPk(old,metadata));
        }
        for(const name in entity.relation.remove){
            const old = entity.relation.remove[name].old as Relation;
            if(old.type == 'oneToMany' || old.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));
        }
        for(const name in entity.relation.changed){
            const _new = entity.relation.changed[name].new as Relation;
            const old = entity.relation.changed[name].old as Relation;
            if(old.type == 'oneToMany' || old.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));
        }
    }
    private modifyEntityAddConstraint(sql:string[],schema:SchemaHelper,entity:any,metadata:SqlDialectMetadata):void
    {
        const alterEntity = metadata.ddl('alterTable').replace('{name}',metadata.solveName(entity.mapping));
        //add constraints
        for(const name in entity.primaryKey.new){
            const _new = entity.primaryKey.new;
            sql.push(alterEntity+' '+this.addPk(_new,metadata));  
        }
        for(const name in entity.primaryKey.changed){
            const _new = entity.primaryKey.changed[name].new;
            const old = entity.primaryKey.changed[name].old;
            sql.push(alterEntity+' '+this.addPk(_new,metadata)); 
        }
        for(const name in entity.uniqueKey.new){
            const _new = entity.uniqueKey.new;
            sql.push(alterEntity+' '+this.addUk(_new,metadata));
        }
        for(const name in entity.uniqueKey.changed){
            const _new = entity.uniqueKey.changed[name].new;
            const old = entity.uniqueKey.changed[name].old;
            sql.push(alterEntity+' '+this.addUk(_new,metadata));
        }
        for(const name in entity.relation.new){
            const _new = entity.relation.new[name].new as Relation;
            if(_new.type == 'oneToMany' || _new.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.addFk(schema,entity,_new,metadata));  
        }
        for(const name in entity.relation.changed){
            const _new = entity.relation.changed[name].new as Relation;
            const old = entity.relation.changed[name].old as Relation;
            if(_new.type == 'oneToMany' || _new.type == 'oneToOne' )
                sql.push(alterEntity+' '+this.addFk(schema,entity,_new,metadata));
            if(_new.type == 'manyToOne' && (old.type == 'oneToMany' || old.type == 'oneToOne'))
                sql.push(alterEntity+' '+this.dropFk(entity,old,metadata));      
        }
    }
    private modifyEntityCreateIndexes(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {        
        for(const name in entity.index.new){
            const _new = entity.index.new[name].new;
            sql.push(this.createIndex(entity,_new,metadata));
        }
        for(const name in entity.index.changed){
            const _new = entity.index.changed[name].new;
            const old = entity.index.changed[name].old;
            sql.push(this.createIndex(entity,_new,metadata));
        }       
    }
    private dropDatabase(sql:string[],schema:SchemaHelper,metadata:SqlDialectMetadata):void
    {
        let text = metadata.ddl('dropDatabase');
        text =text.replace('{name}',metadata.solveName(schema.mapping));
        sql.push(text);
    }
    private removeEntity(sql:string[],entity:any,metadata:SqlDialectMetadata):void
    {  
        let text = metadata.ddl('dropTable');
        text =text.replace('{name}',metadata.solveName(entity.mapping));

        sql.push(text);
        if(entity.uniqueKey && entity.uniqueKey.length > 0)
            sql.push(this.dropUkIndex(entity,metadata));            
        if(entity.index)
            for(const name in entity.index)
                sql.push(this.dropIndex(entity,entity.index[name],metadata));
    }
    private createColumn(property:Property,metadata:SqlDialectMetadata):string
    {        
        let type = metadata.type(property.type);
        type = property.length?type.replace('{0}',property.length.toString()):type;
        let nullable = property.nullable !== undefined && property.nullable==false?metadata.other("notNullable"):"";
        
        let text = property.autoincrement?metadata.ddl('incrementalColumDefine'):metadata.ddl('columnDefine');
        text =text.replace('{name}',metadata.solveName(property.mapping as string));
        text =text.replace('{type}',type);
        text =text.replace('{nullable}',nullable);
        return text;
    }
    private createPk(entity:any,metadata:SqlDialectMetadata):string
    {
        let columns:string[]=[];
        let columnTemplate = metadata.other('column');
        for(let i=0;i<entity.primaryKey.length;i++){
            const column = entity.property[entity.primaryKey[i]];
            columns.push(columnTemplate.replace('{name}',metadata.solveName(column.mapping)));
        }
        let text = metadata.ddl('createPk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_PK'));
        text =text.replace('{columns}',columns.join(','));
        return text;
    }
    private createUk(entity:any,metadata:SqlDialectMetadata):string
    {
        let columns:string[]=[];
        let columnTemplate = metadata.other('column');
        for(let i=0;i<entity.uniqueKey.length;i++){
            const column = entity.property[entity.uniqueKey[i]];
            columns.push(columnTemplate.replace('{name}',metadata.solveName(column.mapping)));
        }
        let text = metadata.ddl('createUk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_UK'));
        text =text.replace('{columns}',columns.join(','));
        return text;
    }
    private createFk(schema:SchemaHelper,entity:any,relation:Relation,metadata:SqlDialectMetadata):string
    {
        let column = entity.property[relation.from];
        let fEntity = schema.getEntity(relation.entity);
        let fColumn = fEntity.property[relation.to];

        let text = metadata.ddl('createFk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_'+relation.name+'_FK'));
        text =text.replace('{column}',metadata.solveName(column.mapping));
        text =text.replace('{fTable}',metadata.solveName(fEntity.mapping));
        text =text.replace('{fColumn}',metadata.solveName(fColumn.mapping));
        return text;
    }
    private createIndex(entity:any,index:Index,metadata:SqlDialectMetadata):string
    {
        let columns:string[]=[];
        let columnTemplate = metadata.other('column');
        for(let i=0;i<index.fields.length;i++){
            const column = entity.property[index.fields[i]];
            columns.push(columnTemplate.replace('{name}',metadata.solveName(column.mapping)));
        }
        let text = metadata.ddl('createIndex');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_'+index.name));
        text =text.replace('{table}',metadata.solveName(entity.mapping));
        text =text.replace('{columns}',columns.join(','));
        return text;
    }    
    private alterColumn(property:Property,metadata:SqlDialectMetadata):string
    {        
        let type = metadata.type(property.type);
        type = property.length?type.replace('{0}',property.length.toString()):type;
        let nullable = property.nullable !== undefined && property.nullable==false?metadata.other("notNullable"):"";
        
        let text = property.autoincrement?metadata.ddl('incrementalColumDefine'):metadata.ddl('columnDefine');
        text =text.replace('{name}',metadata.solveName(property.mapping as string));
        text =text.replace('{type}',type);
        text =text.replace('{nullable}',nullable);
        text= metadata.ddl('alterColumn').replace('{columnDefine}',text);
        return text;
    }
    private addColumn(property:Property,metadata:SqlDialectMetadata):string
    {        
        let type = metadata.type(property.type);
        type = property.length?type.replace('{0}',property.length.toString()):type;
        let nullable = property.nullable !== undefined && property.nullable==false?metadata.other("notNullable"):"";
                
        let text = property.autoincrement?metadata.ddl('incrementalColumDefine'):metadata.ddl('columnDefine');
        text =text.replace('{name}',metadata.solveName(property.mapping as string));
        text =text.replace('{type}',type);
        text =text.replace('{nullable}',nullable);
        text= metadata.ddl('addColumn').replace('{columnDefine}',text);
        return text;
    }
    private addPk(entity:any,metadata:SqlDialectMetadata):string
    {
        let columns:string[]=[];
        let columnTemplate = metadata.other('column');
        for(let i=0;i<entity.primaryKey.length;i++){
            const column = entity.property[entity.primaryKey[i]];
            columns.push(columnTemplate.replace('{name}',metadata.solveName(column.mapping)));
        }
        let text = metadata.ddl('addPk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_PK'));
        text =text.replace('{columns}',columns.join(','));
        return text;
    }
    private addUk(entity:any,metadata:SqlDialectMetadata):string
    {
        let columns:string[]=[];
        let columnTemplate = metadata.other('column');
        for(let i=0;i<entity.uniqueKey.length;i++){
            const column = entity.property[entity.uniqueKey[i]];
            columns.push(columnTemplate.replace('{name}',metadata.solveName(column.mapping)));
        }
        let text = metadata.ddl('addUk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_UK'));
        text =text.replace('{columns}',columns.join(','));
        return text;
    }
    private addFk(schema:SchemaHelper,entity:any,relation:Relation,metadata:SqlDialectMetadata):string
    {
        let column = entity.property[relation.from];
        let fEntity = schema.getEntity(relation.entity);
        let fColumn = fEntity.property[relation.to];

        let text = metadata.ddl('addFk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_'+relation.name+'_FK'));
        text =text.replace('{column}',metadata.solveName(column.mapping));
        text =text.replace('{fTable}',metadata.solveName(fEntity.mapping));
        text =text.replace('{fColumn}',metadata.solveName(fColumn.mapping));
        return text;
    }    
    private dropColumn(property:Property,metadata:SqlDialectMetadata):string
    {  
        let text = metadata.ddl('dropColumn');
        text =text.replace('{name}',metadata.solveName(property.mapping as string));
        return text;
    }
    private dropPk(entity:any,metadata:SqlDialectMetadata):string
    {  
        let text = metadata.ddl('dropPk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_PK'));
        return text;
    }
    private dropUk(entity:any,metadata:SqlDialectMetadata):string
    {  
        let text = metadata.ddl('dropPk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_UK'));
        return text;
    }
    private dropFk(entity:any,relation:Relation,metadata:SqlDialectMetadata):string
    {  
        let text = metadata.ddl('dropPk');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_'+relation.name+'_FK'));
        return text;
    }
    private dropIndex(entity:any,index:Index,metadata:SqlDialectMetadata):string
    {      
        let text = metadata.ddl('dropIndex');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_'+index.name));
        return text;
    }
    private dropUkIndex(entity:any,metadata:SqlDialectMetadata):string
    {       
        let text = metadata.ddl('dropIndex');
        text =text.replace('{name}',metadata.solveName(entity.mapping+'_UK'));
        return text;
    }
}
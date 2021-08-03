import {Connection,ConnectionConfig} from  './..'
import {Parameter} from '../../model'
import { promisify } from 'util';

// import * as mysql from 'mysql2/promise'



export class MySqlConnection extends Connection
{
    private static mysqlLib:any
    constructor(config:ConnectionConfig){        
        super(config);
        if(!MySqlConnection.mysqlLib)
           MySqlConnection.mysqlLib= require('mysql2/promise')
    }
    public async connect():Promise<void>
    { 
        this.cnx = await MySqlConnection.mysqlLib.createConnection(this.config.connectionString);
    }
    public async disconnect():Promise<void>
    {
        // // Don't disconnect connections with CLOSED state
        // if (this.cnx._closing) {
        //   debug('connection tried to disconnect but was already at CLOSED state');
        //   return;
        // }
        if(this.cnx)  
          await promisify(callback => this.cnx?.end(callback))();
    }
    public async validate():Promise<Boolean> 
    {
        return !!this.cnx;
    }
    public async select(sql:string,params:Parameter[]):Promise<any>
    {        
        return await this._execute(sql,params);
    }
    public async insert(sql:string,params:Parameter[]):Promise<number>
    {        
        let result = await this._execute(sql,params);
        return result.insertId;
    }
    public async bulkInsert(sql:string,array:any[]):Promise<number[]>
    {   
        //https://github.com/sidorares/node-mysql2/issues/830
        let result = await this.cnx.query(sql,[array]);

        //TODO: verificar https://github.com/sidorares/node-mysql2/issues/435
        const start = result[0].insertId
        const end = result[0].insertId + (result[0].affectedRows-1);
        let lastInsertedIds:number[]=[];
        for(let i=start;i<=end;i++)lastInsertedIds.push(i);
        return lastInsertedIds;
    }
    public async update(sql:string,params:Parameter[]):Promise<number>
    {        
        let result = await this._execute(sql,params);
        return result.affectedRows;
    }
    public async delete(sql:string,params:Parameter[]):Promise<number>
    {        
        let result = await this._execute(sql,params);
        return result.affectedRows;
    }
    public async execute(sql:string):Promise<any>
    {        
        return  await this.cnx.query(sql);
    }
    public async beginTransaction():Promise<void>
    {
        if(!this.cnx)
            await this.connect();        
        await this.cnx.beginTransaction();
        this.inTransaction=true;
    }
    public async commit():Promise<void>
    {
        if(!this.cnx)
            throw 'Connection is closed'
        await this.cnx.commit();
        this.inTransaction=false;
    }
    public async rollback():Promise<void>
    {
        if(!this.cnx)
            throw 'Connection is closed'
        await this.cnx.rollback();
        this.inTransaction=false;
    }
    protected async _execute(sql:string,params:Parameter[]=[]){
        if(!this.cnx){
            if(!this.inTransaction)await this.connect()
            else throw 'Connection is closed' 
        }
        //Solve array parameters , example IN(?) where ? is array[]
        // https://github.com/sidorares/node-mysql2/issues/476
        let useExecute= true;
        let values:any[]=[];
        //en el caso de haber un array con elementos string no se esta pudiendo resolver el IN(,,,) con execute
        //por este motivo se esta usando query en este caso.
        //TODO: ver como se puede resolver este caso para usar execute siempre.
        for(let i=0;i<params.length;i++)
            if(params[i].type=='array')
                useExecute=false;
        for(let i=0;i<params.length;i++)
            values.push(params[i].value);     
        
        if(useExecute){
            let result = await this.cnx.execute(sql,values);
            return result[0];
        }else{
            let result = await this.cnx.query(sql,values);
            return result[0];
        }        
        // for(let i=0;i<params.length;i++){
        //     let param = params[i];
        //     if(param.type=='array')
        //         if(param.value.length>0)
        //             if(typeof param.value[0] == 'string')
        //                 useExecute=false;
        // }
        // for(let i=0;i<params.length;i++){
        //     let param = params[i];
        //     if(param.type=='array')
        //         if(useExecute)
        //             values.push(param.value.join(','));
        //         else
        //             values.push(param.value); 
        //     else
        //       values.push(param.value);     
        // }
        // if(useExecute){
        //     let result = await this.cnx.execute(sql,values);
        //     return result[0];
        // }else{
        //     let result = await this.cnx.query(sql,values);
        //     return result[0];
        // }  
    }   
}
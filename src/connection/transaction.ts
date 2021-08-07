import {Parameter} from '../model'
import {Connection } from './connection'
import {IConnectionManager } from './iConnectionManager'
import {ITransaction} from './iTransaction'

export class Transaction implements ITransaction
{
    private connectionManager:IConnectionManager
    public connectionName:string
    private connection?:Connection
    constructor(connectionManager:IConnectionManager,connectionName:string){
        this.connectionManager=connectionManager;
        this.connectionName=connectionName; 
    }    
    public async begin():Promise<void>
    {
        this.connection = await this.connectionManager.acquire(this.connectionName);
        await this.connection.beginTransaction();
    }
    public async select(sql:string,params:Parameter[]):Promise<any>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.select(sql,params);
    }
    public async insert(sql:string,params:Parameter[]):Promise<number>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.insert(sql,params);
    }
    public async bulkInsert(sql:string,array:any[]):Promise<number[]>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.bulkInsert(sql,array);
    }
    public async update(sql:string,params:Parameter[]):Promise<number>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.update(sql,params);
    }
    public async delete(sql:string,params:Parameter[]):Promise<number>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.delete(sql,params);
    }
    public async execute(sql:string):Promise<any>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        return this.connection.execute(sql);
    }
    public async commit():Promise<void>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        await this.connection.commit();
        await this.connectionManager.release(this.connection);
    }
    public async rollback():Promise<void>
    {
        if(!this.connection)
            throw 'Connection is closed' 
        await this.connection.rollback();
        await this.connectionManager.release(this.connection);
    }
}
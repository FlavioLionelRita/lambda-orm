import { Schema } from './schema'
export interface Database
{
	name: string
	dialect: string
	connection:any
	schema:string
}
export interface Paths
{
	src: string
	data: string
}
export interface Config
{
	paths: Paths
	databases?: Database[]
	schemas?:Schema[]
}

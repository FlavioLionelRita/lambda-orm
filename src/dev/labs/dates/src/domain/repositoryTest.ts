import { Repository, IOrm } from 'lambdaorm'
import { Test, QryTest } from './model'
export class TestRepository extends Repository<Test, QryTest> {
	constructor (stage?: string, orm?:IOrm) {
		super('Tests', stage, orm)
	}
	// Add your code here
}
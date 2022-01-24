import { IOrm } from '../index'

export class ExpressionActions {
	private orm
	private name
	private stage
	constructor (name: string, orm:IOrm, stage?:string) {
		this.name = name
		this.stage = stage
		this.orm = orm
	}

	public async execute (expresion: string, data:any, context:any): Promise<any> {
		return await this.orm.execute(`${this.name}${expresion}`, data, this.stage, context)
	}

	public complete (expresion: string): string {
		return this.orm.complete(`${this.name}${expresion}`)
	}

	public async model (expresion: string): Promise<any> {
		return await this.orm.model(`${this.name}${expresion}`)
	}

	public async parameters (expresion: string): Promise<any> {
		return await this.orm.parameters(`${this.name}${expresion}`)
	}

	public async metadata (expresion: string): Promise<any> {
		return await this.orm.metadata(`${this.name}${expresion}`)
	}

	public async sentence (expresion: string): Promise<string> {
		return await this.orm.sentence(`${this.name}${expresion}`, this.stage)
	}
}

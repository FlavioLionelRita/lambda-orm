import { NotImplemented } from 'lambdaorm-base'
import { Language, DialectService } from '../../domain'

export class LanguagesService {
	public dialects: any
	private languages: Language[]

	constructor () {
		this.languages = []
		this.dialects = {}
	}

	public add (language: Language):LanguagesService {
		const index = this.languages.findIndex(p => p.name === language.name)
		if (index !== -1) {
			this.languages[index] = language
		} else {
			this.languages.push(language)
		}
		return this
	}

	public get (name: string): Language {
		const language = this.languages.find(p => p.name === name)
		if (!language) {
			throw new NotImplemented(`language ${name} not implemented`)
		}
		return language
	}

	public getByDialect (dialect: string): Language {
		for (const i in this.languages) {
			for (const j in this.languages[i].dialects) {
				if (this.languages[i].dialects[j].name === dialect) {
					return this.languages[i]
				}
			}
		}
		throw new NotImplemented(`language with dialect ${dialect} not implemented`)
	}

	public getDialect (name: string): DialectService {
		for (const i in this.languages) {
			for (const j in this.languages[i].dialects) {
				if (this.languages[i].dialects[j].name === name) { return this.languages[i].dialects[j] }
			}
		}
		throw new NotImplemented(`Dialect ${name} not implemented`)
	}
}

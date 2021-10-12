/* eslint-disable no-mixed-spaces-and-tabs */
import { CommandModule, Argv, Arguments } from 'yargs'
import { Orm, Database } from '../index'
import path from 'path'

export class DropCommand implements CommandModule {
	command = 'drop';
	describe = 'Removes all database objects but not the database.';

	builder (args: Argv) {
		return args
			.option('w', {
				alias: 'workspace',
				describe: 'project path.'
			})
			.option('n', {
				alias: 'name',
				describe: 'Name of database'
			})
			.option('s', {
				alias: 'sentences',
				describe: 'Generates the sentences but does not apply.'
			})
			.option('f', {
				alias: 'force',
				describe: 'If there is an error in a statement, continue executing the next statements.'
			})
	}

	async handler (args: Arguments) {
		const workspace = path.resolve(process.cwd(), args.workspace as string || '.')
		const database = args.database as string
		const sentences = args.sentences !== undefined
		const force = args.force !== undefined
		const orm = new Orm()

		try {
			await orm.init(workspace)
			const configInfo = await orm.lib.getConfigInfo(workspace)
			// get database
			let db:Database|undefined
			if (database === undefined) {
				if (configInfo.config.databases.length === 1) {
					db = configInfo.config.databases[0]
				} else {
					throw new Error('the database argument is required')
				}
			} else {
				db = configInfo.config.databases.find(p => p.name === database)
				if (db === undefined) {
					throw new Error(`database: ${database} not found in config`)
				}
			}

			if (sentences) {
				const result = await orm.database.clean(db.name).sentence()
				console.log(result)
			} else {
				await orm.database.clean(db.name).execute(force)
			}
		} catch (error) {
			console.error(`error: ${error}`)
		} finally {
			await orm.end()
		}
	}
}

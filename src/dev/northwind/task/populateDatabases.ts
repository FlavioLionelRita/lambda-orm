import { orm, helper } from '../../../lib'

async function stageExport (source: string) {
	const exportFile = 'data/' + source + '-export.json'
	const data = await orm.stage.export({ stage: source }).execute()
	await helper.fs.write(exportFile, JSON.stringify(data))
}
async function stageImport (source: string, target: string) {
	const sourceFile = 'data/' + source + '-export.json'
	const content = await helper.fs.read(sourceFile) as string
	const data = JSON.parse(content)
	await orm.stage.import({ stage: target }).execute(data)
}

export async function apply (stages: string[], callback: any) {
	try {
		require('dotenv').config({ path: './config/northwind.env' })
		await orm.init('./config/northwind.yaml')
		await orm.stage.sync({ stage: 'Source', tryAllCan: true }).execute()
		await stageExport('Source')
		for (const p in stages) {
			const stage = stages[p]
			await orm.stage.clean({ stage, tryAllCan: true }).execute()
			await orm.stage.sync({ stage }).execute()
			await stageImport('Source', stage)
			await stageExport(stage)
		}
		await orm.end()
	} catch (error) {
		console.error(error)
	} finally {
		callback()
	}
}
// apply(['MySQL'], function () { console.log('end') })
// apply(['MySQL', 'MariaDB', 'PostgreSQL', 'SqlServer', 'Oracle', 'MongoDB'], function () { console.log('end') })
// apply(['MySQL'], function () { console.log('end') })
import { LoggerBuilder, Orm, OrmH3lp} from '../../../lib'
import { h3lp } from 'h3lp'
(async () => {
	const workspace = __dirname.replace('/build/', '/src/')
	const orm = new Orm(workspace)
	const helper = new OrmH3lp(h3lp, new LoggerBuilder().build())	
	try{		
		await helper.fs.removeDir(workspace + '/data')
		const originalSchema = helper.yaml.load(await helper.fs.read(workspace + '/lambdaOrm.yaml'))
		await orm.init(originalSchema)	
		await orm.stage.match()
		await helper.fs.write( workspace + '/result.yaml', helper.yaml.dump(orm.state.originalSchema))
	}catch(e){
		console.log(e)
	} finally {
		orm.end()
	}	
})()

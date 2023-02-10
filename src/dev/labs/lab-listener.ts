import { orm ,ActionObserver ,ObservableAction, ActionObserverArgs } from '../../lib'

class EmployeeUpdateObserver extends ActionObserver {
	constructor() {
		super(ObservableAction.update,'query.entity=="Employees"')
	}

	public before(args:ActionObserverArgs): void {
		console.log(`before expression: ${args.expression}`)
	}

	public after(args:ActionObserverArgs): void {
		console.log(`after result: ${JSON.stringify(args.result)}`)
	}

	public error(args:ActionObserverArgs): void {
		console.log(`error: ${args.error.message}`)
	}	
}


export async function apply (callback: any) {
	try {
		await orm.init()
		orm.subscribe(new EmployeeUpdateObserver())

		const stage = 'SqlServer'	
		const query = 'Employees.filter(p=> p.firstName== firstName && p.lastName== lastName).update({reportsToId:reportsToId})'
		const context = {reportsToId: 1, firstName: 'test', lastName: 'xxx'}

		const info = orm.getInfo(query,{stage: stage})
		console.log(info)
		const result = await orm.execute(query, context, {stage: stage})
		console.log(JSON.stringify(result, null, 2))
	} catch (error:any) {
		console.error(error.stack)
	} finally {
		await orm.end()
		callback()
	}
}

apply(function () { console.log('end') })

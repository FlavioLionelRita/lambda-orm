import { Orm } from '../../../lib'
import { h3lp } from 'h3lp'
import path from 'path'

// function getUsers () {
// return [
// { username: 'flaviolrita', firstname: 'Flavio Lionel', lastname: 'Rita', email: 'lambdaorm@proton.me' },
// { username: 'griss512', firstname: 'Gricelda Rocio', lastname: 'Puchuri Corilla', email: 'griss512@hotmail.com' },
// { username: 'micaelavrita', firstname: 'Micaela Valentina', lastname: 'Rita Puchuri', email: 'lambdaorm@proton.me' },
// { username: 'joaquinirita', firstname: 'Joaquin Ignacio', lastname: 'Rita Puchuri', email: 'lambdaorm@proton.me' }
// ]
// }

function getGroups () {
	return [
		{
			name: 'Rita Puchuri',
			members: [
				{ username: 'flaviolrita', role: 'admin' },
				{ username: 'griss512', role: 'auditor' },
				{ username: 'micaelavrita', role: 'operator' },
				{ username: 'joaquinirita', role: 'operator' }
			]
		}
	]
}

function getDevices () {
	return [
		{
			name: 'Huawei P30 lite Flavio',
			type: 'phone',
			serialNumber: 'L2NDU19A18006154',
			ownerId: 'flaviolrita',
			brand: 'Huawei',
			model: 'MAR-LX1A',
			so: 'android 10',
			imei: '863451049927149',
			imei2: '863451049959159',
			mac: 'FC:94:35:90:E2:86',
			macBluetooth: 'FC:94:35:90:EF:07',
			ip: '192.168.1.138',
			components: [
				{
					name: 'frontal camera',
					type: 'camera',
					brand: 'Huawei',
					model: '24Mpx front'
				},
				{
					name: 'Rear camera',
					type: 'camera',
					brand: 'Huawei',
					model: 'Rear camera 48, 8 and 2Mpx'
				},
				{
					name: 'microphone',
					type: 'microphone',
					brand: 'Huawei',
					model: 'Microphone SMD Soldering Soldar'
				}
			]
		}
	]
}

(async () => {
	const workspace = path.join(process.cwd(), '/src/dev/labs/devicenet-sync')
	const orm = new Orm()
	try {
		await orm.init(workspace)
		// await orm.stage.clean(orm.defaultStage.name).execute(true)
		// await orm.stage.sync(orm.defaultStage.name).execute()
		// // //console.log(JSON.stringify(await orm.execute('Users.bulkInsert()', getUsers())))
		// console.log(JSON.stringify(await orm.execute('Groups.bulkInsert().include(p-> p.members)', getGroups())))
		// console.log(JSON.stringify(await orm.execute('Devices.bulkInsert().include(p-> p.components)', getDevices())))

		// const expression = 'Groups.include(p=> [p.members.include(p=>p.user.include(p=> p.devices.include(p=>p.components.filter(p=> p.type == ComponentType.camera))))])'
		// const expression = 'Users'

		// https://www.postgresql.org/message-id/attachment/23520/sql-merge.html
		// Groups.bulkMerge()
		// .source(group.map(p -> { name: p.name, code: p.code }))
		// .on(p => p.code == code)
		// .matched({ name: name })
		// .noMatchedTarget({ name: name, code: code, created: now() })
		// .noMatchedSource({ name: name, code: code, created: now() })

		// https://stackoverflow.com/questions/17267417/how-to-upsert-merge-insert-on-duplicate-update-in-postgresql
		// const expression = 'Users.filter(p-> p.username == "flaviolrita")'
		const expression = 'Users'

		console.log('info:')
		console.log(JSON.stringify(orm.plan(expression,{view:'admin'})))
		console.log(JSON.stringify(orm.plan(expression)))
		// console.log(JSON.stringify(orm.plan(expression, 'collector')))
		// console.log('parameters:')
		// console.log(JSON.stringify(orm.parameters(expression)))
		// console.log('model:')
		// console.log(JSON.stringify(orm.model(expression)))
		// console.log('constraints:')
		// console.log(JSON.stringify(orm.constraints(expression)))
		// console.log('metadata:')
		// console.log(JSON.stringify(orm.metadata(expression)))

		// console.log(JSON.stringify(await orm.execute(expression)))
		// console.log(JSON.stringify(await orm.execute(expression, {}, 'admin')))

		// // console.log(JSON.stringify(await orm.execute('Devices.updateAll({imei2:null})')))
		// // console.log(JSON.stringify(await orm.execute('Components.deleteAll()')))
		// // console.log(JSON.stringify(await orm.execute('Devices.deleteAll()')))

		h3lp.fs.write(path.join(workspace, 'schema.json'), JSON.stringify(orm.state.schema, null, 2))

		// await orm.stage.clean(orm.defaultStage.name).execute()
	} catch (error:any) {
		console.error(error.message)
		console.error(error.stack)
	} finally {
		orm.end()
	}
})()

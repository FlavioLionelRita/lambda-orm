/* eslint-disable linebreak-style */
const fs = require('fs')
// const path = require('path')
require('dotenv').config({ path: './src/test/test.env' })

module.exports = function (grunt) {
	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-exec')
	// Project configuration.
	grunt.initConfig({
		exec: {
			create_dbs: { cmd: './create_dbs.sh', options: { cwd: './src/test/db' } },
			drop_dbs: { cmd: './drop_dbs.sh', options: { cwd: './src/test/db' } }
		}
	})

	grunt.registerTask('create_dbs', ['exec:create_dbs'])
	grunt.registerTask('drop_dbs', ['exec:drop_dbs'])

	grunt.registerTask('populate_source', 'populate source db', function () {
		const mysqlExecute = require('./dist/test/task/mysqlExecute')
		const sourceFile = './src/test/db/northwind-mysql.sql'
		const connection = JSON.parse(process.env.ORM_CNN_SOURCE)
		const script = fs.readFileSync(sourceFile, { encoding: 'utf8' })
		const done = this.async()
		mysqlExecute.apply(script, connection, done)
	})

	grunt.registerTask('populate_databases', 'populate databases for test', function () {
		const populateDatabases = require('./dist/test/task/populateDatabases')
		const configPath = './src/test/config.yaml'
		const done = this.async()
		populateDatabases.apply(configPath, done)
	})

	grunt.registerTask('generate_data_for_test', 'generate data for test', function () {
		const generateDataForTest = require('./dist/test/task/generateDataForTest')
		const configPath = './src/test/config.yaml'
		const done = this.async()
		generateDataForTest.apply(configPath, done)
	})

	grunt.registerTask('generate_test', 'generate test', function () {
		const generateTest = require('./dist/test/task/generateTest')
		const dataForTestPath = './src/test/dataForTest'
		const databases = ['mysql', 'postgres']
		const done = this.async()
		generateTest.apply(dataForTestPath, databases, done)
	})

	// Default task(s).
	// grunt.registerTask('default', ['populate_source'])
	grunt.registerTask('build_test', ['create_dbs', 'populate_source', 'populate_databases', 'generate_data_for_test', 'generate_test', 'drop_dbs'])
	grunt.registerTask('default', [])
}

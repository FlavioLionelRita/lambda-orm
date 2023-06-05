import { SchemaFacade } from '../../schema/application'
import { ExpressionFacade } from '../../expressions/application'
import { LanguagesService } from '../../language/application'
import { StageMappingService, StageModelService } from './services/stateService'
import { Helper } from '../../shared/application'
import { QueryOptions } from '../../query/domain'
import { StageActionDDL } from './useCases/base/actionDDL'
import { StageClean } from './useCases/clean'
import { StageDelete } from './useCases/delete'
import { StageExport } from './useCases/export'
import { StageImport } from './useCases/import'
import { StageTruncate } from './useCases/truncate'
import { StageSync } from './useCases/sync'
import { Executor } from '../../execution/domain'

export class StageFacade {
	private stageModelService: StageModelService
	private stageMappingService: StageMappingService

	constructor (private readonly schemaFacade: SchemaFacade,
		private readonly expression: ExpressionFacade,
		private readonly executor: Executor,
		private readonly languages: LanguagesService,
		private readonly helper:Helper) {
		this.stageMappingService = new StageMappingService(schemaFacade, this.helper)
		this.stageModelService = new StageModelService(schemaFacade, this.helper)
	}

	public async exists (name:string) {
		const file = this.stageModelService.getFile(name)
		return this.helper.fs.exists(file)
	}

	public sync (options?:QueryOptions):StageActionDDL {
		const _options = this.expression.solveOptions(options)
		return new StageSync(this.executor, this.stageModelService, this.schemaFacade, this.languages, _options, this.helper)
	}

	public clean (options?:QueryOptions):StageActionDDL {
		const _options = this.expression.solveOptions(options)
		return new StageClean(this.executor, this.stageModelService, this.stageMappingService, this.schemaFacade, this.languages, _options, this.helper)
	}

	public truncate (options?:QueryOptions):StageActionDDL {
		const _options = this.expression.solveOptions(options)
		return new StageTruncate(this.executor, this.stageModelService, this.schemaFacade, this.languages, _options, this.helper)
	}

	public delete (options?:QueryOptions):StageDelete {
		const _options = this.expression.solveOptions(options)
		return new StageDelete(this.stageMappingService, this.schemaFacade.model, this.expression, this.executor, _options)
	}

	public export (options?:QueryOptions):StageExport {
		const _options = this.expression.solveOptions(options)
		return new StageExport(this.stageMappingService, this.schemaFacade.model, this.expression, this.executor, _options)
	}

	public import (options?:QueryOptions):StageImport {
		const _options = this.expression.solveOptions(options)
		return new StageImport(this.stageMappingService, this.schemaFacade.model, this.expression, this.executor, _options)
	}
}

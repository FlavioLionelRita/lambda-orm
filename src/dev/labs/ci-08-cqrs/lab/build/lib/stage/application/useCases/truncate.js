"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageTruncate = void 0;
const application_1 = require("../../../language/application");
const actionDDL_1 = require("./base/actionDDL");
class StageTruncate extends actionDDL_1.StageActionDDL {
    queries() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.stageModelService.get(this.options.stage);
            if (state && state.mappings) {
                return new application_1.DDLBuilderService(this.schemaState, this.languages, this.options.stage, this.helper).truncate(state.mappings);
            }
            return [];
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const queries = yield this.queries();
            const result = yield this.executor.executeList(queries, this.options);
            yield this.stageModelService.ddl(this.options.stage, 'trunc', queries);
            return result;
        });
    }
}
exports.StageTruncate = StageTruncate;
//# sourceMappingURL=truncate.js.map
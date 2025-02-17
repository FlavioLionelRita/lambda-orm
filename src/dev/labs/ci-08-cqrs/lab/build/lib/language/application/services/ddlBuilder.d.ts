import { Mapping, SchemaState } from 'lambdaorm-base';
import { Query } from '../../../query/domain';
import { OrmH3lp } from '../../../shared/infrastructure';
import { LanguagesService } from './languagesService';
export declare class DDLBuilderService {
    private readonly schemaState;
    private readonly languages;
    readonly stage: string;
    private readonly helper;
    private domain;
    constructor(schemaState: SchemaState, languages: LanguagesService, stage: string, helper: OrmH3lp);
    drop(mappings: Mapping[]): Query[];
    truncate(mappings: Mapping[]): Query[];
    sync(mappings: Mapping[]): Query[];
    private _sync;
    private _drop;
    private _dropRelations;
    private _dropRelation;
    private _dropEntity;
    private _dropIndexes;
    private _truncate;
    private _syncRemoveForEntitiesChanges;
    private _syncRemovePrimaryKey;
    private _syncRemoveUniqueKey;
    private _syncRemoveIndexForChanges;
    private _syncRemoveFkForChanges;
    private _syncRemoveForRemovedEntities;
    private _syncCreateEntities;
    private _syncCreateForEntitiesChanges;
    private _syncAddPropertyForEntitiesChanges;
    private _syncModifyPropertyForEntitiesChanges;
    private _syncRemovePropertyForEntityChanges;
    private _syncCreatePkForChangesInEntity;
    private _syncCreateUkForChangesInEntity;
    private _syncCreateIndexesForChangesInEntity;
    private _syncCreateFksForChangesInEntity;
    private _syncCreateSequencesForChangesInEntity;
    private _syncCreateForNewEntities;
    private _syncCreateFksForNewEntity;
    private _syncCreateIndexesForNewEntity;
    private evalDataSource;
    private builder;
    private addQuery;
    private changeRelation;
    private equal;
}

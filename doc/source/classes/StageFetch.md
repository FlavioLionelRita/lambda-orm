[Lambda ORM](../README.md) / StageFetch

# Class: StageFetch

## Table of contents

### Constructors

- [constructor](StageFetch.md#constructor)

### Methods

- [execute](StageFetch.md#execute)

## Constructors

### constructor

• **new StageFetch**(`executor`, `schemaState`, `languages`, `helper`, `options`): [`StageFetch`](StageFetch.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `executor` | [`Executor`](../interfaces/Executor.md) |
| `schemaState` | [`SchemaState`](SchemaState.md) |
| `languages` | [`LanguagesService`](LanguagesService.md) |
| `helper` | [`SchemaHelper`](SchemaHelper.md) |
| `options` | [`QueryOptions`](../interfaces/QueryOptions.md) |

#### Returns

[`StageFetch`](StageFetch.md)

#### Defined in

[src/lib/stage/application/useCases/fetch.ts:7](https://github.com/lambda-orm/lambdaorm/blob/d1b498ee2dcb0adac2059644725f796da18ff3ea/src/lib/stage/application/useCases/fetch.ts#L7)

## Methods

### execute

▸ **execute**(): `Promise`\<[`Mapping`](../interfaces/Mapping.md)[]\>

#### Returns

`Promise`\<[`Mapping`](../interfaces/Mapping.md)[]\>

#### Defined in

[src/lib/stage/application/useCases/fetch.ts:15](https://github.com/lambda-orm/lambdaorm/blob/d1b498ee2dcb0adac2059644725f796da18ff3ea/src/lib/stage/application/useCases/fetch.ts#L15)
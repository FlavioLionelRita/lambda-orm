[**Lambda ORM**](../README.md) • **Docs**

***

[Lambda ORM](../README.md) / Executor

# Interface: Executor

## Extended by

- [`ObservableExecutorDecorator`](ObservableExecutorDecorator.md)

## Methods

### execute()

> **execute**(`query`, `data`, `options`): `Promise`\<`any`\>

#### Parameters

• **query**: [`Query`](../classes/Query.md)

• **data**: `any`

• **options**: [`QueryOptions`](QueryOptions.md)

#### Returns

`Promise`\<`any`\>

#### Source

[src/lib/execution/domain/executor.ts:46](https://github.com/lambda-orm/lambdaorm/blob/cfdea01485e47d6bfb9f5073528259581c5e1563/src/lib/execution/domain/executor.ts#L46)

***

### executeList()

> **executeList**(`queries`, `options`): `Promise`\<[`ExecuteResult`](ExecuteResult.md)[]\>

#### Parameters

• **queries**: [`Query`](../classes/Query.md)[]

• **options**: [`QueryOptions`](QueryOptions.md)

#### Returns

`Promise`\<[`ExecuteResult`](ExecuteResult.md)[]\>

#### Source

[src/lib/execution/domain/executor.ts:47](https://github.com/lambda-orm/lambdaorm/blob/cfdea01485e47d6bfb9f5073528259581c5e1563/src/lib/execution/domain/executor.ts#L47)

***

### transaction()

> **transaction**(`options`, `callback`): `Promise`\<`void`\>

#### Parameters

• **options**: [`QueryOptions`](QueryOptions.md)

• **callback**

#### Returns

`Promise`\<`void`\>

#### Source

[src/lib/execution/domain/executor.ts:48](https://github.com/lambda-orm/lambdaorm/blob/cfdea01485e47d6bfb9f5073528259581c5e1563/src/lib/execution/domain/executor.ts#L48)

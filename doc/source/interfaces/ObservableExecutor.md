[**Lambda ORM**](../README.md) • **Docs**

***

[Lambda ORM](../README.md) / ObservableExecutor

# Interface: ObservableExecutor

## Extended by

- [`ObservableExecutorDecorator`](ObservableExecutorDecorator.md)

## Methods

### subscribe()

> **subscribe**(`observer`): `void`

#### Parameters

• **observer**: [`ActionObserver`](../classes/ActionObserver.md)

#### Returns

`void`

#### Source

[src/lib/execution/domain/executor.ts:52](https://github.com/lambda-orm/lambdaorm/blob/cfdea01485e47d6bfb9f5073528259581c5e1563/src/lib/execution/domain/executor.ts#L52)

***

### unsubscribe()

> **unsubscribe**(`observer`): `void`

#### Parameters

• **observer**: [`ActionObserver`](../classes/ActionObserver.md)

#### Returns

`void`

#### Source

[src/lib/execution/domain/executor.ts:53](https://github.com/lambda-orm/lambdaorm/blob/cfdea01485e47d6bfb9f5073528259581c5e1563/src/lib/execution/domain/executor.ts#L53)

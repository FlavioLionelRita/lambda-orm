[Lambda ORM](../README.md) / [model](../modules/model.md) / Delete

# Class: Delete

[model](../modules/model.md).Delete

## Hierarchy

- `ArrowFunction`

  ↳ **`Delete`**

## Table of contents

### Constructors

- [constructor](model.Delete.md#constructor)

### Properties

- [alias](model.Delete.md#alias)
- [children](model.Delete.md#children)
- [data](model.Delete.md#data)
- [id](model.Delete.md#id)
- [index](model.Delete.md#index)
- [level](model.Delete.md#level)
- [metadata](model.Delete.md#metadata)
- [name](model.Delete.md#name)
- [parent](model.Delete.md#parent)
- [type](model.Delete.md#type)

### Methods

- [clone](model.Delete.md#clone)
- [eval](model.Delete.md#eval)
- [set](model.Delete.md#set)

## Constructors

### constructor

• **new Delete**(`name`, `children`, `alias`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `children` | `Operand`[] |
| `alias` | `string` |

#### Overrides

ArrowFunction.constructor

#### Defined in

[src/lib/model/operands.ts:86](https://github.com/FlavioLionelRita/lambdaorm/blob/baac5cd/src/lib/model/operands.ts#L86)

## Properties

### alias

• **alias**: `string`

#### Defined in

[src/lib/model/operands.ts:85](https://github.com/FlavioLionelRita/lambdaorm/blob/baac5cd/src/lib/model/operands.ts#L85)

___

### children

• **children**: `Operand`[]

#### Inherited from

ArrowFunction.children

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:10

___

### data

• `Optional` **data**: `Data`

#### Inherited from

ArrowFunction.data

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:59

___

### id

• `Optional` **id**: `string`

#### Inherited from

ArrowFunction.id

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:6

___

### index

• `Optional` **index**: `number`

#### Inherited from

ArrowFunction.index

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:8

___

### level

• `Optional` **level**: `number`

#### Inherited from

ArrowFunction.level

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:9

___

### metadata

• `Optional` **metadata**: `ExpressionConfig`

#### Inherited from

ArrowFunction.metadata

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:52

___

### name

• **name**: `string`

#### Inherited from

ArrowFunction.name

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:4

___

### parent

• `Optional` **parent**: `Operand`

#### Inherited from

ArrowFunction.parent

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:7

___

### type

• **type**: `string`

#### Inherited from

ArrowFunction.type

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:5

## Methods

### clone

▸ **clone**(): `void`

#### Returns

`void`

#### Inherited from

ArrowFunction.clone

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:12

___

### eval

▸ **eval**(): `any`

#### Returns

`any`

#### Inherited from

ArrowFunction.eval

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:53

___

### set

▸ **set**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

ArrowFunction.set

#### Defined in

node_modules/js-expressions/operand/operands.d.ts:13
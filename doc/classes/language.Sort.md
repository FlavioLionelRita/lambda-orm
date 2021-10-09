[Lambda ORM](../README.md) / [language](../modules/language.md) / Sort

# Class: Sort

[language](../modules/language.md).Sort

## Hierarchy

- [`ArrowFunction`](language.ArrowFunction.md)

  ↳ **`Sort`**

## Table of contents

### Constructors

- [constructor](language.Sort.md#constructor)

### Properties

- [children](language.Sort.md#children)
- [context](language.Sort.md#context)
- [id](language.Sort.md#id)
- [index](language.Sort.md#index)
- [level](language.Sort.md#level)
- [metadata](language.Sort.md#metadata)
- [name](language.Sort.md#name)
- [parent](language.Sort.md#parent)
- [type](language.Sort.md#type)

### Methods

- [clone](language.Sort.md#clone)
- [eval](language.Sort.md#eval)
- [set](language.Sort.md#set)

## Constructors

### constructor

• **new Sort**(`name`, `children?`, `type?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `children` | [`Operand`](language.Operand.md)[] | `[]` |
| `type` | `string` | `'any'` |

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[constructor](language.ArrowFunction.md#constructor)

#### Defined in

[language/operands.ts:15](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L15)

## Properties

### children

• **children**: [`Operand`](language.Operand.md)[]

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[children](language.ArrowFunction.md#children)

#### Defined in

[language/operands.ts:14](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L14)

___

### context

• `Optional` **context**: [`Context`](model.Context.md)

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[context](language.ArrowFunction.md#context)

#### Defined in

[language/operands.ts:168](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L168)

___

### id

• `Optional` **id**: `string`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[id](language.ArrowFunction.md#id)

#### Defined in

[language/operands.ts:10](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L10)

___

### index

• `Optional` **index**: `number`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[index](language.ArrowFunction.md#index)

#### Defined in

[language/operands.ts:12](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L12)

___

### level

• `Optional` **level**: `number`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[level](language.ArrowFunction.md#level)

#### Defined in

[language/operands.ts:13](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L13)

___

### metadata

• `Optional` **metadata**: `OperandMetadata`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[metadata](language.ArrowFunction.md#metadata)

#### Defined in

[language/operands.ts:147](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L147)

___

### name

• **name**: `string`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[name](language.ArrowFunction.md#name)

#### Defined in

[language/operands.ts:8](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L8)

___

### parent

• `Optional` **parent**: [`Operand`](language.Operand.md)

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[parent](language.ArrowFunction.md#parent)

#### Defined in

[language/operands.ts:11](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L11)

___

### type

• **type**: `string`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[type](language.ArrowFunction.md#type)

#### Defined in

[language/operands.ts:9](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L9)

## Methods

### clone

▸ **clone**(): `void`

#### Returns

`void`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[clone](language.ArrowFunction.md#clone)

#### Defined in

[language/operands.ts:25](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L25)

___

### eval

▸ **eval**(): `any`

#### Returns

`any`

#### Inherited from

[ArrowFunction](language.ArrowFunction.md).[eval](language.ArrowFunction.md#eval)

#### Defined in

[language/operands.ts:148](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L148)

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

[ArrowFunction](language.ArrowFunction.md).[set](language.ArrowFunction.md#set)

#### Defined in

[language/operands.ts:40](https://github.com/FlavioLionelRita/lambda-orm/blob/eec4cd3/src/orm/language/operands.ts#L40)
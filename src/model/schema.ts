
interface Schema {
    entities: Entity[]
    enums: Enum[]
}
interface Enum {
    name: string
    values: any[]
}
interface Entity {
    name: string
    table: string
    properties:Property[]
    relations:Relation[]
}
interface Property {
    name: string 
    field: string
    type: string
    length?: number
    nullable?: boolean
    primaryKey?: boolean
    autoincrement?: boolean
}
interface Relation {
    name: string
    type: string
    from: string
    to: RelationTo
}    
interface RelationTo {
    entity: string
    property: string
}

export {
    Schema,
    Enum,
    Entity,
    Property,
    Relation,
    RelationTo  
}

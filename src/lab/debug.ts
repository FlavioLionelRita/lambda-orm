import orm from '../orm';
import {Helper} from '../helper';
import '../sintaxis'
import {IOrm,Parameter } from '../model'
import { DatabaseClean } from 'database';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

async function exec(fn:any){
    let t1= Date.now()
    let result = await fn()
    let t2= Date.now()
    console.log(t2-t1)
    if(result){
        if (typeof result === 'string' || result instanceof String)console.log(result);
        else console.log(JSON.stringify(result));
    }
    return result;  
}

interface Test
{
  schema:string
  categories:CategoryTest[]  
}
interface CategoryTest
{
  name:string
  schema:string
  context:any
  test:ExpressionTest[]
  errors?:number  
}
interface ExpressionTest
{
  name:string
  lambda:any
  context?:any
  expression?:string
  model?:any
  fields?:any
  parameters?:Parameter[]
  sentences?:SentenceTest[]
  executions?:ExecutionTest[]
  errors?:number
}
interface SentenceTest
{
  dialect: string
  sentence?: any
  error?:string
}
interface ExecutionTest
{
  database: string
  result?: any
  error?:string
}

async function writeTest(orm:IOrm,databases:string[],category:CategoryTest)
{
  let dialects =  Object.values(orm.language.dialects).filter((p:any)=>p.language=='sql').map((p:any)=> p.name);// ['mysql','postgres','mssql','oracle'];
  category.errors=0;
  for(const q in category.test){  
    let expressionTest = category.test[q] as ExpressionTest;
    expressionTest.sentences=[];
    expressionTest.errors=0;
    for(const r in dialects){
      const dialect = dialects[r];
      let sentence=undefined;
      let error=undefined;         
      try{
        expressionTest.expression = orm.lambda(expressionTest.lambda).expression;
        expressionTest.model = (await orm.expression(expressionTest.expression).compile(dialect,category.schema)).model();
        const serialize:any= (await orm.expression(expressionTest.expression).compile(dialect,category.schema)).serialize();
        expressionTest.parameters =serialize.p; 
        expressionTest.fields =serialize.f;           
        sentence = (await orm.expression(expressionTest.expression).compile(dialect,category.schema)).sentence();        
      }
      catch(err)
      {
        error=err.toString();
      }
      finally
      {
        if(error!=undefined){
          expressionTest.sentences.push({dialect:dialect,error:error});
          expressionTest.errors++;
        }          
        else if(sentence!=undefined)    
          expressionTest.sentences.push({dialect:dialect,sentence:sentence});
        else
          console.error('error sentence '+dialect+' '+category.name+':'+expressionTest.name);
      }
    }
    expressionTest.executions=[];
    for(const p in databases){
      const database = databases[p];
      let result=undefined;
      let error=undefined;   
      try{
        const context =expressionTest.context!=undefined?category.context[expressionTest.context]:{};
        result = await orm.lambda(expressionTest.lambda).execute(context,database);
      }
      catch(err)
      {
        error=err.toString();
      }
      finally
      {
        if(error!=undefined){
          expressionTest.executions.push({database:database,error:error});
          expressionTest.errors++;
        }
        else if(result!=undefined)    
          expressionTest.executions.push({database:database,result:result});
        else
          console.error('error execution '+database+' '+category.name+':'+expressionTest.name); 
      }
    }
    category.errors+=expressionTest.errors;
    expressionTest.lambda=expressionTest.lambda.toString();
  }
  try{     
    let yamlStr = yaml.safeDump(category);
    fs.writeFileSync(path.join('test/config',Helper.replace(category.name,' ','_')+'.yaml'),yamlStr);
  }catch(error){
    console.error(error);
    for(const q in category.test){ 
      try{   
        let expressionTest = category.test[q] as ExpressionTest;
        let yamlStr = yaml.safeDump(expressionTest);
      }catch(error){
        console.error(error);
      }  
    }
  }
}
async function writeQueryTest(orm:IOrm,databases:string[],)
{
  writeTest(orm,databases,{name:'query',schema:'northwind:0.0.2'
  ,context:{ a:{ id: 1}
           , b:{minValue:10,from:'1997-01-01',to:'1997-12-31'}
   }
  ,test:[{name:'query 1',lambda: ()=> Products.map(p=>p)}
        ,{name:'query 2',lambda: ()=> Products}
        ,{name:'query 3',context:'a',lambda: (id:number)=> Products.filter(p=>p.id==id)}
        ,{name:'query 4',context:'a',lambda: ()=> Products.map(p=> p.category.name)}
        ,{name:'query 5',lambda: ()=> Products.map(p=>({category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock}))}
        ,{name:'query 6',lambda: ()=> Products.filter(p=> p.discontinued != false ).map(p=> ({category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock})).sort(p=> [p.category,desc(p.name)]) }
        ,{name:'query 7',context:'b',lambda: (minValue:number,from:Date,to:Date)=>  OrderDetails.filter(p=> between(p.order.shippedDate,from,to) && p.unitPrice > minValue ).map(p=> ({category: p.product.category.name,product:p.product.name,unitPrice:p.unitPrice,quantity:p.quantity})).sort(p=> [p.category,p.product]) }
        ,{name:'query 8',lambda: ()=> OrderDetails.map(p=> ({order: p.orderId,subTotal:sum((p.unitPrice*p.quantity*(1-p.discount/100))*100) }))}
  ]});
}
async function writeNumeriFunctionsTest(orm:IOrm,databases:string[],)
{ 
  writeTest(orm,databases,{name:'numeric functions',schema:'northwind:0.0.2'
  ,context:{ a:{ id: 1}}
  ,test:    
    [{name:'function abs',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id ).map(p=> ({name:p.name,source:p.price*-1 ,result:abs(p.price*-1)}) ) }
    ,{name:'function acos',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:0.25,result:acos(0.25)}))  }
    ,{name:'function asin',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:0.25,result:asin(0.25)})) }
    ,{name:'function atan',context:'a',lambda: (id:number)=>  Products.filter(p=>p.id == id).map(p=>({name:p.name,source:0.25,result:atan(0.25)})) }
    ,{name:'function atan2',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:0.50,result:atan2(0.25,1)})) }
    ,{name:'function ceil',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:25.75,result:ceil(25.75)})) }
    ,{name:'function cos',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:2,result:cos(2)})) }
    ,{name:'function exp',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:1,result:exp(1)})) }
    ,{name:'function floor',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:25.75,result:floor(25.75)})) }
    ,{name:'function ln',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:2,result:ln(2)})) }
    ,{name:'function log',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,m:10,n:20,result:log(10,20)}))  }
    ,{name:'function round',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:135.375,result:round(135.375,2)})) }
    ,{name:'function sign',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:255.5,result:sign(255.5)})) }
    ,{name:'function tan',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:1.75,result:tan(1.75)})) }
    ,{name:'function trunc',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=>({name:p.name,source:135.375,result:trunc(135.375, 2)})) }
  ]});
}  
async function writeGroupByTest(orm:IOrm,databases:string[],)
{    
  writeTest(orm,databases,{name:'groupBy',schema:'northwind:0.0.2'
  ,context:{ a:{ id: 1}}
  ,test:   
    [{name:'groupBy 1',lambda: ()=>  Products.map(p=> ({maxPrice:max(p.price)})) }
    ,{name:'groupBy 2',lambda: ()=> Products.map(p=> ({minPrice:min(p.price)})) }
    ,{name:'groupBy 3',lambda: ()=> Products.map(p=> ({total:sum(p.price)})) }
    ,{name:'groupBy 4',lambda: ()=> Products.map(p=> ({average:avg(p.price)})) }
    ,{name:'groupBy 5',lambda: ()=> Products.map(p=> ({count:count(1)})) }    
    ,{name:'groupBy 6',lambda: ()=> Products.map(p=> ({category:p.categoryId,largestPrice:max(p.price)}))  }
    ,{name:'groupBy 7',lambda: ()=> Products.map(p=> ({category:p.category.name,largestPrice:max(p.price)}))  }
    ,{name:'groupBy 8',context:'a',lambda: (id:number)=> Products.filter(p=>p.id == id).map(p=> ({name:p.name,source:p.price ,result:abs(p.price)}))}
    ,{name:'groupBy 9',lambda: ()=> Products.having(p=> max(p.price)> 100).map(p=> ({category:p.category.name,largestPrice:max(p.price)}))}
    ,{name:'groupBy 10',lambda: ()=> Products.having(p=> max(p.price) > 100).map(p=> ({category:p.category.name,largestPrice:max(p.price)})).sort(p=> desc(p.largestPrice))  }
    ,{name:'groupBy 11',lambda: ()=> Products.filter(p=> p.price>5 ).having(p=> max(p.price) > 50).map(p=> ({category:p.category.name,largestPrice:max(p.price)})).sort(p=> desc(p.largestPrice))  }
  ]});  
}
async function writeIncludeTest(orm:IOrm,databases:string[],)
{     
  writeTest(orm,databases,{name:'include',schema:'northwind:0.0.2'
  ,context:{ a:{ id: 1}}
  ,test:    
    [{name:'include 1',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => p.customer)}
    ,{name:'include 2',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => p.details)}
    ,{name:'include 3',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => [p.details,p.customer])}
    ,{name:'include 4',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product),p.customer])}
    ,{name:'include 5',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product.include(p=>p.category)),p.customer])}
    ,{name:'include 6',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => [p.details.map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})) ,p.customer])}
    ,{name:'include 7',context:'a',lambda: (id:number)=> Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product).map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})),p.customer])}
  ]}); 
}
async function writeInsertsTest(orm:IOrm,databases:string[],)
{  
  writeTest(orm,databases,{name:'inserts',schema:'northwind:0.0.2'
  ,context:{ a:{name: "Beverages20", description: "Soft drinks, coffees, teas, beers, and ales" }
            ,b:{name: "Beverages21", description: "Soft drinks, coffees, teas, beers, and ales" }
            ,c:{entity:{name: "Beverages22", description: "Soft drinks, coffees, teas, beers, and ales" }}
           , order : {
              "customerId": "VINET",
              "employeeId": 5,
              "orderDate": "1996-07-03T22:00:00.000Z",
              "requiredDate": "1996-07-31T22:00:00.000Z",
              "shippedDate": "1996-07-15T22:00:00.000Z",
              "shipViaId": 3,
              "freight": 32.38,
              "name": "Vins et alcools Chevalier",
              "address": "59 rue de l-Abbaye",
              "city": "Reims",
              "region": null,
              "postalCode": "51100",
              "country": "France",
              "details": [
                {
                  "productId": 11,
                  "unitPrice": 14,
                  "quantity": 12,
                  "discount": 10
                },
                {
                  "productId": 42,
                  "unitPrice": 9.8,
                  "quantity": 10,
                  "discount": 10
                },
                {
                  "productId": 72,
                  "unitPrice": 34.8,
                  "quantity": 5,
                  "discount": 10
                }
              ]
            }
 }
  ,test:  
    [{name:'insert 1',context:'a',lambda: ()=> Categories.insert()}
    ,{name:'insert 2',context:'b',lambda: (name:string,description:string)=> Categories.insert({name:name,description:description})}  
    ,{name:'insert 3',context:'c',lambda: (entity:Category)=> Categories.insert(entity) }  
    ,{name:'insert 4',context:'order',lambda: ()=> Orders.insert() }
    ,{name:'insert 5',context:'order',lambda: ()=> Orders.insert().include(p=> p.details) }
    ,{name:'insert 6',context:'order',lambda: ()=> Orders.insert().include(p=> [p.details,p.customer]) }    
  ]});  
}
async function writeUpdateTest(orm:IOrm,databases:string[],)
{    
  writeTest(orm,databases,{name:'update',schema:'northwind:0.0.2'
,context:{
          a:{
              "id": 7,
              "customerId": "ANATR",
              "employeeId": 7,
              "orderDate": "1996-09-17T22:00:00.000Z",
              "requiredDate": "1996-10-15T22:00:00.000Z",
              "shippedDate": "1996-09-23T22:00:00.000Z",
              "shipViaId": 3,
              "freight": "1.6100",
              "name": "Ana Trujillo Emparedados y helados",
              "address": "Avda. de la Constitucin 2222",
              "city": "Mxico D.F.",
              "region": null,
              "postalCode": "5021",
              "country": "Mexico",
              "details": [
                {
                  "orderId": 7,
                  "productId": 69,
                  "unitPrice": "28.8000",
                  "quantity": "1.0000",
                  "discount": "0.0000"
                },
                {
                  "orderId": 7,
                  "productId": 70,
                  "unitPrice": "12.0000",
                  "quantity": "5.0000",
                  "discount": "0.0000"
                }
              ]
            }
            , b:{entity:{
                  "id": 8,
                  "customerId": "ANATR",
                  "employeeId": 3,
                  "orderDate": "1997-08-07T22:00:00.000Z",
                  "requiredDate": "1997-09-04T22:00:00.000Z",
                  "shippedDate": "1997-08-13T22:00:00.000Z",
                  "shipViaId": 1,
                  "freight": "43.9000",
                  "name": "Ana Trujillo Emparedados y helados",
                  "address": "Avda. de la Constitucin 2222",
                  "city": "Mxico D.F.",
                  "region": null,
                  "postalCode": "5021",
                  "country": "Mexico",
                  "details": [
                    {
                      "orderId": 8,
                      "productId": 14,
                      "unitPrice": "23.2500",
                      "quantity": "3.0000",
                      "discount": "0.0000"
                    },
                    {
                      "orderId": 8,
                      "productId": 42,
                      "unitPrice": "14.0000",
                      "quantity": "5.0000",
                      "discount": "0.0000"
                    },
                    {
                      "orderId": 8,
                      "productId": 60,
                      "unitPrice": "34.0000",
                      "quantity": "10.0000",
                      "discount": "0.0000"
                    }
                  ]
                }
              }
            , c:{postalCode:'xxx'}
            , d:{ "id": "ALFKI",
                  "name": "Alfreds Futterkiste",
                  "contact": "Maria Anders",
                  "phone": "Sales Representative",
                  "address": "Obere Str. 57",
                  "city": "Berlin",
                  "region": null,
                  "postalCode": "12209",
                  "country": "Germany",
                  "orders": [
                    {
                      "id": 1,
                      "customerId": "ALFKI",
                      "employeeId": 6,
                      "orderDate": "1997-08-24T22:00:00.000Z",
                      "requiredDate": "1997-09-21T22:00:00.000Z",
                      "shippedDate": "1997-09-01T22:00:00.000Z",
                      "shipViaId": 1,
                      "freight": "29.4600",
                      "name": "Alfreds Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 1,
                          "productId": 28,
                          "unitPrice": "45.6000",
                          "quantity": "15.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 1,
                          "productId": 39,
                          "unitPrice": "18.0000",
                          "quantity": "21.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 1,
                          "productId": 46,
                          "unitPrice": "12.0000",
                          "quantity": "2.0000",
                          "discount": "0.0000"
                        }
                      ]
                    },
                    {
                      "id": 2,
                      "customerId": "ALFKI",
                      "employeeId": 4,
                      "orderDate": "1997-10-02T22:00:00.000Z",
                      "requiredDate": "1997-10-30T23:00:00.000Z",
                      "shippedDate": "1997-10-12T22:00:00.000Z",
                      "shipViaId": 2,
                      "freight": "61.0200",
                      "name": "Alfred-s Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 2,
                          "productId": 63,
                          "unitPrice": "43.9000",
                          "quantity": "20.0000",
                          "discount": "0.0000"
                        }
                      ]
                    },
                    {
                      "id": 3,
                      "customerId": "ALFKI",
                      "employeeId": 4,
                      "orderDate": "1997-10-12T22:00:00.000Z",
                      "requiredDate": "1997-11-23T23:00:00.000Z",
                      "shippedDate": "1997-10-20T22:00:00.000Z",
                      "shipViaId": 1,
                      "freight": "23.9400",
                      "name": "Alfred-s Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 3,
                          "productId": 3,
                          "unitPrice": "10.0000",
                          "quantity": "6.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 3,
                          "productId": 76,
                          "unitPrice": "18.0000",
                          "quantity": "15.0000",
                          "discount": "0.0000"
                        }
                      ]
                    },
                    {
                      "id": 4,
                      "customerId": "ALFKI",
                      "employeeId": 1,
                      "orderDate": "1998-01-14T23:00:00.000Z",
                      "requiredDate": "1998-02-11T23:00:00.000Z",
                      "shippedDate": "1998-01-20T23:00:00.000Z",
                      "shipViaId": 3,
                      "freight": "69.5300",
                      "name": "Alfred-s Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 4,
                          "productId": 59,
                          "unitPrice": "55.0000",
                          "quantity": "15.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 4,
                          "productId": 77,
                          "unitPrice": "13.0000",
                          "quantity": "2.0000",
                          "discount": "0.0000"
                        }
                      ]
                    },
                    {
                      "id": 5,
                      "customerId": "ALFKI",
                      "employeeId": 1,
                      "orderDate": "1998-03-15T23:00:00.000Z",
                      "requiredDate": "1998-04-26T22:00:00.000Z",
                      "shippedDate": "1998-03-23T23:00:00.000Z",
                      "shipViaId": 1,
                      "freight": "40.4200",
                      "name": "Alfred-s Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 5,
                          "productId": 6,
                          "unitPrice": "25.0000",
                          "quantity": "16.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 5,
                          "productId": 28,
                          "unitPrice": "45.6000",
                          "quantity": "2.0000",
                          "discount": "0.0000"
                        }
                      ]
                    },
                    {
                      "id": 6,
                      "customerId": "ALFKI",
                      "employeeId": 3,
                      "orderDate": "1998-04-08T22:00:00.000Z",
                      "requiredDate": "1998-05-06T22:00:00.000Z",
                      "shippedDate": "1998-04-12T22:00:00.000Z",
                      "shipViaId": 1,
                      "freight": "1.2100",
                      "name": "Alfred-s Futterkiste",
                      "address": "Obere Str. 57",
                      "city": "Berlin",
                      "region": null,
                      "postalCode": "12209",
                      "country": "Germany",
                      "details": [
                        {
                          "orderId": 6,
                          "productId": 58,
                          "unitPrice": "13.2500",
                          "quantity": "40.0000",
                          "discount": "0.0000"
                        },
                        {
                          "orderId": 6,
                          "productId": 71,
                          "unitPrice": "21.5000",
                          "quantity": "20.0000",
                          "discount": "0.0000"
                        }
                      ]
                    }
                  ]
                }
          }
  ,test:  
    [{name:'update 1',context:'a',lambda: ()=> Orders.update()}
    ,{name:'update 2',context:'b',lambda: (entity:Order)=> Orders.update(entity)}
    ,{name:'update 3',context:'c',lambda: (postalCode:string)=> Orders.updateAll({postalCode:postalCode})}
    ,{name:'update 4',context:'b',lambda: (entity:Order)=> Orders.update({name:entity.name}).filter(p=> p.id == entity.id)}
    ,{name:'update 5',context:'b',lambda: (entity:Order)=> Orders.update({name:entity.name}).include(p=> p.details.update(p=> ({unitPrice:p.unitPrice,productId:p.productId }))).filter(p=> p.id == entity.id )   }
    ,{name:'update 6',context:'a',lambda: ()=> Orders.update().include(p=> p.details)}
    ,{name:'update 7',context:'c',lambda: ()=> Customers.update().include(p=> p.orders.include(p=> p.details))}
  ]});  
}
async function writeDeleteTest(orm:IOrm,databases:string[],)
{     
  writeTest(orm,databases,{name:'delete',schema:'northwind:0.0.2'
  ,context:{ 
            a: {id:9} 
           ,b: {
              "id": 1,
              "customerId": "ALFKI",
              "employeeId": 6,
              "orderDate": "1997-08-24T22:00:00.000Z",
              "requiredDate": "1997-09-21T22:00:00.000Z",
              "shippedDate": "1997-09-01T22:00:00.000Z",
              "shipViaId": 1,
              "freight": "29.4600",
              "name": "Alfreds Futterkiste",
              "address": "Obere Str. 57",
              "city": "Berlin",
              "region": null,
              "postalCode": "12209",
              "country": "Germany",
              "details": [
                {
                  "orderId": 1,
                  "productId": 28,
                  "unitPrice": "45.6000",
                  "quantity": "15.0000",
                  "discount": "0.0000"
                },
                {
                  "orderId": 1,
                  "productId": 39,
                  "unitPrice": "18.0000",
                  "quantity": "21.0000",
                  "discount": "0.0000"
                },
                {
                  "orderId": 1,
                  "productId": 46,
                  "unitPrice": "12.0000",
                  "quantity": "2.0000",
                  "discount": "0.0000"
                }
              ]
            }
           ,c: {
                "id": 2,
                "customerId": "ALFKI",
                "employeeId": 4,
                "orderDate": "1997-10-02T22:00:00.000Z",
                "requiredDate": "1997-10-30T23:00:00.000Z",
                "shippedDate": "1997-10-12T22:00:00.000Z",
                "shipViaId": 2,
                "freight": "61.0200",
                "name": "Alfred-s Futterkiste",
                "address": "Obere Str. 57",
                "city": "Berlin",
                "region": null,
                "postalCode": "12209",
                "country": "Germany",
                "details": [
                  {
                    "orderId": 2,
                    "productId": 63,
                    "unitPrice": "43.9000",
                    "quantity": "20.0000",
                    "discount": "0.0000"
                  }
                ]
              } 
           ,d:{
                "id": 4,
                "customerId": "ALFKI",
                "employeeId": 1,
                "orderDate": "1998-01-14T23:00:00.000Z",
                "requiredDate": "1998-02-11T23:00:00.000Z",
                "shippedDate": "1998-01-20T23:00:00.000Z",
                "shipViaId": 3,
                "freight": "69.5300",
                "name": "Alfred-s Futterkiste",
                "address": "Obere Str. 57",
                "city": "Berlin",
                "region": null,
                "postalCode": "12209",
                "country": "Germany",
                "details": [
                  {
                    "orderId": 4,
                    "productId": 59,
                    "unitPrice": "55.0000",
                    "quantity": "15.0000",
                    "discount": "0.0000"
                  },
                  {
                    "orderId": 4,
                    "productId": 77,
                    "unitPrice": "13.0000",
                    "quantity": "2.0000",
                    "discount": "0.0000"
                  }
                ]
              }
          ,e: {entity:{
                  "orderId": 5,
                  "productId": 6,
                  "unitPrice": "25.0000",
                  "quantity": "16.0000",
                  "discount": "0.0000"
                }}   
          ,f:{entity: {
                    "id": 5,
                    "customerId": "ALFKI",
                    "employeeId": 1,
                    "orderDate": "1998-03-15T23:00:00.000Z",
                    "requiredDate": "1998-04-26T22:00:00.000Z",
                    "shippedDate": "1998-03-23T23:00:00.000Z",
                    "shipViaId": 1,
                    "freight": "40.4200",
                    "name": "Alfred-s Futterkiste",
                    "address": "Obere Str. 57",
                    "city": "Berlin",
                    "region": null,
                    "postalCode": "12209",
                    "country": "Germany",
                    "details": [
                      {
                      "orderId": 5,
                      "productId": 6,
                      "unitPrice": "25.0000",
                      "quantity": "16.0000",
                      "discount": "0.0000"
                    },
                  {
                    "orderId": 5,
                    "productId": 28,
                    "unitPrice": "45.6000",
                    "quantity": "2.0000",
                    "discount": "0.0000"
                  }
                ]
              }                   
             }    
           }
  ,test:  
    [{name:'delete 1',context:'a',lambda: (id:number)=> OrderDetails.delete().filter(p=> p.orderId == id)  }    
    ,{name:'delete 2',context:'b',lambda: (id:number)=> Orders.delete().include(p=> p.details)  }
    ,{name:'delete 3',context:'c',lambda: (id:number)=> Orders.delete().filter(p=> p.id == id).include(p=> p.details)   }
    ,{name:'delete 4',context:'d',lambda: ()=> Orders.delete().include(p=> p.details) }
    ,{name:'delete 4',context:'d',lambda: (entity:OrderDetail)=> OrderDetails.delete(entity) }
    ,{name:'delete 5',context:'e',lambda: (entity:Order)=> Orders.delete(entity).include(p=> p.details) }
    ,{name:'delete 6',lambda: ()=> OrderDetails.deleteAll() }
  ]}); 
}
//TODO: add delete on cascade , example Orders.delete().cascade(p=> p.details) 
async function writeBulkInsertTest(orm:IOrm,databases:string[],)
{    
  writeTest(orm,databases,{name:'bulkInsert',schema:'northwind:0.0.2'
  ,context:{a: [{
                  name: "Beverages4",
                  description: "Soft drinks, coffees, teas, beers, and ales"
                },
                {
                  name: "Condiments4",
                  description: "Sweet and savory sauces, relishes, spreads, and seasonings"
                }
              ]
           ,b: [
            {
              
              "customerId": "ALFKI",
              "employeeId": 6,
              "orderDate": "1997-08-24T22:00:00.000Z",
              "requiredDate": "1997-09-21T22:00:00.000Z",
              "shippedDate": "1997-09-01T22:00:00.000Z",
              "shipViaId": 1,
              "freight": "29.4600",
              "name": "Alfreds Futterkiste",
              "address": "Obere Str. 57",
              "city": "Berlin",
              "region": null,
              "postalCode": "12209",
              "country": "Germany",
              "details": [
                {          
                  "productId": 28,
                  "unitPrice": "45.6000",
                  "quantity": 15,
                  "discount": 0
                },
                {
                  "productId": 39,
                  "unitPrice": "18.0000",
                  "quantity": 21,
                  "discount": 0
                },
                {          
                  "productId": 46,
                  "unitPrice": "12.0000",
                  "quantity": 2,
                  "discount": 0
                }
              ]
            },
            {      
              "customerId": "ALFKI",
              "employeeId": 4,
              "orderDate": "1997-10-02T22:00:00.000Z",
              "requiredDate": "1997-10-30T23:00:00.000Z",
              "shippedDate": "1997-10-12T22:00:00.000Z",
              "shipViaId": 2,
              "freight": "61.0200",
              "name": "Alfred-s Futterkiste",
              "address": "Obere Str. 57",
              "city": "Berlin",
              "region": null,
              "postalCode": "12209",
              "country": "Germany",
              "details": [
                {          
                  "productId": 63,
                  "unitPrice": "43.9000",
                  "quantity": 20,
                  "discount": 0
                }
              ]
            },
            {      
              "customerId": "ALFKI",
              "employeeId": 4,
              "orderDate": "1997-10-12T22:00:00.000Z",
              "requiredDate": "1997-11-23T23:00:00.000Z",
              "shippedDate": "1997-10-20T22:00:00.000Z",
              "shipViaId": 1,
              "freight": "23.9400",
              "name": "Alfred-s Futterkiste",
              "address": "Obere Str. 57",
              "city": "Berlin",
              "region": null,
              "postalCode": "12209",
              "country": "Germany",
              "details": [
                {          
                  "productId": 3,
                  "unitPrice": "10.0000",
                  "quantity": 6,
                  "discount": 0
                },
                {          
                  "productId": 76,
                  "unitPrice": "18.0000",
                  "quantity": 15,
                  "discount": 0
                }
              ]
            },
          ]  

   }
  ,test:  
    [{name:'bulkInsert 1',context:'a',lambda: ()=> Categories.bulkInsert() }
    ,{name:'bulkInsert 2',context:'b',lambda: ()=> Orders.bulkInsert().include(p=> p.details) } 
  ]});
}
async function queries(orm:IOrm)
{  
  const expression = ()=> Customers.include(p=> p.orders.include(p => p.details))
  //  Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product.include(p=>p.category)),p.customer])
  let context:any = {id:10248};
  // await exec( async()=>(await orm.expression(expression).parse()).serialize())
  await exec( async()=>(await orm.lambda(expression).compile('mysql','northwind')).serialize())
  // await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).sentence())
  // await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).model())
  await exec(async()=>(await orm.lambda(expression).execute(context,'source')));

  //queries
  //  Products.filter(p=>p.id==id)
  //  Products.map(p=> {category:p.category.name,largestPrice:max(p.price)})
  //  Products.filter(p=>p.id == id ).map(p=> {name:p.name,source:p.price ,result:abs(p.price)} )
  //  Products.map(p=>({category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock}))
  //  Products.filter(p=> p.discontinued != false )                 
  //                  .map(p=> ({category:p.category.name,name:p.name,quantity:p.quantity,inStock:p.inStock}) )
  //                  .sort(p=> [p.category,desc(p.name)])
  //  OrderDetails.filter(p=> between(p.order.shippedDate,'19970101','19971231') && p.unitPrice > minValue )                 
  //              .map(p=> ({category: p.product.category.name,product:p.product.name,unitPrice:p.unitPrice,quantity:p.quantity}))
  //              .sort(p=> [p.category,p.product])       
  //  OrderDetails.map(p=> ({order: p.orderId,subTotal:sum((p.unitPrice*p.quantity*(1-p.discount/100))*100) }))

  //includes
  //  Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product).map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})),p.customer])
  //  Orders.filter(p=>p.id==id).include(p => [p.details.map(p=>({quantity:p.quantity,unitPrice:p.unitPrice,productId:p.productId})) ,p.customer])
  //  Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product.include(p=>p.category)),p.customer])
  //  Orders.filter(p=>p.id==id).include(p => [p.details.include(q=>q.product),p.customer])
  //  Orders.filter(p=>p.id==id).include(p => [p.details,p.customer])
  //  Orders.filter(p=>p.id==id).include(p => p.details)
  //  Orders.filter(p=>p.id==id).include(p => p.customer)

  
}
async function modify(orm:IOrm){

  const expression =
  ` 
  Orders.insert().include(p=> p.details)
  `;
    
  // await exec( async()=>(await orm.expression(expression).parse()).serialize())
  await exec( async()=>(await orm.expression(expression).compile('mysql','northwind')).serialize())
  //await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).sentence())
  // await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).schema())
  
  // let result = await exec(async()=>(await orm.expression(expression).execute(context,'source')));
  // console.log(result.length);
  
 //modify
//  Products.insert()

//  Orders.insert()
//  Orders.insert({name:name,customerId:customerId,shippedDate:shippedDate})
//  Orders.insert({name:o.name,customerId:o.customerId,shippedDate:o.shippedDate})
//  Orders.insert().include(p=> p.details)
//  Orders.insert().include(p=> [p.details,p.customer])
//  Orders.insert(entity).include(p=> [p.details,p.customer])

//  Orders.update()
//  Orders.update(entity)
//  Orders.update({name:entity.name}) //da error por que preciso definir filter
//  Orders.update({name:entity.name}).filter(p=> p.id == entity.id)
//  Orders.update({name:entity.name}).include(p=> p.details.update(p=> ({unitPrice:p.unitPrice,productId:p.productId }))).filter(p=> p.id == entity.id )
//  Orders.update().include(p=> p.details)
//  Orders.update().include(p=> [p.details,p.customer])

//  Orders.delete().filter(p=> p.id == id)
//  Orders.delete().include(p=> p.details)
//  Orders.delete().filter(p=> p.id == id).include(p=> p.details)


  
}
async function crud(orm:IOrm){

  let order = {
    "customerId": "VINET",
    "employeeId": 5,
    "orderDate": "1996-07-03T22:00:00.000Z",
    "requiredDate": "1996-07-31T22:00:00.000Z",
    "shippedDate": "1996-07-15T22:00:00.000Z",
    "shipViaId": 3,
    "freight": 32.38,
    "name": "Vins et alcools Chevalier",
    "address": "59 rue de l-Abbaye",
    "city": "Reims",
    "region": null,
    "postalCode": "51100",
    "country": "France",
    "details": [
      {
        "productId": 11,
        "unitPrice": 14,
        "quantity": 12,
        "discount": false
      },
      {
        "productId": 42,
        "unitPrice": 9.8,
        "quantity": 10,
        "discount": false
      },
      {
        "productId": 72,
        "unitPrice": 34.8,
        "quantity": 5,
        "discount": false
      }
    ]
  };

  try{
      orm.transaction('default',async (tr )=>{    
        //create order
        let orderId = await exec(async()=>(await orm.expression("Orders.insert().include(p => p.details)").execute(order,'source',tr)));
        //get order
        let result = await exec(async()=>(await orm.expression("Orders.filter(p=> p.id == id).include(p => p.details)").execute({id:orderId},'source',tr)));
        let order2 = result[0];
        //updated order
        order2.address = "changed 59 rue de l-Abbaye";
        order2.details[0].discount= true;
        order2.details[1].unitPrice= 10;
        order2.details[2].quantity= 7;
        let updateCount = await exec(async()=>(await orm.expression("Orders.update().include(p => p.details)").execute(order2,'source',tr)));
        console.log(updateCount);
        //get order
        let order3 = await exec(async()=>(await orm.expression("Orders.filter(p=> p.id == id).include(p => p.details)").execute({id:orderId},'source',tr)));
        console.log(JSON.stringify(order3));
        // delete
        let deleteCount = await exec(async()=>(await orm.expression("Orders.delete().include(p=> p.details)").execute(order3[0],'source',tr)));
        console.log(deleteCount);
        //get order
        let order4 = await exec(async()=>(await orm.expression("Orders.filter(p=> p.id == id).include(p => p.details)").execute({id:orderId},'source',tr)));
        console.log(JSON.stringify(order4));
      });
  }
  catch(error){
    console.log(error);
  }
}
// async function scriptsByDialect(orm:IOrm,schemaName:string){ 
//   const schema= orm.schema.get(schemaName) as Schema;
//   for(const name in orm.languages['sql'].dialects){
//     console.log('\n\n'+name+' -------------------------------------\n');
//     await exec( async()=>(orm.schema.sync(schema).sentence(name)));
//   } 
// }
// 

async function bulkInsert(orm:IOrm){
  const expression =`Categories.bulkInsert()`;
  const categories =[
    {
      name: "Beverages2",
      description: "Soft drinks, coffees, teas, beers, and ales"
    },
    {
      name: "Condiments2",
      description: "Sweet and savory sauces, relishes, spreads, and seasonings"
    }
  ];

  //await exec( async()=>(await orm.expression(expression).parse()).serialize())
  //await exec( async()=>(await orm.expression(expression).compile('mysql','northwind')).serialize())
  //await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).sentence())
  // await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).schema())
  let result = await exec(async()=>(await orm.expression(expression).execute(categories,'source')));
}
async function bulkInsert2(orm:IOrm){
  const expression = `Orders.bulkInsert().include(p=> p.details)`;
  const orders= [
    {
      
      "customerId": "ALFKI",
      "employeeId": 6,
      "orderDate": "1997-08-24T22:00:00.000Z",
      "requiredDate": "1997-09-21T22:00:00.000Z",
      "shippedDate": "1997-09-01T22:00:00.000Z",
      "shipViaId": 1,
      "freight": "29.4600",
      "name": "Alfreds Futterkiste",
      "address": "Obere Str. 57",
      "city": "Berlin",
      "region": null,
      "postalCode": "12209",
      "country": "Germany",
      "details": [
        {          
          "productId": 28,
          "unitPrice": "45.6000",
          "quantity": 15,
          "discount": 0
        },
        {
          "productId": 39,
          "unitPrice": "18.0000",
          "quantity": 21,
          "discount": 0
        },
        {          
          "productId": 46,
          "unitPrice": "12.0000",
          "quantity": 2,
          "discount": 0
        }
      ]
    },
    {      
      "customerId": "ALFKI",
      "employeeId": 4,
      "orderDate": "1997-10-02T22:00:00.000Z",
      "requiredDate": "1997-10-30T23:00:00.000Z",
      "shippedDate": "1997-10-12T22:00:00.000Z",
      "shipViaId": 2,
      "freight": "61.0200",
      "name": "Alfred-s Futterkiste",
      "address": "Obere Str. 57",
      "city": "Berlin",
      "region": null,
      "postalCode": "12209",
      "country": "Germany",
      "details": [
        {          
          "productId": 63,
          "unitPrice": "43.9000",
          "quantity": 20,
          "discount": 0
        }
      ]
    },
    {      
      "customerId": "ALFKI",
      "employeeId": 4,
      "orderDate": "1997-10-12T22:00:00.000Z",
      "requiredDate": "1997-11-23T23:00:00.000Z",
      "shippedDate": "1997-10-20T22:00:00.000Z",
      "shipViaId": 1,
      "freight": "23.9400",
      "name": "Alfred-s Futterkiste",
      "address": "Obere Str. 57",
      "city": "Berlin",
      "region": null,
      "postalCode": "12209",
      "country": "Germany",
      "details": [
        {          
          "productId": 3,
          "unitPrice": "10.0000",
          "quantity": 6,
          "discount": 0
        },
        {          
          "productId": 76,
          "unitPrice": "18.0000",
          "quantity": 15,
          "discount": 0
        }
      ]
    },
  ];

  //await exec( async()=>(await orm.expression(expression).parse()).serialize())
  // await exec( async()=>(await orm.expression(expression).compile('mysql','northwind')).serialize())
  //await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).sentence())
  // await exec(async()=>(await orm.expression(expression).compile('mysql','northwind')).schema())
  let result = await exec(async()=>(await orm.expression(expression).execute(orders,'source')));
}
async function generateModel(orm:IOrm,name:string){
  let content = orm.database.model(name);
  fs.writeFileSync('src/lab/model.d.ts',content);
}
async function schemaSync(orm:IOrm,target:string){
  await orm.database.sync(target).execute();
}
async function schemaDrop(orm:IOrm,target:string,TryAndContinue:boolean=false){
  if(orm.database.exists(target))
    await orm.database.clean(target).execute(undefined,TryAndContinue);
}
async function schemaExport(orm:IOrm,source:string){
  let exportFile = 'orm/data/'+source+'-export.json';  
  let data= await orm.database.export(source);
  fs.writeFileSync(exportFile, JSON.stringify(data,null,2));
}
async function schemaImport(orm:IOrm,source:string,target:string){
  let sourceFile = 'orm/data/'+source+'-export.json';
  let data = JSON.parse(fs.readFileSync(sourceFile));
  await orm.database.import(target,data);
}
(async () => { 

  try
  {  
    let databases=['mysql','postgres'];
    await orm.init(path.join(process.cwd(),'orm/config.yaml'));
   
    
  

    // await modify(orm);
    // await crud(orm);
    // await scriptsByDialect(orm,'northwind');
    // await applySchema(orm,schemas);
    // await bulkInsert2(orm);
    //await generateModel(orm,'source');
    
    // await schemaSync(orm,'source');
    // await schemaExport(orm,'source');
    // //test mysql
    // await schemaDrop(orm,'mysql',true);
    // await schemaSync(orm,'mysql');
    // await schemaImport(orm,'source','mysql');
    // await schemaExport(orm,'mysql');  
    // // //test mariadb
    // // await schemaDrop(orm,'mariadb',true);
    // // await schemaSync(orm,'mariadb');
    // // await schemaImport(orm,'source','mariadb');
    // // await schemaExport(orm,'mariadb');
    // //test postgres 
    // await schemaDrop(orm,'postgres',true);
    // await schemaSync(orm,'postgres');
    // await schemaImport(orm,'source','postgres');
    // await schemaExport(orm,'postgres');  

    await writeQueryTest(orm,databases);//con errores
    // await writeNumeriFunctionsTest(orm,databases);
    // await writeGroupByTest(orm,databases);
    // await writeIncludeTest(orm,databases);
    // await writeInsertsTest(orm,databases);
    // await writeUpdateTest(orm,databases);
    // await writeDeleteTest(orm,databases);
    // await writeBulkInsertTest(orm,databases);
    //operators comparation , matematica
    //string functions
    //datetime functions
    //nullables functions  
       
      
    console.log('Ok')
  }
  catch(error){
    console.log(error)
  }
})();
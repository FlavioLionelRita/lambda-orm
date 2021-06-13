import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import orm  from "./../orm"
const ConfigExtends = require("config-extends");

const app: Application = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

(async () => { 
    try {

      let schemas =  await ConfigExtends.apply('test/config/schema');
      for(const p in schemas){
          let schema =  schemas[p];
          orm.applySchema(schema);
      }

      let cnx = {name:'northwind',language:'sql',variant:'mysql',host:'0.0.0.0',port:3306,user:'root',password:'admin',schema:'northwind' ,database:'northwind'};
      orm.addConnection(cnx);


      const host = process.env.HOST || 'http://localhost';
      const port = process.env.PORT || '8000';  

      app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
          swaggerOptions: {
            url: "/swagger.json",
          },
        })
      );

      app.use(router);

      app.listen(port);
      console.log('Server running at: '+host+':'+port); 
      process.exitCode = 0;
      return 0;
    }
    catch (error) {     
        console.error(error);  
        process.exitCode = -1;
        return -1;
    }    
})();



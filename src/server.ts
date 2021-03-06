import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import mongoose = require("mongoose");
import { CacheRoute } from "./routes/index";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");


export class Server {

    public app: express.Application;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {

        this.app = express();

        this.config();
        this.routes();
        this.api();
    }

    public api() {
    }

    public config() {
    
        this.app.use(express.static(path.join(__dirname, "public")));
    
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
    
        this.app.use(bodyParser.urlencoded({
        extended: true
        }));
    
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
    
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        global.Promise = require('q').Promise;
        mongoose.Promise = global.Promise;
        
        this.app.use(errorHandler());
  
    }

    public routes() {
        let router: express.Router;
        
        router = express.Router();
        CacheRoute.create(router);

        this.app.use(router);
    }
}
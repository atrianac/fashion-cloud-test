import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

export class CacheRoute extends BaseRoute {

  public static create(router: Router) {

    console.log("[IndexRoute::create] Creating index route.");

    router.get("/fashion/test/entries", (req: Request, res: Response, next: NextFunction) => {
        let jsonExample = {
            "name": "Alejandro Triana"
        };
        res.send(jsonExample);
    });
  }

  constructor() {
    super();
  }
}
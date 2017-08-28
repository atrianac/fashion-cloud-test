import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { CacheEntry } from "../model/cache-entry-model";
import { CacheEntryService } from "../service/cache-entry-service";
import { ObjectUtils } from "../utils/object-utils";

export class CacheRoute extends BaseRoute {

  private cacheEntryService: CacheEntryService;

  constructor() {
    super();
    this.cacheEntryService = new CacheEntryService();
    this.cacheEntryService.purgeDatabase();
  }

  public getAllKeysFromCache(req: Request, res: Response, next: NextFunction) {
    console.log("[CacheRoute::getAllKeysFromCache] Retrieve all keys.");
    this.cacheEntryService.getAllKeysFromCache()
      .then(result => {
        res.status(200);
        res.send(result.map(ce => ObjectUtils.mongoModelToCanonical(ce)))
      }).catch(err => {
        res.status(500);
        res.send("Error retrieving all entries");
      });;
  }

  public getEntry(req: Request, res: Response, next: NextFunction) {
    console.log("[CacheRoute::getEntry] Getting cache entry.");
    let key = req.params['cacheKey'];
    this.cacheEntryService.getFromCache(key)
      .then(ce => {
        res.status(201);
        res.json(ObjectUtils.mongoModelToCanonical(ce));
      }).catch(err => {
        res.status(500);
        res.send(`Error getting entry: ${key}`);
      });
  }

  public createEntry(req: Request, res: Response, next: NextFunction) {
    console.log("[CacheRoute::createEntry] Creating cache entry.");
    Object.keys(req.query).map(key => 
      this.cacheEntryService.mergeInCache(key, req.query[key])
      .then(ce => {
        res.status(201);
        res.json(ObjectUtils.mongoModelToCanonical(ce));
      }).catch(err => {
        res.status(500);
        res.send(`Error creating entry: ${key}`);
      })
    );
  }

  public deleteEntry(req: Request, res: Response, next: NextFunction) {
    console.log("[CacheRoute::deleteEntry] Deleting cache entry.");
    let key = req.params['cacheKey'];
    this.cacheEntryService.removeFromCache(key)
      .then(ce => {
        res.sendStatus(204);
      }).catch(err => {
        res.status(500);
        res.send(`Error deleting entry with key: ${key}`);
      });
  }

  public deleteAllEntries(req: Request, res: Response, next: NextFunction) {
    console.log("[CacheRoute::deleteAllEntries] Deleting all entries.");
    let key = req.params['cacheKey'];
    this.cacheEntryService.removeAllKeysFromCache()
      .then(ce => {
        res.sendStatus(204);
      }).catch(err => {
        res.status(500);
        res.send("Error deleting all entries");
      });
  }

  public static create(router: Router) {
    console.log("[CacheRoute::create] Creating index route.");
    let cacheRoute = new CacheRoute();

    router.get(CacheRoute.buildUrl("entries"), (req: Request, res: Response, next: NextFunction) => {
      cacheRoute.getAllKeysFromCache(req, res, next);
    });

    router.delete(CacheRoute.buildUrl("entries"), (req: Request, res: Response, next: NextFunction) => {
      cacheRoute.deleteAllEntries(req, res, next);
    });

    router.get(CacheRoute.buildUrl("entries/:cacheKey"), (req: Request, res: Response, next: NextFunction) => {
      cacheRoute.getEntry(req, res, next);
    });

    router.post(CacheRoute.buildUrl("entries/"), (req: Request, res: Response, next: NextFunction) => {
      if(!ObjectUtils.isEmptyObject(req.query)) {
        cacheRoute.createEntry(req, res, next);
      } else {
        res.sendStatus(400);
      }
    });

    router.delete(CacheRoute.buildUrl("entries/:cacheKey"), (req: Request, res: Response, next: NextFunction) => {
      cacheRoute.deleteEntry(req, res, next);
    });
  }
}
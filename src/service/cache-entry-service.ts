import { CacheEntryModel } from "../model/cache-entry-model";
import { MongoUtil } from "../infraestructure/mongo-util";
import { cacheSchema } from "../infraestructure/cache-entry-schema";
import { Model } from "mongoose";
import config = require('config');

export class CacheEntryService {

    cacheModel: Model<CacheEntryModel>;

    constructor() {
        this.cacheModel = MongoUtil.Instance.Connection.model<CacheEntryModel>("CacheEntry", cacheSchema);
    }

    public putInCache(ckey: string): Promise<CacheEntryModel> {
        let rvalue = this.generateRandomValue();
        return this.cacheModel.create({
            _id: ckey,
            key: ckey,
            value: rvalue,
            ttl: parseInt(config.get('cache.ttl'))
        });
    }

    public mergeInCache(key: string, value: string): boolean {
        return true;
    }

    public getFromCache(key: string): Promise<CacheEntryModel> {
        return new Promise<CacheEntryModel>((resolve, rejected) => {
            this.cacheModel.findOne({ "key": key }).exec((err, res) => {
                if (res == null) {
                    this.putInCache(key).then(ce => resolve(ce))
                        .catch(ierr => rejected(err));
                } else {
                    resolve(res);
                }
            })
        });
    }

    public getAllKeysFromCache(): Promise<CacheEntryModel[]> {
        return new Promise<CacheEntryModel[]>((resolve, rejected) => {
            this.cacheModel.find({}, (err, res) => {
                if (err) {
                    rejected(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public removeFromCache(key: String): Promise<boolean> {
        return new Promise<boolean>((resolve, rejected) => {
            this.cacheModel.remove({ "key": key }, err => {
                if (err == null) {
                    resolve(true);
                } else {
                    rejected(false);
                }
            });
        });
    }

    public removeAllKeysFromCache(): Promise<boolean> {
        return new Promise<boolean>((resolve, rejected) => {
            this.cacheModel.remove({}, err => {
                if (!err) {
                    resolve(true);
                } else {
                    rejected(false);
                }
            });
        });
    }

    private generateRandomValue(): String {
        return Math.random().toString(36).substr(0, 10);
    }

}
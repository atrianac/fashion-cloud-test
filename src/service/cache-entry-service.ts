import { CacheEntryModel } from "../model/cache-entry-model";
import { MongoUtil } from "../infraestructure/mongo-util";
import { cacheSchema } from "../infraestructure/cache-entry-schema";
import { Model } from "mongoose";
import * as config from 'config';

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

    public mergeInCache(key: string, value: string): Promise<CacheEntryModel> {
        return new Promise<CacheEntryModel>((resolve, rejected) => {
            this.cacheModel.findOne({ "key": key }).exec((err, res) => {
                if(res != null) {
                    res.value = value;
                    res.save();
                    resolve(res);
                } else {
                    this.cacheModel.create({
                        _id: key,
                        key: key,
                        value: value,
                        ttl: parseInt(config.get('cache.ttl'))
                    }).then(rs => resolve(rs))
                    .catch(err => rejected(err));
                }
            });
        });
    }

    public getFromCache(key: string): Promise<CacheEntryModel> {
        return new Promise<CacheEntryModel>((resolve, rejected) => {
            this.cacheModel.findOne({ "key": key }).exec((err, res) => {
                if (res == null) {
                    console.log("[CacheEntryService:getFromCache] Cache miss");
                    this.putInCache(key).then(ce => resolve(ce))
                        .catch(ierr => rejected(err));
                } else {
                    console.log("[CacheEntryService:getFromCache] Cache hit");
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

    public purgeDatabase(): void {

        console.log("[CacheEntryService:purgeDatabase] Purge Database init");

        let uf = () => this.getAllKeysFromCache().then(res => {
            res.map(item => {
                console.log(`[CacheEntryService:purgeDatabase] Purge ${item.key}`);
                if((item.ttl - 1) == 0) {
                    this.removeFromCache(item.key);
                } else {
                    console.log(`[CacheEntryService:purgeDatabase] Updating ${item.key}`);
                    this.cacheModel.findOne({ "key": item.key }).exec((err, res) => {
                        res.ttl = res.ttl - 1;
                        res.save();
                    });
                }
            })
        });

        setInterval(uf, parseInt(config.get('cache.purgeTime')));
    }

    private generateRandomValue(): String {
        return Math.random().toString(36).substr(0, 10);
    }

}
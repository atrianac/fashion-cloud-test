
import {CacheEntry, CacheEntryModel} from "../model/cache-entry-model";

export class ObjectUtils {
    public static limitedAssign<S,T extends S>(source: T, destination: S): S {
        const sk = Object.keys(source) as Array< keyof S>;
        sk.forEach(prop => {
            if(destination.hasOwnProperty(prop)) {
                destination[prop] = source[prop];
            }
        });
        return destination;
    }

    public static mongoModelToCanonical(source: CacheEntryModel) : CacheEntry {
        return {
            "key": source.key,
            "value": source.value,
            "ttl": source.ttl
        };
    }

    public static isEmptyObject(obj: any): boolean {
        return Object.keys(obj).length == 0
    }
}
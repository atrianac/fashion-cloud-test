import { Document } from "mongoose";

export interface CacheEntry {
    key: string;
    value: string;
    ttl: number
}

export interface CacheEntryModel extends CacheEntry, Document {}
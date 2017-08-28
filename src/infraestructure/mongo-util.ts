import { Connection } from 'mongoose';
import mongoose = require('mongoose');
import config = require('config');

export class MongoUtil {

    private static instance: MongoUtil

    private mongoConnection: Connection

    private constructor() {
        const MONGODB_CONNECTION: string = config.get('cache.mongoUrl');
        this.mongoConnection = mongoose.createConnection(MONGODB_CONNECTION);
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public get Connection() {
        return this.mongoConnection;
    }
}
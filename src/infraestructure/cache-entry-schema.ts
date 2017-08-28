import { Schema } from "mongoose";

export var cacheSchema = new Schema({
	_id: String, 
    key: String,
	value: String,
	ttl: Number
});
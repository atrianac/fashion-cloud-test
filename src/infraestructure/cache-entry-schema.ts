import { Schema } from "mongoose";

export var cacheSchema = new Schema({
	_id: String, 
    key: String,
	value: String,
	ttl: Number,
	createdAt: Date
});

cacheSchema.pre("save", function(next) {
	if (!this.createdAt) {
	  this.createdAt = new Date();
	}
	next();
});
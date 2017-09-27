import { CacheEntryService } from '../../src/service/cache-entry-service';
//import { suite, test, slow, timeout } from "mocha-typescript";
//@suite
class CacheEntryServiceTest {
    static before() {
        global.Promise = require("q").Promise;
        CacheEntryServiceTest.cacheEntryService = new CacheEntryService();
        CacheEntryServiceTest.chai.should();
    }
    //@test("should put in cache")
    putInCache() {
        let entry = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.putInCache(entry).then(result => {
            result._id.should.exist;
            result._id.should.equal(entry);
            result.remove();
        });
    }
    //@test("should merge in cache")
    mergeInCache() {
        let entry = this.generateKey();
        let value = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.putInCache(entry).then(result => {
            CacheEntryServiceTest.cacheEntryService.mergeInCache(entry, value).then(result => {
                result._id.should.exist;
                result.value.should.equal(value);
                result.remove();
            });
        });
    }
    //@test("should exist in cache when key not exist")
    getFromCacheNotExist() {
        let entry = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.getFromCache(entry).then(result => {
            result._id.should.exist;
            result._id.should.equal(entry);
            result.remove();
        });
    }
    //@test("should exist in cache when key exist")
    getFromCacheExist() {
        let entry = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.putInCache(entry).then(result => {
            let nvalue = result.value;
            CacheEntryServiceTest.cacheEntryService.getFromCache(entry).then(result => {
                result._id.should.exist;
                result.value.should.equal(nvalue);
                result.remove();
            });
        });
    }
    //@test("should return all keys from cache")
    getAllKeysFromCache() {
        let entrya = this.generateKey();
        let entryb = this.generateKey();
        let pa = CacheEntryServiceTest.cacheEntryService.putInCache(entrya);
        let pb = CacheEntryServiceTest.cacheEntryService.putInCache(entryb);
        let pt = Promise.all([pa, pb]);
        pt.then(vs => {
            CacheEntryServiceTest.cacheEntryService.getAllKeysFromCache().then(result => {
                result.length.should.equal(vs.length);
                result.forEach(item => {
                    item.remove();
                });
            });
        });
    }
    //@test("should remove from cache")
    removeFromCache() {
        let entry = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.putInCache(entry).then(result => {
            CacheEntryServiceTest.cacheEntryService.removeFromCache(entry).then(result => {
                chai.should().equal(result, true);
            });
        });
    }
    //@test("should remove all keys from cache")
    removeAllKeysFromCache() {
        let entry = this.generateKey();
        return CacheEntryServiceTest.cacheEntryService.putInCache(entry).then(result => {
            CacheEntryServiceTest.cacheEntryService.removeAllKeysFromCache().then(result => {
                chai.should().equal(result, true);
            });
        });
    }
    generateKey() {
        return Math.random().toString(36).substr(0, 10);
    }
}
CacheEntryServiceTest.chai = require("chai");

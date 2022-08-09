
KarmaFieldsAlpha.Store = class {

  constructor(driver, joins = []) {

    this.buffer = new KarmaFieldsAlpha.Buffer("gateway", driver);
    this.driver = driver;
    this.joins = joins;
    // this.promises = {};
    // this.ids = new Set();
    this.cache = new KarmaFieldsAlpha.Buffer("cache", driver);

    // this.cache = new KarmaFieldsAlpha.BufferMap("cache", driver);

  }

  empty() {
    // this.constructor.cache[this.driver] = {};
    this.cache.remove();
    this.buffer.remove();
  }

  // get(context, key) {
  //   if (this.constructor.cache[this.driver] && this.constructor.cache[this.driver][context]) {
  //     return this.constructor.cache[this.driver][context][key];
  //   }
  //   this.cache.get(context, key);
  // }
  //
  // set(promise, context, key) {
  //   // if (!this.constructor.cache[this.driver]) {
  //   //   this.constructor.cache[this.driver] = {};
  //   // }
  //   // if (!this.constructor.cache[this.driver][context]) {
  //   //   this.constructor.cache[this.driver][context] = {};
  //   // }
  //   // this.constructor.cache[this.driver][context][key] = promise;
  //
  //   this.cache.set(promise, context, key);
  // }

  count(paramString) {

    let promise = this.cache.get("count", paramString);

    if (!promise) {

      promise = KarmaFieldsAlpha.Gateway.get("count/"+this.driver, paramString);

      this.cache.set(promise, "count", paramString);
    }

    return promise;
  }

  query(paramString) {

    // if (!this.constructor.cache[this.driver]) {
    //   this.constructor.cache[this.driver] = {};
    // }

    let promise = this.cache.get("query", paramString);

    if (!promise) {

      let request = this.driver;

      if (paramString) {
        request += "?"+paramString;
      }

      promise = KarmaFieldsAlpha.Gateway.get("query/"+request).then(results => {

        // const ids = [];
        results = results.items || results || []; // -> compat

        for (let item of results) {

          const id = item.id.toString();

          for (let key in item) {
            this.buffer.set([item[key]], id, key);
          }

          this.buffer.set(["0"], id, "trash"); // -> to be removed!

          // ids.push(item.id);
        }

        // return ids;

        return results;
      });

      this.cache.set(promise, "query", paramString);

    }

    return promise;
  }


  queryIds(paramString) {

    let promise = this.cache.get("ids", paramString);

    if (!promise) {
      promise = this.query(paramString).then(results => results.map(item => item.id.toString()));
      this.cache.set(promise, "ids", paramString);
    }

    return promise;
  }

  join(join, paramString) {

    let promise = this.cache.get("join", paramString, join);

    if (!promise) {

      promise = this.queryIds(paramString).then(ids => {
        return KarmaFieldsAlpha.Gateway.get("join/"+join+"?ids="+ids.join(","));
      }).then(relations => {
        for (let relation of relations) {
          const id = relation.id.toString();
          const key = relation.key;
          const values = this.buffer.get(id, key) || [];

          this.buffer.set([...values, relation.value], id, key);
        }
        return relations;
      });

      this.cache.set(promise, "join", paramString, join);

    }

    return promise;
  }


  async getValue(id, ...path) {

    let value = this.buffer.get(id, ...path);

    if (!value) {

      // const queries = this.cache.get("ids") || {};

      const queries = this.cache.get("query") || {};

      for (let paramString in queries) {

        // const ids = await queries[paramString];
        const ids = await this.queryIds(paramString)

        if (ids.includes(id)) {

          value = this.buffer.get(id, ...path);

          if (!value) {

            for (let join of this.joins) {

              await this.join(join, paramString);

            }

            value = this.buffer.get(id, ...path);

          }

          if (value) {

            break;

          }

        }

      }

    }

    return value;
  }



}

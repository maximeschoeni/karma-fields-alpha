
KarmaFieldsAlpha.Store = class {

  constructor(driver, joins = []) {

    this.buffer = new KarmaFieldsAlpha.Buffer("gateway", driver);
    this.driver = driver;
    this.joins = joins;
    this.promises = {};
    this.ids = new Set();
    this.cache = new KarmaFieldsAlpha.Buffer("cache", driver);

  }

  empty() {
    // this.constructor.cache[this.driver] = {};
    this.cache.remove();
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

        results = results.items || results || []; // -> compat

        for (let i = 0; i < results.length; i++) {

          const id = results[i].id.toString();

          this.ids.add(id);

          for (let key in results[i]) {
            this.buffer.set([results[i][key]], id, key);
          }

          this.buffer.set(["0"], id, "trash"); // -> to be removed!
        }

        return results;
      });

      this.cache.set(promise, "query", paramString);

    }

    return promise;
  }

  join(join) {

    // if (!this.constructor.cache[this.driver]) {
    //   this.constructor.cache[this.driver] = {};
    // }

    let promise = this.cache.get("join", join);

    if (!promise) {

      const ids = [...this.ids];

      promise = KarmaFieldsAlpha.Gateway.get("join/"+join+"?ids="+ids.join(",")).then(relations => {
        for (let relation of relations) {
          let values = this.buffer.get(relation.id, relation.key) || [];
          this.buffer.set([...values, relation.value], relation.id, relation.key);
        }
        return results;
      });

      this.cache.set(promise, "join", join);

    }

    return promise;
  }


  async getValue(...path) {

    let value = this.buffer.get(...path);

    if (!value) {

      for (let paramString in this.promises) {

        await this.query(paramString);

      }

      value = this.buffer.get(...path);

      if (!value && this.ids.size) {

        for (let join of this.joins) {

          await this.join(join);

        }

        value = this.buffer.get(...path);

      }

    }

    return value;
  }



}

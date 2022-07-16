
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

        const ids = [];
        results = results.items || results || []; // -> compat

        // for (let i = 0; i < results.length; i++) {
        for (let item of results) {

          // const id = item.id;

          // this.ids.add(id);

          for (let key in item) {
            this.buffer.set([item[key]], item.id, key);
          }

          this.buffer.set(["0"], item.id, "trash"); // -> to be removed!

          ids.push(item.id);
        }

        // return results.map(item => item.id);
        return ids;
      });

      this.cache.set(promise, "query", paramString);

      // this.cache.remove("join");

    }

    return promise;
  }

  join(join, paramString) {

    // if (!this.constructor.cache[this.driver]) {
    //   this.constructor.cache[this.driver] = {};
    // }

    // const query = ids.toString();


    let promise = this.cache.get("join", paramString, join);

    if (!promise) {

      // const ids = await this.query(paramString);
      //
      // promise = KarmaFieldsAlpha.Gateway.get("join/"+join+"?ids="+ids.join(",")).then(relations => {
      //   for (let relation of relations) {
      //     let values = this.buffer.get(relation.id, relation.key) || [];
      //     this.buffer.set([...values, relation.value], relation.id, relation.key);
      //   }
      //   return relations;
      // });

      promise = this.query(paramString).then(ids => {
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

      const queries = this.cache.get("query") || {};

      for (let paramString in queries) {

        // const ids = await this.query(paramString);
        const ids = await queries[paramString];

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

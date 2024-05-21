
KarmaFieldsAlpha.Driver = class {

  static getAlias(driver, key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }


  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

}



KarmaFieldsAlpha.Shuttle = class {

  constructor(context, driver, paramstring) {

    this.context = context;
    this.driver = driver;
    this.paramstring = paramstring;

    this.standBy = true;

    this.queried = false;
    this.complete = false;

    this.ids = new Set();
    this.keys = new Set();

    this.queriedIds = [];
    this.queriedItems = []; // compat

    this.init();

    // this.road = this[context]();

    this.continue();

  }

  init() {

    if (this.context === "cache") {

      this.road = this.cache();

    } else {

      this.road = this.remote();

    }

    this.queried = false;
    this.complete = false;

  }

  add(id, key) {

    if (!this.ids.has(id) && this.queried && !this.queriedIds.includes(id)) {

      this.init();

    }

    this.ids.add(id);
    this.keys.add(key);

  }

  async *work() {

    const result = await this.road.next();

    if (result.done) {

      this.complete = true;

    }

    this.standBy = true;

  }

  continue() {

    if (!this.standBy) {

      this.standBy = false;

      const work = this.work();

      KarmaFieldsAlpha.Jobs.add(work);

      // KarmaFieldsAlpha.Jobs.add(async () => {
      //
      //   const result = await this.road.next();
      //
      //   if (result.done) {
      //
      //     this.complete = true;
      //
      //   }
      //
      //   this.standBy = true;
      //
      // });

    }

  }


  createQueryDataset(results) {

    const data = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    if (results) {

      for (let item of results) {

        const id = item[idAlias];

        data[id] = {};

        for (let key in item) {

          data[id][key] = [item[key]];

        }

      }

    }

    return data;
  }


  store(dataset) {

    for (let id in dataset) {

      for (let key in dataset[id]) {

        KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);

      }

    }

  }


  parseResults(results) {

    const dataset = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    for (let item of results) {

      const id = item[idAlias];

      dataset[id] = {};

      for (let key in item) {

        dataset[id][key] = [item[key]];

      }

    }

    this.store(dataset);

  }

  parseRelations(relations) {

    const dataset = {};

    if (relations) {

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        if (!dataset[id]) {

          dataset[id] = {};

        }

        if (!dataset[id][key]) {

          dataset[id][key] = [];

        }

        dataset[id][key].push(relation.value);

      }

    }

    this.store(dataset);

  }



  async *cache() {

    if (!this.paramstring === undefined) {

      this.paramstring = `ids=${[...this.ids].join(",")}`;

    }

    yield;

    let results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

    this.queried = true;

    if (results) {

      const idAlias = this.constructor.getAlias(this.driver, "id");
      const nameAlias = this.constructor.getAlias(this.driver, "name");

      this.queriedIds = results.map(result => result[idAlias]);
      this.queriedItems = results.map(result => ({id: result[idAlias], name: result[nameAlias]}));

      this.parseResults(results);

      KarmaFieldsAlpha.Store.set(this.queriedItems, "items", "cache", this.driver, this.paramstring);

      const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

      if (relations) {

        paramstring = `ids=${this.queriedIds.join(",")}`;

        for (let relation of relations) {

          yield;

          const results = KarmaFieldsAlpha.Database.Queries.get(relation, driver, paramstring);

          if (results) {

            this.parseRelations(results);

          }

        }

      }

    }

  }

  async *remote() {

    if (!this.paramstring === undefined) {

      this.paramstring = `ids=${[...this.ids].join(",")}`;

    }

    yield;

    let results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${this.paramstring}`);

    this.queried = true;

    if (results) {

      await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, this.paramstring);

      this.parseResults(results);

      const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
      const nameAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "name");

      this.queriedIds = results.map(result => result[idAlias]);
      this.queriedItems = results.map(result => ({id: result[idAlias], name: result[nameAlias]}));

      KarmaFieldsAlpha.Store.set(this.queriedItems, "items", "remote", this.driver, this.paramstring);

      const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

      if (relations && this.queriedIds.length > 0) {

        paramstring = `ids=${this.queriedIds.join(",")}`;

        for (let relation of relations) {

          yield;

          const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);

          if (results) {

            await KarmaFieldsAlpha.Database.Queries.set(results, relation, this.driver, paramstring);

            this.parseRelations(results);

          }

        }

      }

    }


    // write null values

    for (let id of this.ids) {

      for (let key of this.keys) {

        const value = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);

        if (!value) {

          KarmaFieldsAlpha.Store.set([], "vars", "remote", this.driver, id, key);

        }

      }

    }



  }

  // async create(params, token) {
  //
  //   let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //   id = id.toString();
  //
  //   const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //   // const item = this.toArray().find(item => item[state]);
  //   const item = this.toArray().find(item => item.id === token);
  //
  //   if (item) {
  //
  //     // handle already saved values
  //
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", this.driver, id);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //
  //
  //
  //     // delete item[state];
  //     //
  //     // for (let key in item) {
  //     //
  //     //   KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //     //
  //     //   delete item[key];
  //     //
  //     // }
  //
  //     // replace id
  //     item.id = id;
  //
  //
  //     // KarmaFieldsAlpha.Store.set(id, "tokens", item.id);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //   // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //   // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //   // not necessarily needed
  //   // this.init(); // init shuttle -> force reload query
  //
  // }
  //
  // async upload(file, params, token) {
  //
  //   let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //   id = id.toString();
  //
  //   if (params) {
  //
  //     await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: params});
  //
  //   }
  //
  //   const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //   // const item = this.toArray().find(item => item.uploading);
  //   const item = this.toArray().find(item => item.id === token);
  //
  //   if (item) {
  //
  //     // delete item[state];
  //     //
  //     // for (let key in item) {
  //     //
  //     //   KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //     //
  //     //   delete item[key];
  //     //
  //     // }
  //
  //
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", this.driver, id);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //
  //     item.id = id;
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //   // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //   // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //   this.init(); // init shuttle -> force reload query
  //
  // }

  // async *add(tokens, params) {
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     // handle already saved values
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);
  //
  //       }
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //
  //     this.queriedIds = this.queriedIds.map(item => item === token ? id : item); // replace tokeen by id
  //
  //     KarmaFieldsAlpha.Store.State.set(this.queriedIds, "items", this.driver, this.paramstring);
  //
  //   }
  //
  // }


}


KarmaFieldsAlpha.CountShuttle = class {

  constructor(context, driver, paramstring) {

    this.context = context;
    this.driver = driver;
    this.paramstring = paramstring;

    this.standBy = true;
    this.complete = false;

    this.init();
    this.continue();

  }

  init() {

    this.complete = false;

  }

  async *remote() {

    yield;

    this.count = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);

    await KarmaFieldsAlpha.Database.Queries.set(this.count, "count", this.driver, this.paramstring);

    this.complete = true;
    this.standBy = true;

  }

  async *cache() {

    yield;

    this.count = await KarmaFieldsAlpha.Database.Queries.get("count", this.driver, this.paramstring);

    this.complete = true;
    this.standBy = true;

  }

  continue() {

    if (!this.standBy) {

      this.standBy = false;

      work = this[this.context]();

      KarmaFieldsAlpha.Jobs.add(work);

    }

  }

}




KarmaFieldsAlpha.Set = class extends KarmaFieldsAlpha.Content {

  // constructor(driver, paramstring) {
  //
  //   this.driver = driver;
  //   this.paramstring = paramstring;
  //
  //   this.value = KarmaFieldsAlpha.Store.State.get("items", driver, paramstring);
  //
  //   if (!this.value) {
  //
  //     this.query("remote", driver, paramstring);
  //
  //     if (!this.value) {
  //
  //       this.query("cache", driver, paramstring);
  //
  //       if (this.value) {
  //
  //         this.cache = true;
  //
  //       } else {
  //
  //         this.loading = true;
  //
  //       }
  //
  //     // } else if (this.notFound) {
  //     //
  //     //   KarmaFieldsAlpha.Store.State.set(this.value, "items", driver, paramstring);
  //
  //     } else {
  //
  //       KarmaFieldsAlpha.Store.State.set(this.value, "items", driver, paramstring);
  //
  //     }
  //
  //   }
  //
  // }

  query(driver, paramstring) {

    this.driver = driver;
    this.paramstring = paramstring;

    this.value = KarmaFieldsAlpha.Store.State.get("items", driver, paramstring);

    if (!this.value) {

      let shuttle = this.getShuttle("remote", driver, paramstring);

      if (shuttle.queried) {

        this.value = shuttle.queriedItems || [];

        KarmaFieldsAlpha.Store.State.set(this.value, "items", driver, paramstring);

      } else {

        shuttle.continue();

        shuttle = this.getShuttle("cache", driver, paramstring);

        if (shuttle.queried) {

          this.value = shuttle.queriedItems || [];

        } else {

          shuttle.continue();

          this.loading = true;

        }

      }

    }

  }

  getShuttle(context, driver, paramstring) {

    let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

    if (!shuttle) {

      shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

      KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);

    }

    return shuttle;

  }

  callShuttle(context, driver, paramstring) {

    let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

    if (!shuttle) {

      shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

      KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);

    }

    if (!shuttle.idle) {

      shuttle.continue();

    }

    return shuttle;

  }

  // query(context, driver, paramstring) {
  //
  //   // this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);
  //   //
  //   // if (!this.value) {
  //
  //     let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //
  //     if (!shuttle) {
  //
  //       shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);
  //
  //       KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);
  //
  //     }
  //
  //     if (shuttle.queried) {
  //
  //       this.value = shuttle.queriedItems || [];
  //
  //       // this.notFound = true;
  //
  //     } else {
  //
  //       shuttle.continue();
  //
  //       // this.loading = true;
  //
  //     }
  //
  //   // }
  //
  // }

  toIds() {

    return this.toArray().map(item => item.id);

  }

  toOptions() {

    return this.toArray().map((item, index) => {id: item.id, name: this.getValue(index, "name").toString()});

  }

  slice({index = 0, length = 0} = {}) {

    const set = new KarmaFieldsAlpha.Set();

    set.value = this.toArray().slice(index, index + length);

    return set;

  }

  count() {

    const count = new KarmaFieldsAlpha.Count(this.driver, this.paramstring);

    count.query();

    return count;
  }

  getValue(index, key) {

    if (this.loading) {

      return new KarmaFieldsAlpha.Value().loading();

    } else {

      // const items = this.toArray();
      // const id = items[index].id;

      // return new KarmaFieldsAlpha.Value(this.driver, this.paramstring, id, key);


      return new KarmaFieldsAlpha.Value().query(this.driver, this.paramstring, this.getAt(index).id, key);

    }

  }

  setValue(value, index, key) {

    const value = this.get(index, key);

    if (!value.loading) {

      value.set(value);

      // const items = this.toArray();
      // const id = items[index].id;
      //
      //
      //
      // KarmaFieldsAlpha.Store.Delta.set(value, "vars", "remote", this.driver, id, key);

    }

  }

  // getAt(index, key) {
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     const items = itemsQuery.toArray();
  //
  //     if (!items[index]) {
  //
  //       content.notFound = true; // setting loading true cause infinite loops!
  //
  //     } else if (items[index].id) { // -> fetch value
  //
  //       content = this.queryValue(items[index].id, key);
  //
  //     } else { // -> fetch into temp to see if there's any value yet
  //
  //       key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //
  //       content.value = items[index][key];
  //
  //     }
  //
  //   }
  //
  //   return content;
  // }

  async *create(tokens, params) {

    for (let token of tokens) {

      yield;

      let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);

      id = id.toString();

      // const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring) || [];



      // const item = this.toArray().find(item => item.id === token);



      // if (item) {

        // handle already saved values
        const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);

        if (delta) {

          for (let key in delta) {

            KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);

          }

        }

        KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);

      //   item.id = id;
      //
      // }

      // replace tokeen by id
      this.query();

      this.value = this.toArray().map(item => item.id === token ? {id} : item);

      KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);

    }

  }


  add(params, index, num = 1) {

    if (this.loading) {

      return false;

    }

    // -> reformat params
    params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

    this.value = [...this.toArray()];

    const tokens = [];

    for (let i = 0; i < num; i++) {

      const token = Symbol("adding");

      // items.push({...params, id: token});
      tokens.push(token);

      // KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params, token));

      KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");

      for (let key in params) {

        KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);

      }

      KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");


    }

    this.value.splice(index, 0, ...tokens.map(token => ({id: token})));

    // KarmaFieldsAlpha.Works.add(this.create(params, "adding", num));

    KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);


    const work = this.create(tokens, params);

    KarmaFieldsAlpha.Jobs.add(work);



    // let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;
    //
    // count += num;
    //
    // KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

    // const counter = new KarmaFieldsAlpha.Counter(this.driver, this.paramstring);
    //
    // counter.add(num);

    this.count().increase(num);

  }

  //
  // async *addProcess(params, index, num = 1) {
  //
  //   while (this.loading) {
  //
  //     yield;
  //     this.query();
  //
  //   }
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //   const tokens = [];
  //   // const newItems = [];
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     const token = Symbol("adding");
  //
  //     tokens.push(token);
  //
  //     // newItems.push({...params, id: token});
  //
  //     // KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params, token));
  //
  //     // const work = this.create(file, params, token);
  //     //
  //     // KarmaFieldsAlpha.Jobs.add(work);
  //
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //
  //     for (let key in params) {
  //
  //       KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //
  //   }
  //
  //   this.value = [...this.toArray()];
  //   this.value.splice(index, 0, ...tokens);
  //
  //   KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);
  //
  //   const counter = new KarmaFieldsAlpha.Counter();
  //
  //   counter.add(num);
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     this.query();
  //
  //     const ids = this.toArray().map(item => item === token && id || item);
  //
  //     KarmaFieldsAlpha.Store.State.set(ids, "items", this.driver, this.paramstring);
  //
  //     // handle already saved values
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);
  //
  //       }
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //
  //   }
  //
  // }

  // addToken(params, index) {
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //
  //   const token = Symbol("adding");
  //
  //   KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //
  //   for (let key in params) {
  //
  //     KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //   this.value = [...this.toArray()];
  //   this.value.splice(index, 0, token);
  //
  //   KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);
  //
  //   const counter = new KarmaFieldsAlpha.Counter();
  //
  //   counter.add(1);
  //
  //   return token;
  //
  // }
  //
  // async resolveToken(token) {
  //
  //   const params = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token, key);
  //
  //   const id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //   id = id.toString();
  //
  //   this.query();
  //
  //   // this.value = this.toArray().map(item => item === token && id || item);
  //
  //   this.value = [...this.toArray()];
  //
  //   const index = this.value.indexOf(token);
  //
  //   if (index < 0) {
  //
  //     console.error("token not found");
  //
  //   }
  //
  //   this.value.splice(index, 1, id);
  //
  //   KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);
  //
  //   // handle already saved values
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //   if (delta) {
  //
  //     for (let key in delta) {
  //
  //       KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //
  //   return id;
  //
  // }
  //
  // addProcess(params, index, num = 1) {
  //
  //   while (this.loading) {
  //
  //     yield;
  //     this.query();
  //
  //   }
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     const token = this.addToken(params, index);
  //
  //     yield;
  //
  //     await this.resolveToken(token)
  //
  //   }
  //
  // }

  remove(index, length) {

    if (!this.loading) {

      this.value = [...this.toArray()];

      const removedItems = this.value.splice(index, length);

      for (let item of removedItems) {

        if (item.id) {

          KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, item.id, "trash");
          KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, item.id, "trash");

        }

      }

      KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);


      // let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;
      //
      // count -= length;
      //
      // KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

      // const counter = new KarmaFieldsAlpha.Counter();
      //
      // counter.add(-length);

      this.count().increase(-length);

    }

  }

  // async *create(params, state, num) {
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //     const item = this.toArray().find(item => item[state]);
  //
  //     if (item) {
  //
  //       delete item[state];
  //
  //       for (let key in item) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //
  //         delete item[key];
  //
  //       }
  //
  //       item.id = id;
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //   }
  //
  // }

  async *uploadFile(file, params, token) {

    yield;

    let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!

    id = id.toString();

    if (params) {

      await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: params});

    }

    const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);

    // const item = this.toArray().find(item => item.uploading);
    const item = items.find(item => item.id === token);

    if (item) {

      const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);

      if (delta) {

        for (let key in delta) {

          KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);

        }

        // KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", this.driver, id);

      }

      KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);

      item.id = id;

    }

    KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);

    // init shuttle -> force reload query

    const shuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", this.driver, this.paramstring);

    if (shuttle) {

      shuttle.init();

    }

  }


  upload(files, params, index) {

    if (!this.loading) {

      // // -> reformat params
      // params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
      //
      // for (let i = 0; i < files.length; i++) {
      //
      //   this.splice(index, 0, {...params, uploading: true, filetype: "file"});
      //
      //   // const task = new KarmaFieldsAlpha.Task.Upload(this.driver, this.paramstring, files[i], params); // params are not going to be sent along to upload request !
      //   //
      //   // KarmaFieldsAlpha.Task.add(task);
      //
      // }

      const shuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver, paramstring);

      // -> reformat params
      params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));

      this.value = [...this.toArray()];

      const items = [];

      for (let file of files) {

        const token = Symbol("uploading");
        items.push({...params, id: token});

        // KarmaFieldsAlpha.Jobs.add(() => shuttle.upload(file, params, token));

        const work = this.uploadFile(file, params, token);

        KarmaFieldsAlpha.Jobs.add(work);




        // KarmaFieldsAlpha.Store.Delta.set({...params, filetype: ["file"], trash: ["0"]}, "vars", "remote", this.driver, token);

        KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");

        for (let key in params) {

          KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);

        }

        KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
        KarmaFieldsAlpha.Store.Delta.set(["file"], "vars", "remote", this.driver, token, "filetype");

      }

      this.value.splice(index, 0, ...items);

      // KarmaFieldsAlpha.Works.add(this.create(params, "adding", num));


      KarmaFieldsAlpha.Store.State.set(this.value, "items", this.driver, this.paramstring);

      // let count = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring) || 0;
      //
      // count += num;
      //
      // KarmaFieldsAlpha.Store.State.set(count, "count", this.driver, this.paramstring);

      const counter = new KarmaFieldsAlpha.Counter();

      counter.add(num);

    }




  }

  // async *uploadWork(files, params) {
  //
  //   const shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
  //
  //   // const ids = [];
  //
  //   for (let file of files) {
  //
  //     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //     id = id.toString();
  //
  //     // ids.push(id);
  //
  //     if (params) {
  //
  //       await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: this.params});
  //
  //     }
  //
  //     const items = KarmaFieldsAlpha.Store.State.get("items", this.driver, this.paramstring);
  //
  //     const item = this.toArray().find(item => item.uploading);
  //
  //     if (item) {
  //
  //       delete item[state];
  //
  //       for (let key in item) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(item[key], "vars", "remote", this.driver, id, key);
  //
  //         delete item[key];
  //
  //       }
  //
  //       item.id = id;
  //
  //     }
  //
  //     KarmaFieldsAlpha.Store.State.set(items, "items", this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //     // new KarmaFieldsAlpha.Set(this.driver, `ids=${ids.join(",")}`);
  //
  //     shuttle.init();
  //
  //   }





    // let shuttle = new KarmaFieldsAlpha.Shuttle("remote", this.driver, `ids=${ids.join(",")}`);



  // }

  //
  //
  // upload(file, params) {
  //
  // //   super(driver, paramstring, params);
  // //
  // //   this.type = "upload";
  // //   this.file = file;
  // //
  // // }
  // //
  // //
  // //
  // // async resolve() {
  //
  //   let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //   id = id.toString();
  //
  //   if (this.params) {
  //
  //     await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: this.params});
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.remove("relations", "remote", this.driver, this.paramstring);
  //
  //
  //
  //   if (this.paramstring === undefined) {
  //
  //     this.paramstring = `ids=${id}`;
  //
  //   }
  //
  //   this.create(id, "uploading");
  //
  // }
  //

  // isModified(value, id, key) {
  //
  //   let current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
  //
  //   return !KarmaFieldsAlpha.DeepObject.equal(value, current);
  //
  // }
  //
  // getDelta() {
  //
  //   const output = {};
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver);
  //
  //   if (delta) {
  //
  //     for (let id in delta) {
  //
  //       for (let key in delta[id]) {
  //
  //         if (this.isModified(delta[id][key], id, key)) {
  //
  //           KarmaFieldsAlpha.DeepObject.set(output, delta[id][key], this.driver, id, key);
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   return output;
  //
  // }
  //
  // async update() {
  //
  //   const delta = this.getDelta();
  //
  //   await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta);
  //
  //   // await this.cleanDriver(driver, delta[driver]);
  //
  //   for (let id in delta) {
  //
  //     for (let key in delta[id]) {
  //
  //       KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", this.driver, id, key);
  //
  //     }
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", this.driver); // do not update history !
  //
  //   const items = KarmaFieldsAlpha.Store.State.get("items", this.driver)
  //
  //   KarmaFieldsAlpha.Store.set(items, "items", driver);
  //
  //   KarmaFieldsAlpha.Store.State.remove("items", driver);
  //
  //   KarmaFieldsAlpha.Store.remove("relations", "remote", driver);
  //
  //   // KarmaFieldsAlpha.Store.Delta.remove("items", "remote", driver); // update history ?
  //
  //   await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
  //
  //
  // }

}

// KarmaFieldsAlpha.Set.Item = class {
//
//   constructor(set, index, key) {
//
//     if (set.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       const items = set.toArray();
//
//       if (items[index]) {
//
//         key = KarmaFieldsAlpha.Driver.getAlias(set.driver, key);
//
//         if (items[index][key] !== undefined) {
//
//           this.modified = true;
//
//           this.value = items[index][key];
//
//         } else if (items[index].id) {
//
//           const id = items[index].id;
//
//           this.value = KarmaFieldsAlpha.Store.Delta.get("vars", set.driver, id, key);
//
//           if (this.value) {
//
//             let current = KarmaFieldsAlpha.Store.get("vars", "remote", set.driver, id, key);
//
//             this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.value, current);
//
//           } else {
//
//             this.query("remote", set.driver, set.paramstring, id, key);
//
//             if (this.loading) {
//
//               this.query("cache", set.driver, set.paramstring, id, key);
//
//             } else if (this.notFound) {
//
//               KarmaFieldsAlpha.Store.Delta.set(this.value, "vars", "remote", set.driver, id, key);
//
//             }
//
//           }
//
//         }
//
//       } else {
//
//         this.notFound = true; // setting loading true cause infinite loops!
//
//       }
//
//     }
//
//   }
//
//   query(context, driver, paramstring, id, key) {
//
//     this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);
//
//     if (!content.value) {
//
//       let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);
//
//       if (!shuttle) {
//
//         shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);
//
//         KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);
//
//       }
//
//       shuttle.add(id, key);
//
//       // shuttle.ids.add(id);
//       // shuttle.keys.add(key);
//
//       if (shuttle.complete) {
//
//         this.value = [];
//         this.notFound = true;
//
//       } else {
//
//         if (shuttle.standBy) {
//
//           shuttle.continue();
//
//         }
//
//         this.loading = true;
//
//       }
//
//     }
//
//   }
//
//
// }

KarmaFieldsAlpha.Value = class {

  // constructor(driver, paramstring, id, key) {
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
  //
  //   this.driver = driver;
  //   this.paramstring = paramstring;
  //   this.id = id;
  //   this.key = key;
  //
  //   this.value = KarmaFieldsAlpha.Store.Delta.get("vars", driver, id, key);
  //
  //   if (this.value) {
  //
  //     let current = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);
  //
  //     this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.toArray(), current);
  //
  //   } else {
  //
  //     this.query("remote", driver, paramstring, id, key);
  //
  //     if (!this.value) {
  //
  //       this.query("cache", driver, paramstring, id, key);
  //
  //       if (this.value) {
  //
  //         this.cache = true;
  //
  //       } else {
  //
  //         this.loading = false;
  //
  //       }
  //
  //     } else if (this.notFound) {
  //
  //       KarmaFieldsAlpha.Store.Delta.set(this.value, "vars", context, driver, id, key);
  //
  //     }
  //
  //   }
  //
  // }

  query(driver, paramstring, id, key) {

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

    this.driver = driver;
    this.paramstring = paramstring;
    this.id = id;
    this.key = key;

    this.value = KarmaFieldsAlpha.Store.Delta.get("vars", driver, id, key);

    if (this.value) {

      let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

      this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.toArray(), current);

    } else {

      this.value = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

      if (!this.value) {

        const shuttle = this.getShuttle("remote", driver, paramstring, id, key);

        if (shuttle.complete) {

          this.value = [];
          this.notFound = true;

          KarmaFieldsAlpha.Store.Delta.set(this.value, "vars", context, driver, id, key);

        } else {

          shuttle.continue();

          this.value = KarmaFieldsAlpha.Store.get("vars", "cache", driver, id, key);

          if (this.value) {

            this.cache = true;

          } else {

            const shuttle = this.getShuttle("cache", driver, paramstring, id, key);

            if (!shuttle.complete) {

              shuttle.continue();

            }

          }

        }

      }

    }

  }


  getShuttle(context, driver, paramstring, id, key) {

    let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

    if (!shuttle) {

      shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

      KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);

    }

    shuttle.add(id, key);

    return shuttle;

  }

  queryBKP(context, driver, paramstring, id, key) {

    this.value = KarmaFieldsAlpha.Store.get("vars", context, driver, id, key);

    if (!this.value) {

      let shuttle = KarmaFieldsAlpha.Store.get("shuttles", context, driver, paramstring);

      if (!shuttle) {

        shuttle = new KarmaFieldsAlpha.Shuttle(context, driver, paramstring);

        KarmaFieldsAlpha.Store.set(shuttle, "shuttles", context, driver, paramstring);

      }

      shuttle.add(id, key);

      // shuttle.ids.add(id);
      // shuttle.keys.add(key);

      if (shuttle.complete) {

        this.value = [];
        this.notFound = true;

      } else {

        if (shuttle.standBy) {

          shuttle.continue();

        }

        // this.loading = true;

      }

    }

  }

  set(value) {

    const current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, this.id, this.key);

    this.value = value;

    if (KarmaFieldsAlpha.DeepObject.equal(this.toArray(), current)) {

      KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, this.id, this.key);

    } else {

      KarmaFieldsAlpha.Store.Delta.set(this.toArray(), "vars", "remote", this.driver, this.id, this.key); // -> may be the same if not loaded !

    }
    //
    //
    // if (this.value) {
    //
    //
    //
    // } else {
    //
    //
    //
    //
    // }
    //
    // this.value = value;
    //
    // KarmaFieldsAlpha.Store.Delta.set(this.toArray(), "vars", "remote", this.driver, this.id, this.key);

  }

  // setValueAt(content, index, key) {
  //
  //   const query = this.queryItems();
  //
  //   if (query.loading) {
  //
  //     console.warn("setting content while query not loaded!", content, index, key);
  //
  //   } else {
  //
  //       const items = query.toArray();
  //
  //       if (!items[index]) {
  //
  //         items[index] = {};
  //
  //         this.setItems(items);
  //
  //       }
  //
  //       if (items[index]) {
  //
  //         if (items[index].id) {
  //
  //           this.setValue(content, items[index].id, key);
  //
  //         } else {
  //
  //           key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //
  //           items[index][key] = content.toArray();
  //
  //         }
  //
  //       } else {
  //
  //         console.error("Index out of bound", index, key, content.value);
  //
  //       }
  //
  //   }
  //
  // }

}

KarmaFieldsAlpha.Count = class {

  constructor(driver, paramstring) {

    this.driver = driver;
    this.paramstring = paramstring;
    //
    // this.query("remote");
    //
    // if (this.value === undefined) {
    //
    //   this.query("cache");
    //
    //   if (this.value === undefined) {
    //
    //     this.loading = true;
    //
    //   } else {
    //
    //     this.cache = true;
    //
    //   }
    //
    // }
    //
  }

  query() {

    let shuttle = this.getShuttle("remote");

    if (shuttle.complete) {

      this.value = shuttle.count || 0;

    } else if (shuttle.standBy) {

      shuttle.continue();

      shuttle = this.getShuttle("cache");

      if (shuttle.complete) {

        this.value = shuttle.count || 0;
        this.cache = true;

      } else {

        shuttle.continue();

        this.loading = true;

      }

    }

  }

  increase(num) {

    // let shuttle = KarmaFieldsAlpha.Store.get("countshuttles", "remote", this.driver, this.paramstring);
    //
    // if (!shuttle) {
    //
    //   shuttle = new KarmaFieldsAlpha.CountShuttle("remote", this.driver, this.paramstring);
    //
    // }

    let shuttle = this.getShuttle("remote");

    shuttle.count = (shuttle.count || 0) + num;

  }

  // query(context) {
  //
  //   let shuttle = KarmaFieldsAlpha.Store.get("countshuttles", context, this.driver, this.paramstring);
  //
  //   if (!shuttle) {
  //
  //     shuttle = new KarmaFieldsAlpha.CountShuttle(context, this.driver, this.paramstring);
  //
  //     KarmaFieldsAlpha.Store.set(shuttle, "countshuttles", context, driver, paramstring);
  //
  //   }
  //
  //   if (shuttle.complete) {
  //
  //     this.value = shuttle.count || 0;
  //
  //   } else if (shuttle.standBy) {
  //
  //     shuttle.continue();
  //
  //   }
  //
  // }

  getShuttle(context) {

    let shuttle = KarmaFieldsAlpha.Store.get("countshuttles", context, this.driver, this.paramstring);

    if (!shuttle) {

      shuttle = new KarmaFieldsAlpha.CountShuttle(context, this.driver, this.paramstring);

      KarmaFieldsAlpha.Store.set(shuttle, "countshuttles", context, driver, paramstring);

    }

    return shuttle;

    // if (shuttle.complete) {
    //
    //   this.value = shuttle.count || 0;
    //
    // } else if (shuttle.standBy) {
    //
    //   shuttle.continue();
    //
    // }

  }

}

KarmaFieldsAlpha.Updater = class {

  save() {

    const work = this.update(delta);

    KarmaFieldsAlpha.Jobs.add(work);

  }

  async *update() {

    const delta = this.getDelta();

    for (let driver in delta) {

      yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      for (let id in delta) {

        for (let key in delta[id]) {

          KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", driver, id, key);

        }

      }

      // remove from delta buffer without updating history
      KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);


      // reset shuttles
      const shuttles = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver);

      for (let shuttle of shuttles) {

        shuttle.init();

      }

    }

  }

  isModified(value, driver, id, key) {

    let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  getDelta() {

    const output = {};
    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isModified(delta[driver][id], driver, id, key)) {

              KarmaFieldsAlpha.DeepObject.set(output, value, driver, id, key);

            }

          }

        }

      }

    }

    return output;

  }

  hasDelta() {

    const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");

    if (delta) {

      for (let driver in delta) {

        for (let id in delta[driver]) {

          for (let key in delta[driver][id]) {

            if (this.isModified(delta[driver][id][key], driver, id, key)) {

              return true;

            }

          }

        }

      }

    }

    return false;

  }

}

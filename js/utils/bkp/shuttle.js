
KarmaFieldsAlpha.Driver = class {

  static getAlias(driver, key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "alias", key) || key;

  }


  static getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, driver, "relations");

  }

  static formatParams(params, driver) {

    return Object.fromEntries(Object.entries(params).map(([key, value]) => [this.getAlias(driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));


    // const formatedParams = {};
    //
    // for (let key in params) {
    //
    //   formatedKey = this.getAlias(driver, key);
    //   formatedValue = new KarmaFieldsAlpha.Content(params[key]).toArray();
    //
    //   formatedParams[formatedKey] = formatedValue;
    //
    // }
    //
    // return formatedParams;
  }

}



KarmaFieldsAlpha.Shuttle = class {

  static get(driver, paramstring) {

    let shuttle = KarmaFieldsAlpha.Store.get("shuttles", driver, paramstring);

    if (!shuttle) {

      shuttle = new this(driver, paramstring);

      KarmaFieldsAlpha.Store.set(shuttle, "shuttles", driver, paramstring);

    }

    return shuttle;
  }

  constructor(driver, paramstring) {

    this.driver = driver;
    this.paramstring = paramstring;

    this.idle = true;
    this.started = false;
    this.queried = false;
    this.complete = false;
    this.relationQuery = {};

    this.requestedIds = new Set();
    this.requestedKeys = new Set();

    // this.relations = KarmaFieldsAlpha.Driver.getRelations(driver);
    // this.idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

    this.queriedIds = [];

    this.countIdle = true;

    this.queries = new Set();
    this.useCache = false;

  }

  reset() {

    // this.idle = true;
    this.started = false;
    this.queried = false;
    this.complete = false;
    this.relationQuery = {};
    this.queries = new Set();

    this.requestedIds = new Set();
    this.requestedKeys = new Set();

  }

  getAlias(key) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.driver, "alias", key) || key;

  }


  getRelations(driver) {

    return KarmaFieldsAlpha.DeepObject.get(KarmaFieldsAlpha.drivers, this.driver, "relations") || [];

  }

  // init() {
  //
  //   this.road = this.mix();
  //   this.queried = false;
  //   this.complete = false;
  //
  // }

  // request(id, key) {
  //
  //   // if (!this.ids.has(id) && this.queried && !this.queriedIds.includes(id)) {
  //   //
  //   //   this.init();
  //   //
  //   // }
  //
  //   this.ids.add(id);
  //   this.keys.add(key);
  //
  //   // if (!this.complete) {
  //   //
  //   //   this.send();
  //   //
  //   // }
  //
  // }

  request(id, key) {

    // if (this.started && !this.requestedIds.has(id)) {
    //
    //   this.reset();
    //
    // }

    this.requestedIds.add(id);
    this.requestedKeys.add(key);

  }

  // async *work() {
  //
  //   const result = await this.road.next();
  //
  //   if (result.done) {
  //
  //     this.complete = true;
  //
  //   }
  //
  //   this.idle = true;
  //
  // }
  //
  // send() {
  //
  //   if (this.idle && !this.complete) {
  //
  //     this.idle = false;
  //
  //     const work = this.work();
  //
  //     KarmaFieldsAlpha.Jobs.add(work);
  //
  //   }
  //
  // }

  async store(dataset, context) {

    const items = [];

    for (let id in dataset) {

      for (let key in dataset[id]) {

        items.push({
          id,
          key,
          data: dataset[id][key]
        });

        // await KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", context, this.driver, id, key);

      }

    }

    await KarmaFieldsAlpha.Database.Vars.import(items, this.driver);

  }


  async parseResults(results, context) {

    const dataset = {};

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    for (let item of results) {

      const id = item[idAlias];

      dataset[id] = {};

      for (let key in item) {

        dataset[id][key] = [item[key]];

      }

    }

    await this.store(dataset, context);

  }

  async parseRelations(relations, context) {

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

    await this.store(dataset, context);

  }

  getParamstring() {

    if (this.paramstring === undefined) {

      return `ids=${[...this.requestedIds].join(",")}`;

    } else {

      return this.paramstring;

    }

  }


  async *mix(driver, id, lazy = true) {

    this.idle = false;
    this.started = true;

    const idAlias = this.getAlias("id");
    const relations = this.getRelations();

    let subqueries = await KarmaFieldsAlpha.Database.Queries.getQuery(driver, id, "subqueries") || new Set();

    let queriedIds;

    if (subqueries.has("query")) {

      queriedIds = await KarmaFieldsAlpha.Database.Queries.getQuery(driver, id, "queriedIds") || [];

    } else {

      subqueries.add("query")

      await KarmaFieldsAlpha.Database.Queries.set(subqueries, driver, id, "subqueries");

      let paramstring = id;

      if (!paramstring) {

        let requestedIds = await KarmaFieldsAlpha.Database.Queries.getQuery(driver, id, "requestedIds") || new Set();

        paramstring = `ids=${[requestedIds].join(",")}`;

      }

      yield;

      const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);

      queriedIds = [];

      if (results) {

        const items = [];


        const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");

        for (let item of results) {

          const id = item[idAlias];

          for (let key in item) {

            items.push({id, key, data: [item[key]]});

          }

          queriedIds.add(id);

        }

        await KarmaFieldsAlpha.Database.Vars.import(items, driver);

        await KarmaFieldsAlpha.Database.Queries.set(queriedIds, driver, id, "queriedIds");

      }

      await KarmaFieldsAlpha.Database.Queries.set(true, driver, id, "queried");
      // this.queried = true;

      if (lazy) {

        await KarmaFieldsAlpha.Database.Queries.set(true, driver, id, "idle");
        // this.idle = true;
        return;

      }

    }


    if (relations && queriedIds.length > 0) {

      for (let relation of relations) {

        const subqueries = await KarmaFieldsAlpha.Database.Queries.getQuery(driver, id, "subqueries") || new Set();

        if (!subqueries.has(relation)) {

          subqueries.add(relation);

          await KarmaFieldsAlpha.Database.Queries.set(subqueries, driver, id, "subqueries");

          yield;

          const max = 200;

          for (let i = 0; i < queriedIds.length; i += max) {

            const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;

            const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);

            if (results) {

              // await this.parseRelations(results, "remote");
              const dataset = {};

              for (let relation of results) {

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

              const items = [];

              for (let id in dataset) {

                for (let key in dataset[id]) {

                  items.push({id, key, data: dataset[id][key]});

                }

              }

              await KarmaFieldsAlpha.Database.Vars.import(items, driver);

            }

          }

          // this.relationQuery[relation] = true;


          // do we really need this?
          const relationQuery = await KarmaFieldsAlpha.Database.Queries.get(driver, id, "relationQuery");
          relationQuery[relation] = true;
          await KarmaFieldsAlpha.Database.Queries.set(relationQuery, driver, id, "relationQuery");

          if (lazy) {

            // this.idle = true;
            await KarmaFieldsAlpha.Database.Queries.set(true, driver, id, "idle");
            return;

          }

        }

      }

    }

    // this.complete = true;
    await KarmaFieldsAlpha.Database.Queries.set(true, driver, id, "complete");

  }

  // getIds() {
  //
  //   // const set = new KarmaFieldsAlpha.Shuttle.Set();
  //   const set = new KarmaFieldsAlpha.Content();
  //
  //   if (this.queried) {
  //
  //     const deltaIds = KarmaFieldsAlpha.Store.State.get("ids", this.driver, this.paramstring);
  //
  //     set.value = deltaIds || this.queriedIds || [];
  //
  //   } else {
  //
  //     if (this.cachedIds) {
  //
  //       set.value = this.cachedIds;
  //
  //       set.cache = true;
  //
  //     } else {
  //
  //       set.value = [];
  //
  //       set.loading = true;
  //
  //     }
  //
  //     // this.send(); // load
  //
  //   }
  //
  //   return set;
  // }
  //
  // getValueAt(index, key) {
  //
  //   const ids = this.getIds();
  //
  //   if (ids.loading) {
  //
  //     return new KarmaFieldsAlpha.Content.Loading();
  //
  //   } else {
  //
  //     const id = ids.toArray()[index];
  //
  //     return this.getValue(id, key);
  //
  //   }
  //
  // }
  //
  // setValueAt(value, index, key) {
  //
  //   const ids = this.getIds();
  //
  //   if (!ids.loading) {
  //
  //     const id = ids.toArray()[index];
  //
  //     this.setValue(value.value || value, id, key); // compat
  //
  //   }
  //
  // }
  //
  // getValue(id, key) {
  //
  //   const value = new KarmaFieldsAlpha.Content();
  //
  //   value.set = (value) => this.setValue(value, id, key); // ?
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, id, key);
  //   const current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
  //
  //   if (delta) {
  //
  //     value.value = delta;
  //     value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);
  //
  //   } else if (current) {
  //
  //     value.value = current;
  //
  //
  //   } else if (this.complete) {
  //
  //     value.value = [];
  //     value.notFound = true;
  //
  //   } else {
  //
  //     if (this.cached) {
  //
  //       value.value = KarmaFieldsAlpha.Store.get("vars", "cache", this.driver, id, key);
  //       value.cache = true;
  //
  //     } else {
  //
  //       value.loading = true;
  //
  //     }
  //
  //     this.request(id, key);
  //
  //   }
  //
  //   return value;
  //
  // }
  //
  // setValue(value, id, key) {
  //
  //   key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
  //
  //   const current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
  //
  //   const delta = new KarmaFieldsAlpha.Content(value).toArray();
  //
  //   // if (KarmaFieldsAlpha.DeepObject.equal(delta, current)) {
  //   //
  //   //   KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, id, key);
  //   //
  //   // } else {
  //   //
  //   //   KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", this.driver, id, key); // -> may be the same if not loaded !
  //   //
  //   // }
  //
  //   if (id[0] === "_") { // is token
  //
  //     KarmaFieldsAlpha.Store.set(delta, "buffer", "state", "delta", "vars", "remote", this.driver, id, key); // do not update history
  //
  //   } else {
  //
  //     KarmaFieldsAlpha.Store.Delta.set(delta, "vars", "remote", this.driver, id, key); // -> update history
  //
  //   }
  //
  // }
  //
  // getOptions() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //   const ids = this.getIds();
  //
  //   if (ids.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     content.value = ids.toArray().map(id => ({id, name: this.getValue(id, "name").toString()}));
  //
  //   }
  //
  //   return content;
  //
  // }

  // async *loadTokens(tokens, params) {
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
  //
  //     id = id.toString();
  //
  //     // replace already saved values
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
  //     KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", this.driver, token); // do not update history
  //
  //
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //
  //     // replace token by id
  //     const ids = this.getIds().toArray().map(item => item === token ? id : item);
  //
  //     KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //
  //   }
  //
  // }
  //
  // createToken() {
  //
  //   let index = KarmaFieldsAlpha.Store.get("tokenIndex") || 0;
  //
  //   index++;
  //
  //   KarmaFieldsAlpha.Store.set(index, "tokenIndex");
  //
  //   return `_${index}_`;
  //
  //   // return `${Date.now().toString(36)}-${i}`;
  // }
  //
  // add(params, index, num = 1) {
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //   const ids = [...this.getIds().toArray()];
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < num; i++) {
  //
  //     // const token = Symbol("adding");
  //     // const token = Math.random().toString(36).substr(2);
  //     const token = this.createToken();
  //
  //     // items.push({...params, id: token});
  //     tokens.push(token);
  //
  //     // KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params, token));
  //
  //     // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //
  //     for (let key in params) {
  //
  //       // KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //
  //       KarmaFieldsAlpha.Store.set(params[key],"buffer", "state", "delta", "vars", "remote", this.driver, token, key); // do not update history
  //
  //     }
  //
  //     // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //   }
  //
  //   ids.splice(index, 0, ...tokens);
  //
  //   // KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //   KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", this.driver, this.paramstring); // do not update history
  //
  //
  //   this.increaseCount(num);
  //
  //   // return tokens;
  //
  //   const work = this.loadTokens(tokens, params); // we can do this job right now because we need first to create default values
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  // }

  // remove(index, length) {
  //
  //   const ids = [...this.getIds().toArray()];
  //
  //   const removedIds = ids.splice(index, length);
  //
  //   for (let id of removedIds) {
  //
  //     KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, id, "trash");
  //
  //   }
  //
  //   KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //
  //   this.increaseCount(-length);
  //
  // }

  // async *uploadFile(file, params, token) {
  //
  //   yield;
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
  //   // update query
  //   this.query(this.driver, this.paramstring);
  //
  //   // replace tokeen by id
  //   this.value = this.toArray().map(item => item === token ? id : item);
  //
  //   KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
  //
  //   // init shuttle -> force reload query
  //
  //   const shuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", this.driver, this.paramstring);
  //
  //   if (shuttle) {
  //
  //     shuttle.init();
  //
  //   }
  //
  // }

  // async *uploadFiles(files, tokens, params) {
  //
  //   const createdIds = [];
  //
  //   for (let file of files) {
  //
  //     const token = tokens.shift();
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
  //
  //     id = id.toString();
  //
  //     createdIds.push(id);
  //
  //     if (params) {
  //
  //       await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: {trash: ["0"], ...params}});
  //
  //     }
  //
  //     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
  //
  //     if (delta) {
  //
  //       for (let key in delta) {
  //
  //         KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key); // update history !
  //
  //       }
  //
  //     }
  //
  //     // KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, token);
  //     KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", this.driver, token); // do not update history
  //
  //
  //     // handle history
  //     KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, id, "trash");
  //     KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, id, "trash");
  //
  //
  //     // replace token by id
  //     const ids = this.getIds().toArray().map(item => item === token ? id : item);
  //
  //     // KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //     KarmaFieldsAlpha.Store.set(ids, "buffer", "state", "ids", this.driver, this.paramstring); // do not update history
  //
  //
  //
  //
  //     // init shuttle -> force reload query
  //
  //     // const shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, this.paramstring);
  //     //
  //     // if (shuttle) {
  //     //
  //     //   shuttle.init();
  //     //
  //     // }
  //
  //
  //
  //   }
  //
  //   // create new query and reload
  //   // const shuttle = KarmaFieldsAlpha.Shuttle.get(this.driver, `ids=${createdIds.join(",")}`);
  //   //
  //   // yield* shuttle.mix();
  //
  //   // this.paramstring = `ids=${createdIds.join(",")}`;
  //   //
  //   // *this.mix();
  //
  //   // const paramstring = `ids=${createdIds.join(",")}`;
  //   // let shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, paramstring);
  //   //
  //   // if (!shuttle) {
  //   //
  //   //   shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, paramstring);
  //   //
  //   //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, paramstring);
  //   //
  //   //   // const work = shuttle.mix();
  //   //   //
  //   //   // KarmaFieldsAlpha.Jobs.add(work);
  //   //
  //   //   yield* shuttle.mix();
  //   //
  //   // }
  //
  //
  //   const paramstring = `ids=${createdIds.join(",")}`;
  //   const shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, paramstring);
  //
  //   KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, paramstring);
  //
  //   yield* shuttle.mix();
  //
  // }
  //
  //
  // upload(files, params, index) {
  //
  //   // -> reformat params
  //   params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
  //
  //   const tokens = [];
  //
  //   for (let file of files) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     // KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
  //     //
  //     // // for (let key in params) {
  //     // //
  //     // //   KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
  //     // //
  //     // // }
  //     //
  //     // KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
  //     // // KarmaFieldsAlpha.Store.Delta.set(["file"], "vars", "remote", this.driver, token, "filetype");
  //     //
  //     // KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, token, "trash");
  //
  //   }
  //
  //   const ids = [...this.getIds().toArray()];
  //
  //   ids.splice(index, 0, ...tokens);
  //
  //   KarmaFieldsAlpha.Store.State.set(ids, "ids", this.driver, this.paramstring);
  //
  //   this.increaseCount(tokens.length);
  //
  //
  //   const work = this.uploadFiles(files, tokens, params);
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  // }

  // getCount() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.counted) {
  //
  //     const delta = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring);
  //
  //     content.value = delta !== undefined && delta || this.count;
  //
  //   } else {
  //
  //     if (!this.counting) {
  //
  //       this.initCount();
  //
  //     }
  //
  //     content.loading = true;
  //
  //   }
  //
  //   return content;
  // }
  //
  // setCount(num) {
  //
  //   KarmaFieldsAlpha.Store.State.set(num, "count", this.driver, this.paramstring);
  //
  // }
  //
  // increaseCount(num) {
  //
  //   this.setCount(this.getCount().toNumber() + num);
  //
  // }
  //
  //
  //
  // initCount() {
  //
  //   const work = this.loadCount();
  //
  //   KarmaFieldsAlpha.Jobs.add(work);
  //
  //   this.counting = true;
  //
  // }

  resetCount() {

    this.counted = false;

  }

  // async *loadCount() {
  //
  //   // yield;
  //   //
  //   // this.cacheCount = await KarmaFieldsAlpha.Database.Queries.get("count", this.driver, this.paramstring);
  //   //
  //   // this.countCached = true;
  //
  //   yield;
  //
  //   this.count = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}`, this.paramstring);
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(this.count, "count", this.driver, this.paramstring);
  //
  //   this.setCount(this.count);
  //
  //   this.counted = true;
  //   this.counting = false;
  //
  // }

  async *count(useCache = false) {

    this.countIdle = false;

    if (useCache) {

      yield;

      this.cacheTotal = await KarmaFieldsAlpha.Database.Queries.get("count", this.driver, this.paramstring);

      this.countCached = true;

    }

    yield;

    this.total = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}`, this.paramstring);

    if (useCache) {

      await KarmaFieldsAlpha.Database.Queries.set(this.total, "count", this.driver, this.paramstring);

    }

    this.counted = true;
    this.counting = false;

  }


  // async *update(delta) {
  //
  //   yield;
  //
  //   await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, delta);
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
  //   // remove from delta buffer without updating history
  //   KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", this.driver);
  //
  //
  //   // reset shuttles
  //   const shuttles = KarmaFieldsAlpha.Store.get("shuttles", driver);
  //
  //   if (shuttles) {
  //
  //     for (let paramstring in shuttles) {
  //
  //       const shuttle = shuttles[paramstring];
  //
  //       yield* shuttle.mix();
  //
  //       // shuttle.init();
  //       //
  //       // shuttle.send();
  //
  //     }
  //
  //   }
  //
  //
  //
  //   await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);
  //
  //
  // }

}


// KarmaFieldsAlpha.Shuttle.Count = class {
//
//   constructor(driver, paramstring) {
//
//     this.driver = driver;
//     this.paramstring = paramstring;
//
//     this.complete = false;
//
//     this.init();
//
//   }
//
//   init() {
//
//     this.complete = false;
//
//     const work = this.mix();
//
//     KarmaFieldsAlpha.Jobs.add(work);
//
//   }
//
//   async *mix() {
//
//     yield;
//
//     this.count = await KarmaFieldsAlpha.Database.Queries.get("count", this.driver, this.paramstring);
//
//     this.cached = true;
//
//     yield;
//
//     this.count = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);
//
//     await KarmaFieldsAlpha.Database.Queries.set(this.count, "count", this.driver, this.paramstring);
//
//     this.complete = true;
//
//   }
//
//   // *work() {
//   //
//   //
//   // }
//   //
//   // send() {
//   //
//   //   if (this.idle) {
//   //
//   //     this.idle = false;
//   //
//   //     const work = this.mix();
//   //
//   //     KarmaFieldsAlpha.Jobs.add(work);
//   //
//   //   }
//   //
//   // }
//
// }




// KarmaFieldsAlpha.Set = class extends KarmaFieldsAlpha.Content {
//
//   constructor(driver, paramstring) {
//
//     super();
//
//     this.driver = driver;
//     this.paramstring = paramstring;
//
//   }
//
//   getShuttle() {
//
//     let shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, this.paramstring);
//
//     if (!shuttle) {
//
//       shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, this.paramstring);
//
//       KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, this.paramstring);
//
//     }
//
//     return shuttle;
//   }
//
//   query() {
//
//     this.value = KarmaFieldsAlpha.Store.State.get("ids", this.driver, this.paramstring);
//
//     if (!this.value) {
//
//       const shuttle = this.getShuttle();
//
//       if (shuttle.queried) {
//
//         this.value = shuttle.queriedIds || [];
//
//         // -> shuttle will update this on query
//         // KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//       } else {
//
//         if (shuttle.cachedIds) {
//
//           this.value = shuttle.cachedIds;
//
//           this.cache = true;
//
//         } else {
//
//           this.value = [];
//
//           this.loading = true;
//
//         }
//
//         shuttle.send();
//
//       }
//
//     }
//
//   }
//
//   toIds() {
//
//     // return this.toArray().map(item => item.id);
//     return this.toArray();
//
//   }
//
//   toOptions() {
//
//     return this.toIds().map((id, index) => ({id, name: this.getValue(index, "name").toString()}));
//
//   }
//
//   slice({index = 0, length = 0} = {}) {
//
//     const set = new KarmaFieldsAlpha.Set();
//
//     set.value = this.toArray().slice(index, index + length);
//
//     return set;
//
//   }
//
//   count() {
//
//     const count = new KarmaFieldsAlpha.Set.Count(this.driver, this.paramstring);
//
//     if (this.loading) {
//
//       count.loading = true;
//
//     } else {
//
//       count.query();
//
//     }
//
//     return count;
//   }
//
//   getValue(index, key) {
//
//     const value = new KarmaFieldsAlpha.Value(this.driver, this.paramstring);
//
//     if (this.loading) {
//
//       value.loading = true;
//
//     } else {
//
//       const id = this.toIds()[index];
//
//       value.query(id, key);
//
//     }
//
//     return value;
//
//   }
//
//   setValue(value, index, key) {
//
//     const item = this.getValue(index, key);
//
//     item.set(value);
//
//   }
//
//   async *createItem(tokens, params) {
//
//     for (let token of tokens) {
//
//       yield;
//
//       let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, params);
//
//       id = id.toString();
//
//       // handle already saved values
//       const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, token);
//
//       if (delta) {
//
//         for (let key in delta) {
//
//           KarmaFieldsAlpha.Store.Delta.set(delta[key], "vars", "remote", this.driver, id, key);
//
//         }
//
//       }
//
//       KarmaFieldsAlpha.Store.remove("buffer", "state", "delta", "vars", "remote", this.driver, token); // do not update history
//
//       // replace tokeen by id
//       this.query(this.driver, this.paramstring);
//
//       this.value = this.toArray().map(item => item === token ? id : item);
//
//       KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//     }
//
//   }
//
//
//   add(params, index, num = 1) {
//
//     if (this.loading) {
//
//       return false;
//
//     }
//
//     // -> reformat params
//     params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
//
//     this.value = [...this.toArray()];
//
//     const tokens = [];
//
//     for (let i = 0; i < num; i++) {
//
//       // const token = Symbol("adding");
//
//       // const token = Math.random().toString(36).substr(2);
//       const token = Date.now().toString(36)+i;
//
//       // items.push({...params, id: token});
//       tokens.push(token);
//
//       // KarmaFieldsAlpha.Jobs.add(() => shuttle.create(params, token));
//
//       KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
//
//       for (let key in params) {
//
//         KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
//
//       }
//
//       KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
//
//
//     }
//
//     // this.value.splice(index, 0, ...tokens.map(token => ({id: token})));
//     this.value.splice(index, 0, ...tokens);
//
//     // KarmaFieldsAlpha.Works.add(this.create(params, "adding", num));
//
//     KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//
//     const work = this.createItem(tokens, params);
//
//     KarmaFieldsAlpha.Jobs.add(work);
//
//
//     this.count().increase(num);
//
//   }
//
//   remove(index, length) {
//
//     if (!this.loading) {
//
//       this.value = [...this.toArray()];
//
//       const removedIds = this.value.splice(index, length);
//
//       for (let id of removedIds) {
//
//         KarmaFieldsAlpha.Store.set(["0"], "vars", "remote", this.driver, id, "trash");
//         KarmaFieldsAlpha.Store.Delta.set(["1"], "vars", "remote", this.driver, id, "trash");
//
//       }
//
//       KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//       this.count().increase(-length);
//
//     }
//
//   }
//
//   async *uploadFile(file, params, token) {
//
//     yield;
//
//     let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params are not going anywhere!
//
//     id = id.toString();
//
//     if (params) {
//
//       await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: params});
//
//     }
//
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
//     // update query
//     this.query(this.driver, this.paramstring);
//
//     // replace tokeen by id
//     this.value = this.toArray().map(item => item === token ? id : item);
//
//     KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//     // init shuttle -> force reload query
//
//     const shuttle = KarmaFieldsAlpha.Store.get("shuttles", "remote", this.driver, this.paramstring);
//
//     if (shuttle) {
//
//       shuttle.init();
//
//     }
//
//   }
//
//
//   upload(files, params, index) {
//
//     // -> reformat params
//     params = Object.fromEntries(Object.entries(params).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(this.driver, key), new KarmaFieldsAlpha.Content(value).toArray()]));
//
//     this.value = [...this.toArray()];
//
//     const tokens = [];
//
//     for (let file of files) {
//
//       const token = Symbol("uploading");
//       tokens.push(token);
//
//       const work = this.uploadFile(file, params, token);
//
//       KarmaFieldsAlpha.Jobs.add(work);
//
//       KarmaFieldsAlpha.Store.set(["1"], "vars", "remote", this.driver, token, "trash");
//
//       for (let key in params) {
//
//         KarmaFieldsAlpha.Store.Delta.set(params[key], "vars", "remote", this.driver, token, key);
//
//       }
//
//       KarmaFieldsAlpha.Store.Delta.set(["0"], "vars", "remote", this.driver, token, "trash");
//       KarmaFieldsAlpha.Store.Delta.set(["file"], "vars", "remote", this.driver, token, "filetype");
//
//     }
//
//     this.value.splice(index, 0, ...tokens);
//
//     KarmaFieldsAlpha.Store.State.set(this.value, "ids", this.driver, this.paramstring);
//
//     const counter = new KarmaFieldsAlpha.Count();
//
//     counter.increase(num);
//
//   }
//
// }


// KarmaFieldsAlpha.Value = class extends KarmaFieldsAlpha.Content {
//
//   constructor(driver, paramstring) {
//
//     super();
//
//     this.driver = driver;
//     this.paramstring = paramstring;
//
//   }
//
//   getShuttle() {
//
//     let shuttle = KarmaFieldsAlpha.Store.get("shuttles", this.driver, this.paramstring);
//
//     if (!shuttle) {
//
//       shuttle = new KarmaFieldsAlpha.Shuttle(this.driver, this.paramstring);
//
//       KarmaFieldsAlpha.Store.set(shuttle, "shuttles", this.driver, this.paramstring);
//
//     }
//
//     return shuttle;
//   }
//
//   query(id, key) {
//
//     key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);
//
//     this.id = id;
//     this.key = key;
//
//     this.value = KarmaFieldsAlpha.Store.Delta.get("vars", "remote", this.driver, id, key);
//
//     if (this.value) {
//
//       let current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
//
//       this.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(this.toArray(), current);
//
//     } else {
//
//       this.value = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, id, key);
//
//       if (!this.value) {
//
//         const shuttle = this.getShuttle();
//
//         if (shuttle.complete) {
//
//           this.value = [];
//           this.notFound = true;
//
//           KarmaFieldsAlpha.Store.set(this.value, "vars", "remote", this.driver, id, key);
//
//         } else {
//
//           this.value = KarmaFieldsAlpha.Store.get("vars", "cache", this.driver, id, key);
//
//           shuttle.request(id, key);
//
//         }
//
//       }
//
//     }
//
//   }
//
//   set(value) {
//
//     if (this.id && this.key) {
//
//       const current = KarmaFieldsAlpha.Store.get("vars", "remote", this.driver, this.id, this.key);
//
//       this.value = value;
//
//       if (KarmaFieldsAlpha.DeepObject.equal(this.toArray(), current)) {
//
//         KarmaFieldsAlpha.Store.Delta.remove("vars", "remote", this.driver, this.id, this.key);
//
//       } else {
//
//         KarmaFieldsAlpha.Store.Delta.set(this.toArray(), "vars", "remote", this.driver, this.id, this.key); // -> may be the same if not loaded !
//
//       }
//
//     }
//
//   }
//
//   createChild(key) {
//
//     return new KarmaFieldsAlpha.ChildValue(this, key);
//
//   }
//
// }
//
// KarmaFieldsAlpha.Set.Count = class extends KarmaFieldsAlpha.Content {
//
//   constructor(driver, paramstring) {
//
//     super();
//
//     this.driver = driver;
//     this.paramstring = paramstring;
//
//   }
//
//   query() {
//
//     this.value = KarmaFieldsAlpha.Store.State.get("count", this.driver, this.paramstring);
//
//     if (this.value === undefined) {
//
//       const shuttle = this.getShuttle();
//
//       this.value = shuttle.count || 0;
//
//       if (shuttle.complete) {
//
//         KarmaFieldsAlpha.Store.State.set(this.value, "count", this.driver, this.paramstring);
//
//       } else {
//
//         if (shuttle.cached) {
//
//           this.cache = true;
//
//         } else {
//
//           this.loading = true;
//
//         }
//
//       }
//
//     }
//
//   }
//
//   increase(num) {
//
//     if (!this.loading) {
//
//       this.value += num;
//
//       KarmaFieldsAlpha.Store.State.set(this.value, "count", this.driver, this.paramstring);
//
//     }
//
//   }
//
//   getShuttle() {
//
//     let shuttle = KarmaFieldsAlpha.Store.get("countshuttles", this.driver, this.paramstring);
//
//     if (!shuttle) {
//
//       shuttle = new KarmaFieldsAlpha.Shuttle.Count(this.driver, this.paramstring);
//
//       KarmaFieldsAlpha.Store.set(shuttle, "countshuttles", this.driver, this.paramstring);
//
//     }
//
//     return shuttle;
//
//   }
//
// }
//
// // deprecated -> moved in table field
// KarmaFieldsAlpha.Updater = class {
//
//   save() {
//
//     const work = this.update(delta);
//
//     KarmaFieldsAlpha.Jobs.add(work);
//
//   }
//
//   async *update() {
//
//     const delta = this.getDelta();
//
//     for (let driver in delta) {
//
//       yield;
//
//       await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);
//
//       for (let id in delta) {
//
//         for (let key in delta[id]) {
//
//           KarmaFieldsAlpha.Store.set(delta[id][key], "vars", "remote", driver, id, key);
//
//         }
//
//       }
//
//       // remove from delta buffer without updating history
//       KarmaFieldsAlpha.Store.Buffer.remove("state", "delta", "vars", "remote", driver);
//
//
//       // reset shuttles
//       const shuttles = KarmaFieldsAlpha.Store.get("shuttles", "remote", driver);
//
//       for (let shuttle of shuttles) {
//
//         shuttle.init();
//
//       }
//
//     }
//
//   }
//
//   isModified(value, driver, id, key) {
//
//     let current = KarmaFieldsAlpha.Store.get("vars", "remote", driver, id, key);
//
//     return !KarmaFieldsAlpha.DeepObject.equal(value, current);
//
//   }
//
//   getDelta() {
//
//     const output = {};
//     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
//
//     if (delta) {
//
//       for (let driver in delta) {
//
//         for (let id in delta[driver]) {
//
//           for (let key in delta[driver][id]) {
//
//             if (this.isModified(delta[driver][id], driver, id, key)) {
//
//               KarmaFieldsAlpha.DeepObject.set(output, value, driver, id, key);
//
//             }
//
//           }
//
//         }
//
//       }
//
//     }
//
//     return output;
//
//   }
//
//   hasDelta() {
//
//     const delta = KarmaFieldsAlpha.Store.Delta.get("vars", "remote");
//
//     if (delta) {
//
//       for (let driver in delta) {
//
//         for (let id in delta[driver]) {
//
//           for (let key in delta[driver][id]) {
//
//             if (this.isModified(delta[driver][id][key], driver, id, key)) {
//
//               return true;
//
//             }
//
//           }
//
//         }
//
//       }
//
//     }
//
//     return false;
//
//   }
//
// }
//
//
// KarmaFieldsAlpha.ChildValue = class extends KarmaFieldsAlpha.Content {
//
//   constructor(item, key) {
//
//     super();
//
//     this.parent = item;
//     this.key = key;
//
//     if (item.loading) {
//
//       this.loading = true;
//
//     } else {
//
//       this.value = item.toObject()[key];
//
//     }
//
//   }
//
//   set(value) {
//
//     const obj = this.parent.toObject();
//
//     obj[this.key] = value;
//
//     this.parent.set(obj);
//
//   }
//
// }
//
// KarmaFieldsAlpha.Item = class extends KarmaFieldsAlpha.Value {
//
//   constructor(parent, index, key) {
//
//     super();
//
//     this.parent = parent;
//     this.index = index;
//
//     const id = parent.toIds()[index];
//
//     if (parent.loading || id === undefined) {
//
//       this.loading = true;
//
//     } else {
//
//       this.query(parent.driver, parent.paramstring, id, key);
//
//     }
//
//   }
//
//   // query(parent, index, id) {
//   //
//   //   this.parent = parent;
//   //   // this.driver = parent.driver;
//   //   // this.paramstring = parent.paramstring;
//   //   const id = parent.toIds()[index];
//   //   // this.key = key;
//   //
//   //   if (id) {
//   //
//   //     super.query(parent.driver, parent.paramstring, id, key);
//   //
//   //   }
//   //
//   //
//   // }
//
//   // set(value, index, key) {
//   //
//   //   const id = this.parent.toIds()[index];
//   //
//   //   if (id !== undefined) {
//   //
//   //     super.set(value, id, key);
//   //
//   //   }
//   //
//   // }
//
// }
//
// KarmaFieldsAlpha.WildValue = class extends KarmaFieldsAlpha.Value {
//
//   constructor(driver) {
//
//     super(driver);
//
//     this.query(id, key);
//
//   }
//
// }

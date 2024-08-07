

KarmaFieldsAlpha.Server = class {

  static async query(query) {

    const server = new this(query.driver);
    server.paramstring = query.paramstring;

    if (query.type === "query") {

      await server.fetch();

    } if (query.type === "count") {

      await server.count();

    }

  }

  static async queryAll(queries) {

    for (let query of queries) {

      await this.query(query);

      // const server = new KarmaFieldsAlpha.Server(query.driver);
      // server.paramstring = query.paramstring;
      //
      // if (query.type === "query") {
      //
      //   await server.fetch();
      //
      // } if (query.type === "count") {
      //
      //   await server.count();
      //
      // }

    }

  }

  constructor(driver) {

    this.driver = driver;
    this.paramstring = "";
    this.ids = [];

  }

  async query(params) {

    this.params = params;
    this.paramstring = KarmaFieldsAlpha.Params.stringify(params);

    // const queried = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queried");

    const query = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "query") || {
      queried: false,
      relationIndex: 0
    };

    if (!query.queried) {

      this.loading = true;

      query.open = 1;

      await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, this.paramstring, "query");


      // if (!KarmaFieldsAlpha.task) {
      //
      //   KarmaFieldsAlpha.task = this.fetchIds();
      //
      // }

      // const running = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "lock");
      //
      // if (!running) {
      //
      //   const work = this.fetch(true);
      //   KarmaFieldsAlpha.Jobs.add(work);
      //
      //   await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "lock");
      //
      // }

    } else {

      // this.ids = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "ids") || await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queriedIds") || [];

      this.ids = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "ids") || query.queriedIds || [];

    }

  }

  setParams(params) { // -> e.g for counting without querying first

    this.params = params;
    this.paramstring = KarmaFieldsAlpha.Params.stringify(this.params.toObject());

  }


  async storeResults(results) {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    const items = [];

    for (let result of results) {

      const id = result[idAlias];

      for (let key in result) {

        items.push({id, key, data: [result[key]]});

      }

    }

    await KarmaFieldsAlpha.Database.Vars.insert(items, this.driver);

  }

  async storeRelations(results) {

    const dataset = {};

    for (let result of results) {

      const id = result.id.toString();
      const key = result.key.toString();

      if (!dataset[id]) {

        dataset[id] = {};

      }

      if (!dataset[id][key]) {

        dataset[id][key] = [];

      }

      dataset[id][key].push(result.value);

    }

    const items = [];

    for (let id in dataset) {

      for (let key in dataset[id]) {

        items.push({id, key, data: dataset[id][key]});

      }

    }

    await KarmaFieldsAlpha.Database.Vars.insert(items, this.driver);

  }

  // async *fetch(lazy = true) {
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "started");
  //
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
  //
  //   let subqueries = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "subqueries") || new Set();
  //
  //   let queriedIds;
  //
  //   if (subqueries.has("query")) {
  //
  //     queriedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queriedIds") || [];
  //
  //   } else {
  //
  //     subqueries.add("query")
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(subqueries, this.driver, this.paramstring, "subqueries");
  //
  //     yield;
  //
  //     let paramstring = this.paramstring;
  //
  //     if (!paramstring) {
  //
  //       let requestedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "requestedIds") || new Set();
  //
  //       paramstring = `ids=${[...requestedIds].join(",")}`;
  //
  //     }
  //
  //
  //
  //     const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}`, paramstring);
  //
  //     if (results) {
  //
  //       queriedIds = results.map(result => result[idAlias]);
  //
  //       await this.storeResults(results);
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(queriedIds, this.driver, this.paramstring, "queriedIds");
  //     await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "queried");
  //
  //     if (lazy) {
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(false, this.driver, this.paramstring, "lock");
  //       return;
  //
  //     }
  //
  //   }
  //
  //   if (relations && queriedIds.length > 0) {
  //
  //     for (let relation of relations) {
  //
  //       const subqueries = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "subqueries") || new Set();
  //
  //       if (!subqueries.has(relation)) {
  //
  //         yield;
  //
  //         const max = 100;
  //
  //         for (let i = 0; i < queriedIds.length; i += max) {
  //
  //           const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;
  //
  //           const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}`, paramstring);
  //
  //           if (results && results.length) {
  //
  //             await this.storeRelations(results);
  //
  //           }
  //
  //         }
  //
  //         subqueries.add(relation);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(subqueries, this.driver, this.paramstring, "subqueries");
  //
  //         if (lazy) {
  //
  //           // this.idle = true;
  //           await KarmaFieldsAlpha.Database.Queries.set(false, this.driver, this.paramstring, "lock");
  //           return;
  //
  //         }
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   // this.complete = true;
  //   await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
  //
  // }


  async fetch() {

    const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver) || [];
    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");

    let query = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "query") || {};

    // let queried = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queried") || false;
    // let relationIndex = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "relationIndex") || 0;

    if (!query.queried) {

      let paramstring = this.paramstring;

      if (!paramstring) {

        // let requestedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "requestedIds") || new Set();

        if (!query.requestedIds || !query.requestedIds.size) {

          console.error("anonymous query hold no ids!");

        }

        paramstring = `ids=${[...query.requestedIds].join(",")}`;

      }

      const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}`, paramstring);

      if (results) {

        query.queriedIds = results.map(result => result[idAlias]);

        // await KarmaFieldsAlpha.Database.Queries.set(queriedIds, this.driver, this.paramstring, "queriedIds");

        await this.storeResults(results);

      } else {

        query.queriedIds = [];

        // await KarmaFieldsAlpha.Database.Queries.set([], this.driver, this.paramstring, "queriedIds");

      }

      query.queried = true;

      // await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "queried");

    } else {

      // const queriedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queriedIds") || [];

      if ((query.relationIndex || 0) < relations.length && query.queriedIds && query.queriedIds.length) {

        const relation = relations[query.relationIndex || 0];
        const max = 100;

        for (let i = 0; i < query.queriedIds.length; i += max) {

          const paramstring = `ids=${query.queriedIds.slice(i, i + max).join(",")}`;

          const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}`, paramstring);

          if (results && results.length) {

            await this.storeRelations(results);

          }

        }

        query.relationIndex = (query.relationIndex || 0) + 1;

        // await KarmaFieldsAlpha.Database.Queries.set(relationIndex, this.driver, this.paramstring, "relationIndex");

      }

    }

    query.complete = Boolean(query.queried && (!query.queriedIds || !query.queriedIds.length || (query.relationIndex || 0) >= relations.length));
    query.open = 0;

    await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, this.paramstring, "query");

  }



  // async fetchIds(lazy = true) {
  //
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
  //
  //   let paramstring = this.paramstring;
  //
  //   if (!paramstring) {
  //
  //     let requestedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "requestedIds") || new Set();
  //
  //     paramstring = `ids=${[...requestedIds].join(",")}`;
  //
  //   }
  //
  //
  //
  //   const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}`, paramstring);
  //
  //   if (results) {
  //
  //     const queriedIds = results.map(result => result[idAlias]);
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(queriedIds, this.driver, this.paramstring, "queriedIds");
  //
  //     await this.storeResults(results);
  //
  //     const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
  //
  //     if (!relations || !relations.length) {
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
  //
  //     }
  //
  //   } else {
  //
  //     await KarmaFieldsAlpha.Database.Queries.set([], this.driver, this.paramstring, "queriedIds");
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
  //
  //   }
  //
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "queried");
  //
  // }
  //
  // async fetchRelation(relation) {
  //
  //   const queriedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queriedIds");
  //
  //   if (!queriedIds || !queriedIds.length) {
  //
  //     console.error("queriedIds is empty");
  //
  //   }
  //
  //   const max = 100;
  //
  //   for (let i = 0; i < queriedIds.length; i += max) {
  //
  //     const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;
  //
  //     const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}`, paramstring);
  //
  //     if (results && results.length) {
  //
  //       await this.storeRelations(results);
  //
  //     }
  //
  //   }
  //
  //   const subqueries = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "subqueries") || new Set();
  //
  //   subqueries.add(relation);
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(subqueries, this.driver, this.paramstring, "subqueries");
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver) || [];
  //
  //   if (relations.length === subqueries.size) {
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
  //
  //   }
  //
  // }

  async getValue(id, key) {

    const value = new KarmaFieldsAlpha.Content();

    key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

    const delta = await KarmaFieldsAlpha.Database.States.get("external", this.driver, id, key);
    const current = await KarmaFieldsAlpha.Database.Vars.get(this.driver, id, key);

    if (delta) {

      value.value = delta;
      value.modified = !current || !KarmaFieldsAlpha.DeepObject.equal(delta, current);

    } else if (current) {

      value.value = current;

    } else {

      const query = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "query") || {
        requestedIds: new Set(),
        queried: false,
        relationIndex: 0
      };

      if (this.paramstring) {

        // const complete = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "complete");

        if (query.complete) {

          value.value = [];
          value.notFound = true;

        } else {

          if (!query.open) {

            query.open = 1;

            await KarmaFieldsAlpha.Database.Queries.set(query);

          }

          value.loading = true;

          // if (KarmaFieldsAlpha.task) {
          //
          //   value.loading = true;
          //
          // } else {

            // const queried = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queried");
            //
            // if (queried) {
            //
            //   const subqueries = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "subqueries") || new Set();
            //   const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
            //   const relation = relations.find(relation => !subqueries.has(relation));
            //
            //   if (relation) {
            //
            //     await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "open");
            //
            //     // KarmaFieldsAlpha.task = this.fetchRelation(relation);
            //     value.loading = true;
            //
            //   } else {
            //
            //     await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
            //     value.value = [];
            //     value.notFound = true;
            //
            //   }
            //
            // } else {
            //
            //   KarmaFieldsAlpha.task = this.fetchIds();
            //   value.loading = true;
            //
            // }

          // }

        }

      } else { // anonym request

        // const complete = await KarmaFieldsAlpha.Database.Queries.get(this.driver, "", "complete");
        // const requestedIds = await KarmaFieldsAlpha.Database.Queries.get(this.driver, "", "requestedIds") || new Set();

        if (query.requestedIds && query.requestedIds.has(id) && query.complete) {

          value.value = [];
          value.notFound = true;

        } else {

          if (!query.requestedIds) {

            query.requestedIds = new Set();

          }

          if (!query.requestedIds.has(id)) {

            query.requestedIds.add(id);
            query.queried = false;
            query.relationIndex = 0;

            await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, "", "query");

            // await KarmaFieldsAlpha.Database.Queries.set(requestedIds, this.driver, "", "requestedIds");
            // await KarmaFieldsAlpha.Database.Queries.set(false, this.driver, "", "queried");
            // await KarmaFieldsAlpha.Database.Queries.set(0, this.driver, "", "relationIndex");

          }

          if (!query.open) {

            query.open = 1;
            await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, "", "query");

          }

          value.loading = true;

          // await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "open");



          // if (KarmaFieldsAlpha.task) {
          //
          //   value.loading = true;
          //
          // } else {
          //
          //   let queried = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "queried");
          //
          //   if (!requestedIds.has(id)) {
          //
          //     if (queried) {
          //
          //       await KarmaFieldsAlpha.Database.Queries.remove(this.driver, "");
          //
          //       queried = false;
          //
          //     }
          //
          //     requestedIds.add(id);
          //
          //     await KarmaFieldsAlpha.Database.Queries.set(requestedIds, this.driver, "", "requestedIds");
          //
          //   }
          //
          //   if (queried) {
          //
          //     const subqueries = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "subqueries") || new Set();
          //     const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);
          //     const relation = relations.find(relation => !subqueries.has(relation));
          //
          //     if (relation) {
          //
          //       KarmaFieldsAlpha.task = this.fetchRelation(relation);
          //       value.loading = true;
          //
          //     } else {
          //
          //       await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "complete");
          //       value.value = [];
          //       value.notFound = true;
          //
          //     }
          //
          //   } else {
          //
          //     KarmaFieldsAlpha.task = this.fetchIds();
          //     value.loading = true;
          //
          //   }
          //
          // }

        }

      }

    }

    return value;

  }

  async setValue(value, id, key) {

    const current = await this.getValue(id, key);

    if (!current.loading) {

      key = KarmaFieldsAlpha.Driver.getAlias(this.driver, key);

      const content = new KarmaFieldsAlpha.Content(value);

      await KarmaFieldsAlpha.Database.States.set(content.toArray(), "external", this.driver, id, key);
      await KarmaFieldsAlpha.History.write(content.toArray(), current.toArray(), "external", this.driver, id, key); // update history

    }

  }


  async count() {

    const query = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "count");

    query.count = await KarmaFieldsAlpha.HTTP.get(`count/${this.driver}`, this.paramstring) || 0;
    query.open = 0;
    query.queried = true;

    await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, this.paramstring, "count");

    // await KarmaFieldsAlpha.Database.Queries.set(total, this.driver, this.paramstring, "count");
    // await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "counted");
    // await KarmaFieldsAlpha.Database.Queries.set(false, this.driver, this.paramstring, "counting");

  }


  // async getCount() {
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   if (this.loading) {
  //
  //     content.loading = true;
  //
  //   } else {
  //
  //     const counted = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "counted");
  //
  //     if (counted) {
  //
  //       content.value = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "count") || 0;
  //
  //     } else {
  //
  //       const counting = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "counting");
  //
  //       if (!counting) {
  //
  //         const work = this.count();
  //         KarmaFieldsAlpha.Jobs.add(work);
  //
  //         await KarmaFieldsAlpha.Database.Queries.set(true, this.driver, this.paramstring, "counting");
  //
  //       }
  //
  //       content.loading = true;
  //
  //     }
  //
  //   }
  //
  //   return content;
  //
  // }

  async getCount() {

    // const content = new KarmaFieldsAlpha.Content();
    //
    // if (this.loading) {
    //
    //   content.loading = true;
    //
    // } else {
    //
    //   const counted = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "counted");
    //
    //   if (counted) {
    //
    //     content.value = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "count") || 0;
    //
    //   } else {
    //
    //     if (!KarmaFieldsAlpha.task) {
    //
    //       KarmaFieldsAlpha.task = this.count();
    //
    //     }
    //
    //     content.loading = true;
    //
    //   }
    //
    // }

    const content = new KarmaFieldsAlpha.Content();

    const query = await KarmaFieldsAlpha.Database.Queries.get(this.driver, this.paramstring, "count") || {};

    if (query.queried) {

      content.value = query.count || 0;

    } else if (!query.open) {

      content.loading = true;
      query.open = 1;

      await KarmaFieldsAlpha.Database.Queries.set(query, this.driver, this.paramstring, "count");

    }

    return content;

  }

  // async setCount(num) {
  //
  //   if (!this.loading) {
  //
  //     await KarmaFieldsAlpha.Database.States.set(num, "queries", this.driver, this.paramstring, "count");
  //
  //   }
  //
  // }

  // async *increaseCount(num) {
  //
  //   let count = await this.getCount();
  //
  //   while (count.loading) {
  //
  //     yield;
  //     count = await this.getCount();
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.States.set(count.toNumber() + num, "queries", this.driver, this.paramstring, "count");
  //
  // }


  // async *add(length = 1, index, defaults = {}, data = undefined) {
  //
  //   // let tableDefaults = await body.getParams();
  //   //
  //   // while (tableDefaults.loading) {
  //   //
  //   //   yield;
  //   //   tableDefaults = await body.getParams();
  //   // }
  //
  //   const {page, ppp, order, orderby, ...filters} = this.params;
  //
  //
  //   // const body = this.getChild("body");
  //
  //
  //   // if (index === undefined) {
  //   //
  //   //   index = body.getNewItemIndex();
  //   //
  //   // }
  //
  //   // await this.save("insert", "Insert");
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     const itemData = data && data[i];
  //     const params = {...filters, ...defaults, ...itemData};
  //
  //     for (let key in params) {
  //
  //       await KarmaFieldsAlpha.Database.States.set([params[key]], "external", this.driver, token, key); // do not update history
  //
  //     }
  //
  //   }
  //
  //   const previousIds = await this.ids;
  //   let ids = [...previousIds];
  //   ids.splice(index, 0, ...tokens);
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids"); // do not update history
  //
  //   // await body.select(index, length);
  //
  //   const createdIds = [];
  //
  //   for (let token of tokens) {
  //
  //     yield;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, this.params);
  //
  //     id = id.toString();
  //
  //     createdIds.push(id);
  //
  //     // replace token by id in every states using this token
  //     const states = await KarmaFieldsAlpha.Database.States.select("external", this.driver, token);
  //
  //     if (states) {
  //
  //       KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.States.remove("external", this.driver, token);
  //
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", this.driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", this.driver, id, "trash");
  //
  //     // replace token by id in queries states
  //     const index = ids.indexOf(token);
  //
  //     if (index > -1) {
  //
  //       ids[index] = id;
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids");
  //
  //   }
  //
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", this.driver, this.paramstring, "ids"); // update history
  //
  //   // yield* this.increaseCount(length); // cant do a job in a job !!
  //
  //   // yield* this.count(); // -> just recount
  //
  //
  //
  //
  //
  //   // let count = await this.getCount();
  //   //
  //   // while (count.loading) {
  //   //
  //   //   count = await this.getCount();
  //   //
  //   // }
  //   //
  //   // await this.setCount(count.toNumber() + length);
  //
  // }

  async addItem(token) {

    let id = await KarmaFieldsAlpha.HTTP.post(`add/${this.driver}`, this.params);

    id = id.toString();

    // replace token by id in queries states
    const states = await KarmaFieldsAlpha.Database.States.select("external", this.driver, token);

    if (states) {

      KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));

    }

    await KarmaFieldsAlpha.Database.States.remove("external", this.driver, token);

    await KarmaFieldsAlpha.Database.States.set(["0"], "external", this.driver, id, "trash");
    await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", this.driver, id, "trash");

    let ids = await KarmaFieldsAlpha.Database.States.get("queries", this.driver, this.paramstring, "ids");

    ids = ids.map(item => item === token ? id : item);

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids");


  }


  createToken() {

    let index = KarmaFieldsAlpha.Server.tokenIndex || 0;

    index++;

    KarmaFieldsAlpha.Server.tokenIndex = index;

    return `_${index}`;

  }

  // async *delete(index, length) {
  //
  //   // const body = this.getChild("body");
  //
  //   // if (index === undefined || length === undefined) {
  //   //
  //   //   const selection = await body.querySelection();
  //   //
  //   //   index = selection && selection.index || 0;
  //   //   length = selection && selection.length || 0;
  //   //
  //   // }
  //
  //
  //
  //   let previousIds = this.ids;
  //
  //   // await this.save("delete", "Delete");
  //
  //   const newIds = [...previousIds];
  //
  //   const removedIds = newIds.splice(index, length);
  //
  //   for (let id of removedIds) {
  //
  //     await KarmaFieldsAlpha.Database.States.set(["1"], "external", this.driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", this.driver, id, "trash");
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.States.set(newIds, "queries", this.driver, this.paramstring, "ids");
  //   await KarmaFieldsAlpha.History.write(newIds, previousIds, "queries", this.driver, this.paramstring, "ids");
  //
  //   // await body.select(0, 0);
  //
  //   // yield* this.increaseCount(-length);
  //
  //   // yield* this.count();
  //
  // }


  async getOptionsList() {

    const content = new KarmaFieldsAlpha.Content();

    content.value = [];

    for (let id of this.ids) {

      const name = await this.getValue(id, "name");

      if (name.loading) {

        content.loading = true;

      }

      content.value.push({
        id: id,
        name: name.toString()
      });

    }

    return content;

  }

  async upload(file, token, params = {}) {



    //
    // if (body) {
    //
    //   await body.select(index, tokens.length);
    //
    // }


    // yield* this.increaseCount(tokens.length);


    // upload files

    // const createdIds = [];
    //
    // for (let file of files) {
    //
    //   const token = tokens.shift();
    //
    //   yield;

      let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

      id = id.toString();

      const states = KarmaFieldsAlpha.Database.States.select("external", this.driver, token); // select all keys with tokens

      if (states) {

        await KarmaFieldsAlpha.Database.States.insert(states.map(state => ({...state, id})), "external"); // replace token by ids

        const obj = Object.fromEntries(items.map(item => [item.key, item.data]));

        await KarmaFieldsAlpha.HTTP.post(`update/${this.driver}`, {[id]: {trash: ["0"], ...obj}}); // -> update defaults values to attachment

      }

      // remove preliminary values
      await KarmaFieldsAlpha.Database.States.remove("external", this.driver, token);

      // handle history
      await KarmaFieldsAlpha.Database.States.set(["1"], "external", this.driver, id, "trash");
      await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", this.driver, id, "trash");


      // replace tokens by id
      // idsWithTokens = await KarmaFieldsAlpha.Database.States.get("queries", model.driver, model.paramstring, "ids"); // update ids

      // idsWithTokens = idsWithTokens.map(item => item === token ? id : item); // replace token with the id in ids

      let ids = await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids");

      const index = ids.indexOf(token);

      if (index > -1) {

        ids[index] = id;

      }

      await KarmaFieldsAlpha.Database.States.set(ids, "queries", this.driver, this.paramstring, "ids"); // no history update yet (may still have token)

    // }

    // let finalIds = await KarmaFieldsAlpha.Database.States.get("queries", model.driver, model.paramstring, "ids"); // update ids

    // finalIds = finalIds.filter(id => id.beginWith("_")) // -> filter tokens

    // await KarmaFieldsAlpha.History.write(ids, originalIds, "queries", model.driver, model.paramstring, "ids");



    // load newly created files (because values like filename is generated server side)

    // const paramstring = `ids=${createdIds.join(",")}`;
    // const newShuttle = new KarmaFieldsAlpha.Shuttle(shuttle.driver, paramstring);
    //
    // await KarmaFieldsAlpha.Store.set(newShuttle, "shuttles", shuttle.driver, paramstring);
    //
    // yield* shuttle.mix();




  }


}

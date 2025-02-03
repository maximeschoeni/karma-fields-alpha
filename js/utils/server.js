

KarmaFieldsAlpha.Server = class {

  constructor() {

    this.store = {};
    this.orders = {};

  }

  getData(...path) {

    return KarmaFieldsAlpha.DeepObject.get(this.store, "data", ...path);

  }

  setData(value, ...path) {

    KarmaFieldsAlpha.DeepObject.set(this.store, value, "data", ...path);

  }

  queryState(driver, id, key) {

    // focus: "field", "", "focus"
    // selection: "fields", "fieldId", "selection"
    // params: "fields", "fieldId", "params"
    // fields data: "fields", "fieldId", key


    return KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver, id, key);

  }

  async setState(value, driver, id, key) {

    const current = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver, id, key);

    KarmaFieldsAlpha.DeepObject.set(this.store, value, "state", driver, id, key);

    await KarmaFieldsAlpha.Database.States.set(value, "internal", driver, id, key);
    await KarmaFieldsAlpha.History.write(value, current, "internal", driver, id, key); // update history

  }

  // async updateState(value, driver, id, key) {
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.store, value, "state", driver, id, key);
  //
  // }

  async removeState(driver, id, key) {

    // not used

    if (key) {

      return this.setState(null, driver, id, key)

    } else if (id) {

      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver, id);

      for (let key in states) {

        return this.removeState(driver, id, key);
      }

    } else if (driver) {

      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state", driver);

      for (let id in states) {

        return this.removeState(driver, id);
      }

    } else {

      const states = KarmaFieldsAlpha.DeepObject.get(this.store, "state");

      for (let driver in states) {

        return this.removeState(driver);
      }

    }

  }

  async initStates() {

    const states = await KarmaFieldsAlpha.Database.States.select("internal");

    for (let state of states) {

      KarmaFieldsAlpha.DeepObject.set(this.store, state.data, "state", state.driver, state.id, state.key);

    }

  }



  queryValue(driver, id, key) {

    const response = new KarmaFieldsAlpha.Content();

    key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

    response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

    if (!response.value) {

      response.loading = true;

      if (typeof id !== "symbol") {

        this.orders.filled = true;

        KarmaFieldsAlpha.DeepObject.set(this.orders, true, "wild", driver, id, key);

      }

    }

    return response;
  }

  queryValueAt(driver, paramstring, index, key) {

    const response = new KarmaFieldsAlpha.Content();

    const ids = this.queryIds(driver, paramstring);

    if (ids.loading) {

      response.loading = true;

      this.orders.filled = true;

      KarmaFieldsAlpha.DeepObject.set(this.orders, true, "ids", driver, paramstring);

    } else {

      const id = ids.toArray()[index];

      if (id) {

        if (key === "id") {

          response.value = id;

        } else {

          key = KarmaFieldsAlpha.Driver.getAlias(driver, key);

          response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

          if (!response.value) {

            response.loading = true;

            if (typeof id !== "symbol") {

              this.orders.filled = true;

              KarmaFieldsAlpha.DeepObject.set(this.orders, true, "vars", driver, paramstring, key);

            }

          }

        }

      } else {

        response.outOfBounds = true;

      }

    }

    return response;
  }

  queryIds(driver, paramstring) {

    const response = new KarmaFieldsAlpha.Content();

    response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    if (!response.value) {

      response.loading = true;

      this.orders.filled = true;

      KarmaFieldsAlpha.DeepObject.set(this.orders, true, "ids", driver, paramstring);

    }

    return response;

  }

  queryCount(driver, paramstring) {

    const response = new KarmaFieldsAlpha.Content();

    response.value = KarmaFieldsAlpha.DeepObject.get(this.store, "count", driver, paramstring);

    if (response.value === undefined) {

      response.loading = true;

      this.orders.filled = true;

      KarmaFieldsAlpha.DeepObject.set(this.orders, true, "count", driver, paramstring);

    }

    return response;

  }

  queryOptionsList(driver, paramstring, keys = ["name"]) {

    const response = new KarmaFieldsAlpha.Content();

    const query = this.queryIds(driver, paramstring);

    if (query.loading) {

      response.loading = true;

    } else {

      response.value = [];

      const ids = query.toArray();

      for (let i = 0; i < ids.length; i++) {

        const id = ids[i];
        const item = {id};

        for (let key of keys) {

          const content = this.queryValueAt(driver, paramstring, i, key);

          if (content.loading) {

            response.loading = true;

          } else {

            item[key] = content.toString();

          }

        }

        response.value.push(item);

      }

    }

    return response;

  }





  async processIds() {

    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "ids");

    if (orders) {

      for (let driver in orders) {

        for (let paramstring in orders[driver]) {

          let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

          if (!query) {

            query = {driver, paramstring, type: "query"}

            const result = await this.fetch(query).next();

            query = result.value;

          }

          const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

          const ids = delta || query.queriedIds || [];

          KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);

        }

      }

    }

  }

  async processVars() {

    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "vars");

    if (orders) {

      for (let driver in orders) {

        for (let paramstring in orders[driver]) {

          let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

          if (!query) {

            query = {driver, paramstring, type: "query"};

            // query = await this.fetchQuery({driver, paramstring, type: "query"});

            // query = await this.fetchQuery(driver, paramstring);

            const result = await this.fetch(query).next();

            query = result.value;

          }

          // const ids = query.queriedIds || [];

          let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring) || query.queriedIds || [];

          ids = ids.filter(id => typeof id !== "symbol");

          for (let id of ids) {

            for (let key in orders[driver][paramstring]) {

              let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

              while (!value) {

                if (query.complete) {

                  value = [];

                } else {

                  const next = await this.fetch(query).next();

                  query = next.value;

                  // query = await this.fetchRelation(driver, paramstring);
                  // // query = await this.fetchRelations(driver, paramstring).next();
                  value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

                }

              }

              const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

              KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);

            }

          }

        }

      }

    }

  }

  // async processWilds() {
  //
  //   const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "wild");
  //
  //   if (orders) {
  //
  //     for (let driver in orders) {
  //
  //       let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, "");
  //
  //       if (!query || !query.requestedIds) {
  //
  //         query = {driver, paramstring: "", type: "query", requestedIds: new Set()};
  //
  //       }
  //
  //       for (let id in orders[driver]) {
  //
  //         for (let key in orders[driver][id]) {
  //
  //           let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
  //
  //           while (!value) {
  //
  //             if (query.complete && query.requestedIds.has(id)) {
  //
  //               value = [];
  //
  //             } else {
  //
  //               if (!query.requestedIds.has(id)) {
  //
  //                 query.requestedIds.add(id);
  //                 query.complete = false;
  //                 query.queried = false;
  //                 query.relationIndex = 0;
  //
  //                 // await KarmaFieldsAlpha.Database.Queries.set(query, "query");
  //
  //               }
  //
  //               const result = await this.fetch(query).next();
  //
  //               query = result.value;
  //
  //               // if (query.queried) {
  //               //
  //               //   query = await this.fetchQuery(driver, "");
  //               //
  //               // } else {
  //               //
  //               //   query = await this.fetchRelations(driver, "");
  //               //
  //               // }
  //
  //               value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
  //
  //             }
  //
  //           }
  //
  //           const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);
  //
  //           KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);
  //
  //         }
  //
  //       }
  //
  //
  //     }
  //
  //   }
  //
  // }

  async processWilds() {

    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "wild");

    if (orders) {

      for (let driver in orders) {

        let query = await KarmaFieldsAlpha.Database.Queries.get("wild", driver, "");

        const ids = Object.keys(orders[driver]);

        if (!query || !query.requestedIds) {

          query = {driver, paramstring: "", type: "wild", requestedIds: new Set(ids)};

        }

        for (let id in orders[driver]) {

          for (let key in orders[driver][id]) {

            let value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

            while (!value) {

              if (query.complete && query.requestedIds.has(id)) {

                value = [];

              } else {

                // if (!query.requestedIds.has(id)) {
                //
                //   query.requestedIds.add(id);
                //   query.complete = false;
                //   query.queried = false;
                //   query.relationIndex = 0;
                //
                // }

                if (ids.some(id => !query.requestedIds.has(id))) {

                  query.requestedIds = new Set(ids);
                  query.complete = false;
                  query.queried = false;
                  query.relationIndex = 0;

                }

                await this.fetch(query).next();

                value = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

              }

            }

            const delta = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);

            KarmaFieldsAlpha.DeepObject.set(this.store, delta || value, "vars", driver, id, key);

          }

        }


      }

    }

  }


  async processCounts() {

    const orders = KarmaFieldsAlpha.DeepObject.get(this.orders, "count");

    if (orders) {

      for (let driver in orders) {

        for (let paramstring in orders[driver]) {

          let query = await KarmaFieldsAlpha.Database.Queries.get("count", driver, paramstring);

          if (!query) {

            query = {type: "count", driver, paramstring};

            await this.count(query);

          }

          KarmaFieldsAlpha.DeepObject.set(this.store, query.count || 0, "count", driver, paramstring);

        }

      }

    }

  }

  async init() {

    await this.initStates();
    await this.initDelta();

  }

  async process() {


    await this.processIds();
    await this.processCounts();
    await this.processWilds();
    await this.processVars();

    this.orders = {};

  }

  hasOrder() {

    return this.orders.filled;

  }



  async fetchQuery(query) {



    const relations = KarmaFieldsAlpha.Driver.getRelations(query.driver) || [];
    const idAlias = KarmaFieldsAlpha.Driver.getAlias(query.driver, "id");

    let paramstring = query.paramstring;

    // if (!paramstring) {
    if (query.type === "wild") {

      if (!query.requestedIds || !query.requestedIds.size) {

        console.error("wild query holds no ids!");

      }

      paramstring = `ids=${[...query.requestedIds].join(",")}`;

    }

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${query.driver}`, paramstring);

    if (results) {

      query.queriedIds = results.map(result => result[idAlias]);

      const items = [];

      for (let result of results) {

        const id = result[idAlias];

        for (let key in result) {

          // items.push({id, key, data: [result[key]]});
          items.push({id, key, data: result[key]});

        }

      }

      await KarmaFieldsAlpha.Database.Vars.insert(items, query.driver);

    } else {

      query.queriedIds = [];

    }

    query.queried = true;
    query.complete = relations.length === 0 || query.queriedIds.length === 0;

    await KarmaFieldsAlpha.Database.Queries.set(query);

    return query;

  }

  // async fetchQuery(driver, paramstring) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query") || {};
  //
  //   if (!paramstring) {
  //
  //     if (!query.requestedIds || !query.requestedIds.size) {
  //
  //       console.error("wild query hold no ids!");
  //
  //     }
  //
  //     paramstring = `ids=${[...query.requestedIds].join(",")}`;
  //
  //   }
  //
  //   const results = await KarmaFieldsAlpha.HTTP.get(`query/${driver}`, paramstring);
  //
  //   if (results) {
  //
  //     query.queriedIds = results.map(result => result[idAlias]);
  //
  //     const items = [];
  //
  //     for (let result of results) {
  //
  //       const id = result[idAlias];
  //
  //       for (let key in result) {
  //
  //         items.push({id, key, data: [result[key]]});
  //
  //       }
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //   } else {
  //
  //     query.queriedIds = [];
  //
  //   }
  //
  //   query.queried = true;
  //
  //   // query.complete = Boolean(query.queried && (!query.queriedIds || !query.queriedIds.length || (query.relationIndex || 0) >= relations.length));
  // query.complete = Boolean(query.queried && (!query.queriedIds || !query.queriedIds.length || (query.relationIndex || 0) >= relations.length));
  //
  // await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  // return query;
  //
  // }


  // async fetchRelation(driver, paramstring) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query");
  //   let queriedIds = query.queriedIds || [];
  //   let index = query.relationIndex || 0;
  //
  //   if (index < relations.length && queriedIds.length) {
  //
  //     const relation = relations[index];
  //     const max = 100;
  //
  //     for (let i = 0; i < queriedIds.length; i += max) {
  //
  //       const paramstring = `ids=${queriedIds.slice(i, i + max).join(",")}`;
  //
  //       const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);
  //
  //       if (results && results.length) {
  //
  //         // await this.storeRelations(results);
  //
  //         const dataset = {};
  //
  //         for (let result of results) {
  //
  //           const id = result.id.toString();
  //           const key = result.key.toString();
  //
  //           if (!dataset[id]) {
  //
  //             dataset[id] = {};
  //
  //           }
  //
  //           if (!dataset[id][key]) {
  //
  //             dataset[id][key] = [];
  //
  //           }
  //
  //           dataset[id][key].push(result.value);
  //
  //         }
  //
  //         const items = [];
  //
  //         for (let id in dataset) {
  //
  //           for (let key in dataset[id]) {
  //
  //             items.push({id, key, data: dataset[id][key]});
  //
  //           }
  //
  //         }
  //
  //         await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //       }
  //
  //     }
  //
  //     index++;
  //
  //   }
  //
  //   query.complete = Boolean(query.queried && (queriedIds.length === 0 || index >= relations.length));
  //   query.queriedIds = queriedIds;
  //   query.relationIndex = index;
  //
  //   await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //   return query;
  //
  // }


  // async *fetchRelations(driver, paramstring, index = 0, length = Infinity) {
  //
  //   const relations = KarmaFieldsAlpha.Driver.getRelations(driver) || [];
  //   const idAlias = KarmaFieldsAlpha.Driver.getAlias(driver, "id");
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "query");
  //
  //   if (!query) {
  //
  //     console.error("Fetching relations but query doesnt exist");
  //
  //   }
  //
  //   if (!query.queriedIds) {
  //
  //     console.error("queriedIds not found in query");
  //
  //   }
  //
  //   // let queriedIds = query.queriedIds || [];
  //
  //   // if (index < Math.min(relations.length, length) && queriedIds.length) {
  //
  //   if (query && query.queriedIds && query.queriedIds.length) {
  //
  //     for (let i = 0; i < Math.min(relations.length, length); i++) {
  //
  //       const relation = relations[index + i];
  //       const max = 100;
  //
  //       for (let j = 0; j < query.queriedIds.length; j += max) {
  //
  //         const paramstring = `ids=${query.queriedIds.slice(j, j + max).join(",")}`;
  //
  //         const results = await KarmaFieldsAlpha.HTTP.get(`relations/${driver}/${relation}`, paramstring);
  //
  //         if (results && results.length) {
  //
  //           // await this.storeRelations(results);
  //
  //           const dataset = {};
  //
  //           for (let result of results) {
  //
  //             const id = result.id.toString();
  //             const key = result.key.toString();
  //
  //             if (!dataset[id]) {
  //
  //               dataset[id] = {};
  //
  //             }
  //
  //             if (!dataset[id][key]) {
  //
  //               dataset[id][key] = [];
  //
  //             }
  //
  //             dataset[id][key].push(result.value);
  //
  //           }
  //
  //           const items = [];
  //
  //           for (let id in dataset) {
  //
  //             for (let key in dataset[id]) {
  //
  //               items.push({id, key, data: dataset[id][key]});
  //
  //             }
  //
  //           }
  //
  //           await KarmaFieldsAlpha.Database.Vars.insert(items, driver);
  //
  //         }
  //
  //       }
  //
  //       query.relationIndex = index + i + 1;
  //       query.complete = query.relationIndex >= relations.length;
  //
  //       await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //       yield query;
  //
  //     }
  //
  //   } else {
  //
  //     query.complete = true;
  //
  //     await KarmaFieldsAlpha.Database.Queries.set(query, driver, paramstring, "query");
  //
  //   }
  //
  // }

  async *fetchRelations(query) {

    const relations = KarmaFieldsAlpha.Driver.getRelations(query.driver) || [];
    const idAlias = KarmaFieldsAlpha.Driver.getAlias(query.driver, "id");

    // const offset = query.relationIndex || 0;

    if (query.queriedIds && query.queriedIds.length) {

      // for (let i = 0; i < relations.length; i++) {
      for (let index = query.relationIndex || 0; index < relations.length; index++) {

        const relation = relations[index];
        const max = 100;

        for (let j = 0; j < query.queriedIds.length; j += max) {

          const paramstring = `ids=${query.queriedIds.slice(j, j + max).join(",")}`;

          const results = await KarmaFieldsAlpha.HTTP.get(`relations/${query.driver}/${relation}`, paramstring);

          if (results && results.length) {

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

            await KarmaFieldsAlpha.Database.Vars.insert(items, query.driver);

          }

        }

        query.relationIndex = index + 1;
        query.complete = query.relationIndex >= relations.length;

        await KarmaFieldsAlpha.Database.Queries.set(query);

        yield query;

      }

    } else {

      query.complete = true;

      await KarmaFieldsAlpha.Database.Queries.set(query);

    }

  }

  async *fetch(query) {

    // const query = await KarmaFieldsAlpha.Database.Queries.get(driver, paramstring, "count");

    if (!query.queried) {

      yield this.fetchQuery(query);

    }

    yield* this.fetchRelations(query);

  }


  async count(query) {

    // const query = await KarmaFieldsAlpha.Database.Queries.get("count", query.driver, query.paramstring);

    query.count = await KarmaFieldsAlpha.HTTP.get(`count/${query.driver}`, query.paramstring) || 0;
    query.queried = true;

    await KarmaFieldsAlpha.Database.Queries.set(query);

    return query;

  }





  async setIds(ids, driver, paramstring) {

    // const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    let current = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

    if (!current) {

      const query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

      current = query.queriedIds;

    }

    if (current) {


      KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);

      await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
      await KarmaFieldsAlpha.History.write(ids, current, "queries", driver, paramstring, "ids"); // update history

    }

  }

  async setValue(value, driver, id, key) {

    // let current = await KarmaFieldsAlpha.Database.States.get("external", driver, id, key);
    //
    // if (!current) {
    //
    //   current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);
    //
    // }

    const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

    if (current) {

      key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
      value = new KarmaFieldsAlpha.Content(value).toArray();

      KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

      if (typeof id !== "symbol") {

        await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
        await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history

      }



    }

  }

  async setValueAt(value, driver, paramstring, index, key) {

    const ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    if (ids) {

      const id = ids[index];

      if (id) {

        const current = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, id, key);

        if (current) {

          key = KarmaFieldsAlpha.Driver.getAlias(driver, key);
          value = new KarmaFieldsAlpha.Content(value).toArray();

          KarmaFieldsAlpha.DeepObject.set(this.store, value, "vars", driver, id, key);

          if (typeof id !== "symbol") {

            await KarmaFieldsAlpha.Database.States.set(value, "external", driver, id, key);
            await KarmaFieldsAlpha.History.write(value, current, "external", driver, id, key); // update history

          }

        }

      } else {

        console.error("Trying to set value at index out of bounds");

      }

    }

  }




  // async addItem(token, driver, paramstring, params) {
  //
  //   console.error("deprecated");
  //
  //   let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, params);
  //
  //   id = id.toString();
  //
  //   // replace token by id in queries states
  //   const states = await KarmaFieldsAlpha.Database.States.select("external", driver, token);
  //
  //   if (states) {
  //
  //     KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));
  //
  //   }
  //
  //   await KarmaFieldsAlpha.Database.States.remove("external", driver, token);
  //
  //   await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //   await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");
  //
  //   let ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");
  //
  //   ids = ids.map(item => item === token ? id : item);
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //
  // }


  createToken() {

    let index = KarmaFieldsAlpha.tokenIndex || 0;

    index++;

    KarmaFieldsAlpha.tokenIndex = index;

    return `_${index}`;

  }

  // async *add(driver, paramstring, index, length, defaults, data) {
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     const token = this.createToken();
  //     tokens.push(token);
  //
  //     const itemData = data && data[i];
  //     const params = {...defaults, ...itemData};
  //
  //     for (let key in params) {
  //
  //       await KarmaFieldsAlpha.Database.States.set([params[key]], "external", driver, token, key); // do not update history
  //
  //     }
  //
  //   }
  //
  //   let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
  //
  //   if (!query) {
  //
  //     query = {type: "query", driver, paramstring};
  //
  //     await this.fetch(query).next();
  //
  //   }
  //
  //   const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");
  //
  //   const previousIds = delta || query.queriedIds || [];
  //   let ids = [...previousIds];
  //   ids.splice(index, 0, ...tokens);
  //
  //   await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids"); // do not update history
  //
  //   KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //   for (let token of tokens) {
  //
  //     // await KarmaFieldsAlpha.server.addItem(token, driver, paramstring, params);
  //     //
  //     // await this.render();
  //
  //     yield true;
  //
  //     let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, defaults);
  //
  //     id = id.toString();
  //
  //     // replace token by id in queries states
  //     const states = await KarmaFieldsAlpha.Database.States.select("external", driver, token);
  //
  //     if (states) {
  //
  //       KarmaFieldsAlpha.Database.States.insert(states.map(item => ({...item, id})));
  //
  //     }
  //
  //     await KarmaFieldsAlpha.Database.States.remove("external", driver, token);
  //
  //     await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
  //     await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");
  //
  //     ids = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids"); // reload in case it changed inbetween
  //
  //     ids = ids.map(item => item === token ? id : item);
  //
  //     await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
  //
  //     KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //     // KarmaFieldsAlpha.DeepObject.set(this.store, ids, "ids", driver, paramstring);
  //
  //   }
  //
  //   await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history
  //
  // }

  async *add(driver, paramstring, index, length, defaults, data) {

    // -> alias keys
    defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

    const tokens = [];

    for (let i = 0; i < length; i++) {

      // const token = this.createToken();
      const token = Symbol("token");
      tokens.push(token);

      const itemData = data && data[i] && Object.fromEntries(Object.entries(data[i]).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

      const params = {...defaults, ...itemData};

      for (let key in params) {

        KarmaFieldsAlpha.DeepObject.set(this.store, [params[key]], "vars", driver, token, key);

      }

    }

    let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    let previousIds = ids.filter(id => typeof id !== "symbol");

    ids.splice(index, 0, ...tokens);

    for (let token of tokens) {

      yield;

      let id = await KarmaFieldsAlpha.HTTP.post(`add/${driver}`, defaults);

      id = id.toString();

      ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

      const index = ids.indexOf(token);

      if (index > -1) {

        ids[index] = id;

      }

      const delta = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, token);

      if (delta) {

        KarmaFieldsAlpha.DeepObject.set(this.store, delta, "vars", driver, id);
        KarmaFieldsAlpha.DeepObject.remove(this.store, "vars", driver, token);

        for (let key in delta) {

          await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
          await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

        }

      }

      await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
      await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
      await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");

    }

    ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    ids = ids.filter(id => typeof id !== "symbol"); // filter tokens

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history

  }


  async *delete(driver, paramstring, index, length) {

    // let ids = this.getIds();
    //
    // while (ids.loading) {
    //
    //   await this.render();
    //   ids = this.getIds();
    //
    // }

    let query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);

    if (!query) {

      query = {type: "query", driver, paramstring};

      await this.fetch(query).next();

    }

    const delta = await KarmaFieldsAlpha.Database.States.get("queries", driver, paramstring, "ids");

    const previousIds = delta || query.queriedIds || [];

    const newIds = [...previousIds];

    const removedIds = newIds.splice(index, length);

    for (let id of removedIds) {

      // await KarmaFieldsAlpha.Database.Vars.set(["1"], driver, id, "trash");
      await KarmaFieldsAlpha.Database.States.set(["1"], "external", driver, id, "trash");
      await KarmaFieldsAlpha.History.write(["1"], ["0"], "external", driver, id, "trash");

    }

    await KarmaFieldsAlpha.Database.States.set(newIds, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(newIds, previousIds, "queries", driver, paramstring, "ids");

    KarmaFieldsAlpha.DeepObject.set(this.store, newIds, "ids", driver, paramstring);

    // yield;
    // await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, Object.fromEntries(removedIds.map(id => [id, {trash: ["1"]}])));

  }




  // async getOptionsList() {
  //
  //   console.error("deprecated");
  //
  //   const content = new KarmaFieldsAlpha.Content();
  //
  //   content.value = [];
  //
  //   for (let id of this.ids) {
  //
  //     const name = await this.getValue(id, "name");
  //
  //     if (name.loading) {
  //
  //       content.loading = true;
  //
  //     }
  //
  //     content.value.push({
  //       id: id,
  //       name: name.toString()
  //     });
  //
  //   }
  //
  //   return content;
  //
  // }

  // createTokens(length) {
  //
  //   const tokens = [];
  //
  //   for (let i = 0; i < length; i++) {
  //
  //     tokens.push(Symbol("token"));
  //
  //   }
  //
  //   return tokens;
  //
  // }

  async *upload(driver, paramstring, index, files, defaults) { // }, tokens) {

    // if (!tokens || tokens.length !== files.length) {
    //
    //   tokens = this.createTokens(files.length);
    //
    // }

    const tokens = [];

    // -> alias keys
    defaults = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [KarmaFieldsAlpha.Driver.getAlias(driver, key), value]));

    for (let i = 0; i < files.length; i++) {

      const token = Symbol("token");
      tokens.push(token);

      // const token = tokens[i];

      for (let key in defaults) {

        KarmaFieldsAlpha.DeepObject.set(this.store, [defaults[key]], "vars", driver, token, key);

      }

    }

    let ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    let previousIds = ids.filter(id => typeof id !== "symbol");

    ids.splice(index, 0, ...tokens);

    const createdIds = [];

    for (let file of files) {

      const token = tokens.shift();

      yield token;



      // await server.upload(file, token, filters);

      let id = await KarmaFieldsAlpha.HTTP.upload(file); // -> parent and params need to be saved later

      id = id.toString();

      createdIds.push(id);

      ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

      const index = ids.indexOf(token);

      if (index > -1) {

        ids[index] = id;

      }

      const delta = KarmaFieldsAlpha.DeepObject.get(this.store, "vars", driver, token);

      if (delta) {

        KarmaFieldsAlpha.DeepObject.set(this.store, delta, "vars", driver, id);
        KarmaFieldsAlpha.DeepObject.remove(this.store, "vars", driver, token);

        for (let key in delta) {

          await KarmaFieldsAlpha.Database.States.set(delta[key], "external", driver, id, key);
          await KarmaFieldsAlpha.History.write(delta[key], [], "external", driver, id, key);

        }

      }

      await KarmaFieldsAlpha.Database.Vars.set(["0"], driver, id, "trash");
      await KarmaFieldsAlpha.Database.States.set(["0"], "external", driver, id, "trash");
      await KarmaFieldsAlpha.History.write(["0"], ["1"], "external", driver, id, "trash");

      if (Object.values(defaults).length) {

        const payload = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, [value]]));

        await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, {[id]: payload});

      }

    }

    ids = KarmaFieldsAlpha.DeepObject.get(this.store, "ids", driver, paramstring);

    ids = ids.filter(id => typeof id !== "symbol"); // filter tokens

    await KarmaFieldsAlpha.Database.States.set(ids, "queries", driver, paramstring, "ids");
    await KarmaFieldsAlpha.History.write(ids, previousIds, "queries", driver, paramstring, "ids"); // update history


    const query = await KarmaFieldsAlpha.Database.Queries.get("query", driver, paramstring);
    query.complete = false;
    query.queried = 0;
    query.relationIndex = 0;

    await KarmaFieldsAlpha.Database.Queries.set(query);

    // yield;


    // const gen = this.fetch({type: "wild", driver, paramstring: "", requestedIds: new Set(createdIds)});
    //
    // for await (let query of gen) {
    //
    //   yield;
    //
    // }

  }


  // async *getImage(id, driver = "medias") {
  //
	// 	const object = {};
  //
	// 	let filename = this.queryValue(driver, id, "filename");
	// 	let dir = this.queryValue(driver, id, "dir");
	// 	let mimetype = this.queryValue(driver, id, "mimetype");
	// 	let imageWidth = this.queryValue(driver, id, "width");
	// 	let imageHeight = this.queryValue(driver, id, "height");
  //
	// 	while (filename.loading || dir.loading || mimetype.loading || imageWidth.loading || imageHeight.loading) {
  //
  //     yield;
  //
	// 		filename = this.queryValue(driver, id, "filename");
	// 		dir = this.queryValue(driver, id, "dir");
	// 		mimetype = this.queryValue(driver, id, "mimetype");
	// 		imageWidth = this.queryValue(driver, id, "width");
	// 		imageHeight = this.queryValue(driver, id, "height");
  //
	// 	}
  //
	// 	object.width = imageWidth.toString();
	// 	object.height = imageHeight.toString();
	// 	object.src = `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${filename.toString()}`;
  //
	// 	if (mimetype.toString() === "image/jpeg" || mimetype.toString() === "image/jpg" || mimetype.toString() === "image/png" || mimetype.toString() === "image/webp") {
  //
	// 		let sizes = this.getWild("medias", object.id, "sizes");
  //
	// 		while (sizes.loading) {
  //
  //       yield;
  //
	// 			sizes = this.queryValue(driver, object.id, "sizes");
  //
	// 		}
  //
	// 		if (sizes.toArray().length) {
  //
	// 			object.srcset = sizes.toArray().map(size => `${KarmaFieldsAlpha.uploadURL}${dir.toString()}/${size.filename} ${size.width}w`).join(",");
	// 			object.sizes = "(min-width: 1024px) 1024px, 100vw";
  //
	// 		}
  //
	// 	}
  //
  //
	// }








  async submit() {

    const edits = this.edits();
    const delta = await this.groupData(edits);

    for (let driver in delta) {

      // yield;

      await KarmaFieldsAlpha.HTTP.post(`update/${driver}`, delta[driver]);

      await KarmaFieldsAlpha.Database.States.remove("external", driver);
      await KarmaFieldsAlpha.Database.Queries.remove({driver});
      await KarmaFieldsAlpha.Database.States.remove("queries", driver);

      for (let id in delta[driver]) {

        for (let key in delta[driver][id]) {

          await KarmaFieldsAlpha.Database.Vars.set(delta[driver][id][key], driver, id, key);

        }

      }

    }

    // for await (let edit of edits) {
    //
    //   await KarmaFieldsAlpha.Database.Vars.set(edit.data, edit.driver, edit.id, edit.key);
    //
    // }

  }

  async isValueModified(value, driver, id, key) {

    const current = await KarmaFieldsAlpha.Database.Vars.get(driver, id, key);

    return !KarmaFieldsAlpha.DeepObject.equal(value, current);

  }

  async groupData(items) {

    const output = {};

    for await (let item of items) {

      if (!output[item.driver]) {

        output[item.driver] = {};

      }

      if (!output[item.driver][item.id]) {

        output[item.driver][item.id] = {};

      }

      output[item.driver][item.id][item.key] = item.data;

    }

    return output;

  }

  getDelta() { // compat

    const edits = this.edits();

    return this.groupData(edits);

  }

  async *edits() {

    const edits = await KarmaFieldsAlpha.Database.States.select("external");

    for (let item of edits) {

      const isModified = await this.isValueModified(item.data, item.driver, item.id, item.key);

      if (isModified) {

        yield item;

      }

    }

  }

  async initDelta() {

    const result = await this.edits().next();

    KarmaFieldsAlpha.DeepObject.set(this.store, !result.done, "delta");

  }

  hasDelta() {

    return KarmaFieldsAlpha.DeepObject.get(this.store, "delta") || false;

  }


}

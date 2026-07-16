
KarmaFieldsAlpha.Task = class {

  static get() {

    return KarmaFieldsAlpha.Store.get("tasks");

  }

  static set(tasks) {

    KarmaFieldsAlpha.Store.set(tasks, "tasks");

  }

  static add(task) {

    const tasks = this.get() || [];

    this.set([...tasks, task]);

  }

  static find(callback) {

    const tasks = this.get();

    if (tasks) {

      return tasks.find(callback);

    }

  }

  static has() {

    const tasks = this.get();

    return tasks && tasks.length > 0 || false;

  }

};


KarmaFieldsAlpha.Task.Query = class {

  // static getOrCreate(driver, ...params) {
  //
  //   let task = this.find(task => task.driver === driver && task.context === context && task.constructor === this);
  //
  //   if (!task) {
  //
  //     task = new this(driver, ...params);
  //
  //     KarmaFieldsAlpha.Store.Tasks.add(task);
  //
  //   }
  //
  //   return task;
  //
  // }



  static create(...params) {

    const task = new this(...params);

    KarmaFieldsAlpha.Store.Tasks.add(task);

    return task;

  }

  constructor(driver, context, priority) {

    this.name = "Loading Data";
    this.type = "query";
    this.driver = driver;
    this.context = context;
    this.priority = priority;

  }

  createQuery(results) {

    const idAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "id");
    const nameAlias = KarmaFieldsAlpha.Driver.getAlias(this.driver, "name");

    const items = [];

    if (results) {

      for (let item of results) {

        items.push({
          id: item[idAlias],
          name: item[nameAlias]
        });

      }

    }

    // return results.map(item => ({id: item[idAlias], name: item[nameAlias]}));

    return items;

  }

  writeData(dataset) {

    for (let id in dataset) {

      for (let key in dataset[id]) {

        KarmaFieldsAlpha.Store.set(dataset[id][key], "vars", this.context, this.driver, id, key);

      }

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

  createRelationDataset(relations) {

    const data = {};

    if (relations) {

      for (let relation of relations) {

        const id = relation.id.toString();
        const key = relation.key.toString();

        if (!data[id]) {

          data[id] = {};

        }

        if (!data[id][key]) {

          data[id][key] = [];

        }

        data[id][key].push(relation.value);

      }

    }

    return data;
  }

}

// KarmaFieldsAlpha.Task.QueryRemoteItems = class extends KarmaFieldsAlpha.Task.Query {
//
//   // static find(driver) {
//   //
//   //   return this.find(task => task.driver === driver && task.constructor === this);
//   //
//   // }
//
//
//   constructor(driver, paramstring) {
//
//     super(driver);
//
//     this.type = "query";
//     this.paramstring = paramstring;
//
//   }
//
//   async resolve() {
//
//     const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);
//
//     await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, this.paramstring);
//
//     const items = this.createQuery(results);
//     const dataset = this.createQueryDataset(results);
//
//     this.writeData(dataset, "remote");
//
//     // for (let item of items) {
//     //
//     //   KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, item.id, "query");
//     //
//     // }
//
//     KarmaFieldsAlpha.Store.set(items, "items", "remote", this.driver, this.paramstring);
//
//   }
//
// }
//
// KarmaFieldsAlpha.Task.QueryCacheItems = class extends KarmaFieldsAlpha.Task.QueryRemoteItems {
//
//   constructor(driver, paramstring) {
//
//     super(driver, paramstring);
//
//     // this.type = "cache-query";
//     this.priority = 1;
//
//   }
//
//   async resolve() {
//
//     const results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);
//
//     if (results) {
//
//       const items = this.createQuery(results);
//       const dataset = this.createQueryDataset(results);
//
//       this.writeData(dataset, "cache");
//
//       // for (let item of items) {
//       //
//       //   KarmaFieldsAlpha.Store.set(true, "attempts", "cache", this.driver, item.id, "query");
//       //
//       // }
//
//       KarmaFieldsAlpha.Store.set(items, "items", "cache", this.driver, this.paramstring);
//
//     } else {
//
//       KarmaFieldsAlpha.Store.set(true, "items", "notFound", "cache", this.driver, this.paramstring); // avoid further database queries
//
//     }
//
//   }
//
// }
//

KarmaFieldsAlpha.Task.QueryItems = class extends KarmaFieldsAlpha.Task.Query {

  static find(driver, paramstring) {

    return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver && task.paramstring === paramstring);

  }

  constructor(driver, paramstring, context = "remote", priority = 0) {

    super(driver, context, priority);

    // this.type = "query";
    this.paramstring = paramstring;

  }

  async resolve() {

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}${this.paramstring ? `?${this.paramstring}` : ""}`);

    await KarmaFieldsAlpha.Database.Queries.set(results, "query", this.driver, this.paramstring);

    const items = this.createQuery(results);
    const dataset = this.createQueryDataset(results);

    this.writeData(dataset);

    // for (let item of items) {
    //
    //   KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, item.id, "query");
    //
    // }

    KarmaFieldsAlpha.Store.set(items, "items", "remote", this.driver, this.paramstring);

  }

}

KarmaFieldsAlpha.Task.QueryItemsCache = class extends KarmaFieldsAlpha.Task.QueryItems {

  constructor(driver, paramstring, context = "cache", priority = 1) {

    super(driver, paramstring, context, priority);

  }

  async resolve() {

    const results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, this.paramstring);

    if (results) {

      const items = this.createQuery(results);
      const dataset = this.createQueryDataset(results);

      this.writeData(dataset, "remote");

      KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, this.paramstring);

    } else {

      KarmaFieldsAlpha.Store.set([], "items", this.context, this.driver, this.paramstring); // -> will get stuck into getRelations if ommited
      KarmaFieldsAlpha.Store.set(true, "items", "notFound", this.context, this.driver, this.paramstring);

    }

  }

}





KarmaFieldsAlpha.Task.QueryValue = class extends KarmaFieldsAlpha.Task.Query {

  static find(driver) {

    return KarmaFieldsAlpha.Task.find(task => task.constructor === this && task.driver === driver);

  }

  constructor(driver, context = "remote", priority = 0) {

    super(driver, context, priority);

    // this.type = "remote-query";
    this.ids = new Set();
    this.keys = new Set();
    // this.attempt = attempt;

    // this.context = context;
    // this.priority = priority;

  }

  getRelation(paramstring) {

    if (!KarmaFieldsAlpha.Store.get("items", this.context, this.driver, paramstring)) {

      return "query";

    } else {

      const relations = KarmaFieldsAlpha.Driver.getRelations(this.driver);

      for (let relation of relations) {

        if (!KarmaFieldsAlpha.Store.get("relations", this.context, this.driver, relation, paramstring)) {

          return relation;

        }

      }

    }

  }

  async query(paramstring) {

    const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${paramstring}`);

    await KarmaFieldsAlpha.Database.Queries.set(results || [], "query", this.driver, paramstring);

    const dataset = this.createQueryDataset(results);

    this.writeData(dataset);

    const items = this.createQuery(results);

    KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, paramstring);

  }

  async queryRelation(relation, paramstring) {

    const results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);

    await KarmaFieldsAlpha.Database.Queries.set(results || [], relation, this.driver, paramstring);

    const dataset = this.createRelationDataset(results);

    this.writeData(dataset);

    KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, relation, paramstring);

  }

  async resolve() {

    const paramstring = `ids=${[...this.ids].join(",")}`;

    const relation = this.getRelation(paramstring);

    if (relation === "query") {

      await this.query(paramstring);

      // const results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${paramstring}`);

      // let results;
      //
      // if (this.context === "remote") {
      //
      //   results = await KarmaFieldsAlpha.HTTP.get(`query/${this.driver}?${paramstring}`);
      //
      //   await KarmaFieldsAlpha.Database.Queries.set(results || [], "query", this.driver, paramstring);
      //
      // } else if (this.context === "cache") {
      //
      //   results = await KarmaFieldsAlpha.Database.Queries.get(this.attempt, this.driver, paramstring);
      //
      // }

      // const dataset = this.createQueryDataset(results);
      //
      // this.writeData(dataset, this.context);
      //
      // const items = this.createQuery(results);
      //
      // KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, this.paramstring);

    } else if (relation) {

      await this.queryRelation(relation, paramstring);

      // const relations = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${this.attempt}?${paramstring}`);

      // let results;
      //
      // if (this.context === "remote") {
      //
      //   results = await KarmaFieldsAlpha.HTTP.get(`relations/${this.driver}/${relation}?${paramstring}`);
      //
      //   await KarmaFieldsAlpha.Database.Queries.set(results, relation, this.driver, paramstring);
      //
      // } else if (this.context === "cache") {
      //
      //   results = await KarmaFieldsAlpha.Database.Queries.get(relation, this.driver, paramstring);
      //
      // }
      //
      // // await KarmaFieldsAlpha.Database.Queries.set(relations, this.attempt, this.driver, paramstring);
      //
      // const dataset = this.createRelationDataset(results);
      //
      // this.writeData(dataset, this.context);
      //
      // KarmaFieldsAlpha.Store.set(true, "attempts", this.context, relation, this.driver, paramstring);

    } else {

      for (let id of this.ids) {

        for (let key of this.keys) {

          // KarmaFieldsAlpha.Store.set([], "vars", "remote", this.driver, id, key);

          KarmaFieldsAlpha.Store.set(true, "vars", "notFound", this.context, this.driver, id, key);

        }

      }

    }

    // for (let id of this.ids) {
    //
    //   KarmaFieldsAlpha.Store.set(true, "attempts", "remote", this.driver, id, this.attempt);
    //
    // }



  }

}


KarmaFieldsAlpha.Task.QueryValueCache = class extends KarmaFieldsAlpha.Task.QueryValue {

  constructor(driver, context = "cache", priority = 1) {

    super(driver, context, priority);

  }

  async query(paramstring) {

    const results = await KarmaFieldsAlpha.Database.Queries.get("query", this.driver, paramstring);

    const dataset = this.createQueryDataset(results);

    this.writeData(dataset);

    const items = this.createQuery(results);

    KarmaFieldsAlpha.Store.set(items, "items", this.context, this.driver, paramstring);

  }

  async queryRelation(relation, paramstring) {

    const results = await KarmaFieldsAlpha.Database.Queries.get(relation, this.driver, paramstring);

    await KarmaFieldsAlpha.Database.Queries.set(results || [], relation, this.driver, paramstring);

    const dataset = this.createRelationDataset(results);

    this.writeData(dataset);

    KarmaFieldsAlpha.Store.set(true, "relations", this.context, this.driver, relation, paramstring);

  }

}


// KarmaFieldsAlpha.Task.QueryCacheValue = class extends KarmaFieldsAlpha.Task.QueryRemoteValue {
//
//   constructor(driver, attempt) {
//
//     super(driver, attempt);
//
//     this.type = "cache-query";
//     this.priority = 1;
//
//   }
//
//   async resolve() {
//
//     const paramstring = `ids=${[...this.ids].join(",")}`;
//
//     const results = await KarmaFieldsAlpha.Database.Queries.get(this.attempt, this.driver, paramstring);
//
//     if (results) {
//
//       if (this.attempt === "query") {
//
//         const dataset = this.createQueryDataset(results);
//
//         this.writeData(dataset, "cache");
//
//       } else {
//
//         const dataset = this.createRelationDataset(results);
//
//         this.writeData(dataset, "cache");
//
//       }
//
//     }
//
//     for (let id of this.ids) {
//
//       KarmaFieldsAlpha.Store.set(true, "attempts", "cache", this.driver, id, this.attempt);
//
//     }
//
//   }
//
// }


KarmaFieldsAlpha.Task.Save = class {

  static create() {

    if (KarmaFieldsAlpha.Task.find(task => task.constructor === this)) {

      const task = new this();

      KarmaFieldsAlpha.Task.add(task);

    }

  }

  getDelta() {

    const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items");
    const delta = {};

    if (deltaItems) {

      for (let driver in deltaItems) {

        for (let paramstring in deltaItems[driver]) {

          const data = deltaItems[driver][paramstring];

          for (let row of data) {

            if (!row.id || row.delta) {

              if (!delta[driver]) {

                delta[driver] = [];

              }

              delta[driver].push(row);

            }

          }

        }

      }

    }

    const trash = KarmaFieldsAlpha.Store.Delta.get("trash");

    if (trash) {

      for (let driver in trash) {

        const ids = trash[driver];

        for (let id of ids) {

          if (ids && ids.length) {

            if (!delta[driver]) {

              delta[driver] = [];

            }

            delta[driver].push({
              id: id,
              delta: {trash: ["1"]}
            });

          }

        }

      }

    }

    return delta;
  }

  async update() {

    const deltaItems = KarmaFieldsAlpha.Store.Delta.get("items");

    if (deltaItems) {

      for (let driver in deltaItems) {

        for (let paramstring in deltaItems[driver]) {

          const data = deltaItems[driver][paramstring];
          const items = data.map(item => ({id: item.id}));

          KarmaFieldsAlpha.Store.set(items, "items", "cache", driver, paramstring);
          KarmaFieldsAlpha.Store.remove("items", "notFound", "cache", driver, paramstring);
          KarmaFieldsAlpha.Store.remove("items", "remote", driver, paramstring);
          KarmaFieldsAlpha.Store.remove("relations", "remote", driver);

          for (let row of data) {

            if (row.delta) {

              for (let key in row.delta) {

                KarmaFieldsAlpha.Store.set(row.delta[key], "vars", "cache", driver, row.id, key);
                KarmaFieldsAlpha.Store.remove("vars", "notFound", "cache", driver, row.id, key);
                KarmaFieldsAlpha.Store.remove("vars", "remote", driver, row.id, key);

              }

            }

          }

          // await KarmaFieldsAlpha.Database.Queries.remove("query", driver, paramstring);

        }

        await KarmaFieldsAlpha.Database.Queries.removeDriver(driver);

      }

    }

  }

  async resolve() {

    const delta = this.getDelta();

    await this.update();

    for (let driver in delta) {

      await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, delta[driver]);

    }

    KarmaFieldsAlpha.Store.Delta.remove("items");
    KarmaFieldsAlpha.Store.Delta.remove("trash");

  }

  // async resolveXX() {
  //
  //   const delta = KarmaFieldsAlpha.Store.Delta.get("items");
  //
  //   KarmaFieldsAlpha.Store.Delta.remove("items");
  //
  //   if (delta) {
  //
  //     for (let driver in delta) {
  //
  //       for (let paramstring in items[driver]) {
  //
  //         const data = items[driver][paramstring];
  //
  //         KarmaFieldsAlpha.Store.Delta.remove("items", driver, paramstring);
  //
  //         KarmaFieldsAlpha.Store.set(data.map(item => ({id: item.id})), "items", "cache", driver, paramstring);
  //         KarmaFieldsAlpha.Store.remove("items", "remote", driver, paramstring);
  //
  //         for (let row of data) {
  //
  //           if (row.delta) {
  //
  //             for (let key in row.delta) {
  //
  //               KarmaFieldsAlpha.Store.set(row.delta[key], "vars", "cache", driver, row.id, key);
  //               KarmaFieldsAlpha.Store.remove("vars", "remote", driver, row.id, key);
  //
  //             }
  //
  //           }
  //
  //         }
  //
  //         await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, data);
  //
  //       }
  //
  //     }
  //
  //   }
  //
  //   const trash = KarmaFieldsAlpha.Store.Delta.get("trash");
  //
  //   if (trash) {
  //
  //     for (let driver in trash) {
  //
  //       const ids = trash[driver];
  //
  //       KarmaFieldsAlpha.Store.Delta.delete("trash", driver);
  //
  //       if (ids && ids.length) {
  //
  //         await KarmaFieldsAlpha.HTTP.post(`sync/${driver}`, ids.map(id => ({id: id, delta: {trash: ["1"]}})));
  //
  //       }
  //
  //     }
  //
  //   }
  //
  // }

}
